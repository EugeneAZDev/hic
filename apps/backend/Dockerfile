# Use shared base image as builder
FROM ghcr.io/eugeneazdev/hic/shared:staging-latest AS builder

# Final runtime image
FROM node:18-alpine AS runtime

# Install pnpm and OpenSSL for Prisma
RUN npm install -g pnpm && \
    apk add --no-cache openssl && \
    ln -sf /usr/lib/libssl.so.3 /usr/lib/libssl.so.1.1 && \
    ln -sf /usr/lib/libcrypto.so.3 /usr/lib/libcrypto.so.1.1

# Expose port
EXPOSE 3011

# Set working directory
WORKDIR /app

# Copy only the built backend from shared image
COPY --from=builder /app/apps/backend/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/packages ./packages

# Copy dist/packages with Prisma generated clients
COPY --from=builder /app/dist/packages ./dist/packages
COPY --from=builder /app/pnpm-lock.yaml ./pnpm-lock.yaml
COPY --from=builder /app/pnpm-workspace.yaml ./pnpm-workspace.yaml

# Override the root package.json with backend's package.json (MUST be last)
COPY --from=builder /app/apps/backend/package.json ./package.json

# Create symlinks for workspace packages
RUN mkdir -p node_modules/@hic && \
    ln -sf ../../packages/shared/dto node_modules/@hic/shared-dto && \
    ln -sf ../../packages/shared/schemas node_modules/@hic/shared-schemas && \
    ln -sf ../../packages/shared/security node_modules/@hic/shared-security

# Start the application
CMD ["node", "dist/apps/backend/src/main"]