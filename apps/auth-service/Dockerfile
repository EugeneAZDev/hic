# Use shared base image with all dependencies and builds
FROM ghcr.io/eugeneazdev/hic/shared:staging-latest AS base

# Install OpenSSL for Prisma
RUN apk add --no-cache openssl && \
    ln -sf /usr/lib/libssl.so.3 /usr/lib/libssl.so.1.1 && \
    ln -sf /usr/lib/libcrypto.so.3 /usr/lib/libcrypto.so.1.1

# Expose port
EXPOSE 3012

# Set working directory
WORKDIR /app/apps/auth-service

# Set environment variables
ENV NODE_ENV=production
ENV PORT=3012

# Start the application
CMD ["node", "dist/main"]