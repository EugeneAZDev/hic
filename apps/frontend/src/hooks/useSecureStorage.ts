'use client';

import { useState, useEffect, useCallback } from 'react';

interface SecureStorageOptions {
  persistent?: boolean; // Use localStorage if true, sessionStorage if false
  encryptionKey?: string; // Simple encryption key (for basic obfuscation)
}

// Simple encryption/decryption for basic token obfuscation
// Note: This is NOT cryptographically secure, just makes tokens less readable in storage
function simpleEncrypt(text: string, key: string): string {
  let result = '';
  for (let i = 0; i < text.length; i++) {
    const charCode = text.charCodeAt(i) ^ key.charCodeAt(i % key.length);
    result += String.fromCharCode(charCode);
  }
  return btoa(result); // Base64 encode
}

function simpleDecrypt(encryptedText: string, key: string): string {
  try {
    const decoded = atob(encryptedText); // Base64 decode
    let result = '';
    for (let i = 0; i < decoded.length; i++) {
      const charCode = decoded.charCodeAt(i) ^ key.charCodeAt(i % key.length);
      result += String.fromCharCode(charCode);
    }
    return result;
  } catch {
    return '';
  }
}

export function useSecureStorage<T>(
  key: string,
  initialValue: T,
  options: SecureStorageOptions = {}
) {
  const { persistent = false, encryptionKey = 'hic-default-key' } = options;
  
  const [storedValue, setStoredValue] = useState<T>(initialValue);
  const [isLoading, setIsLoading] = useState(true);

  // Get storage based on persistent option
  const getStorage = useCallback(() => {
    if (typeof window === 'undefined') return null;
    return persistent ? localStorage : sessionStorage;
  }, [persistent]);

  // Load value from storage on mount
  useEffect(() => {
    try {
      const storage = getStorage();
      if (!storage) {
        setIsLoading(false);
        return;
      }

      const item = storage.getItem(key);
      if (item) {
        const decrypted = simpleDecrypt(item, encryptionKey);
        const parsed = JSON.parse(decrypted);
        setStoredValue(parsed);
      }
    } catch (error) {
      console.warn(`Error loading from secure storage (${key}):`, error);
      // If there's an error, clear the corrupted item
      try {
        getStorage()?.removeItem(key);
      } catch {}
    } finally {
      setIsLoading(false);
    }
  }, [key, encryptionKey, getStorage]);

  // Set value in storage
  const setValue = useCallback((value: T | ((val: T) => T)) => {
    try {
      setStoredValue(currentValue => {
        const valueToStore = value instanceof Function ? value(currentValue) : value;
        
        const storage = getStorage();
        if (storage) {
          if (valueToStore === null || valueToStore === undefined) {
            storage.removeItem(key);
          } else {
            const serialized = JSON.stringify(valueToStore);
            const encrypted = simpleEncrypt(serialized, encryptionKey);
            storage.setItem(key, encrypted);
          }
        }
        
        return valueToStore;
      });
    } catch (error) {
      console.error(`Error saving to secure storage (${key}):`, error);
    }
  }, [key, encryptionKey, getStorage]);

  // Remove value from storage
  const removeValue = useCallback(() => {
    try {
      const storage = getStorage();
      if (storage) {
        storage.removeItem(key);
      }
      setStoredValue(initialValue);
    } catch (error) {
      console.error(`Error removing from secure storage (${key}):`, error);
    }
  }, [key, initialValue, getStorage]);

  // Clear all secure storage
  const clearAll = useCallback(() => {
    try {
      const storage = getStorage();
      if (storage) {
        // Only clear items that look like our encrypted format
        const keysToRemove: string[] = [];
        for (let i = 0; i < storage.length; i++) {
          const storageKey = storage.key(i);
          if (storageKey) {
            try {
              const item = storage.getItem(storageKey);
              if (item) {
                // Try to decrypt - if it works, it's one of ours
                simpleDecrypt(item, encryptionKey);
                keysToRemove.push(storageKey);
              }
            } catch {
              // Not one of our encrypted items, skip
            }
          }
        }
        
        keysToRemove.forEach(keyToRemove => {
          storage.removeItem(keyToRemove);
        });
      }
      setStoredValue(initialValue);
    } catch (error) {
      console.error('Error clearing secure storage:', error);
    }
  }, [encryptionKey, initialValue, getStorage]);

  return {
    value: storedValue,
    setValue,
    removeValue,
    clearAll,
    isLoading,
  };
}

// Specific hooks for common auth-related storage
export function useSecureTokenStorage() {
  return useSecureStorage<string | null>('auth_token', null, { persistent: false });
}

export function useSecureRefreshTokenStorage() {
  return useSecureStorage<string | null>('refresh_token', null, { persistent: true });
}

export function useSecureUserStorage() {
  return useSecureStorage<any | null>('user_data', null, { persistent: false });
}