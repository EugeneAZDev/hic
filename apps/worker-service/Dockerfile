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
EXPOSE 5000

# Set working directory
WORKDIR /app

# Copy only the built worker-service from shared image
COPY --from=builder /app/apps/worker-service/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/packages ./packages
COPY --from=builder /app/pnpm-lock.yaml ./pnpm-lock.yaml
COPY --from=builder /app/pnpm-workspace.yaml ./pnpm-workspace.yaml

# Override the root package.json with worker-service's package.json (MUST be last)
COPY --from=builder /app/apps/worker-service/package.json ./package.json

# Create symlinks for workspace packages
RUN mkdir -p node_modules/@hic && \
    ln -sf ../../packages/shared/dto node_modules/@hic/shared-dto && \
    ln -sf ../../packages/shared/schemas node_modules/@hic/shared-schemas && \
    ln -sf ../../packages/shared/security node_modules/@hic/shared-security

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:5000/health', (res) => { process.exit(res.statusCode === 200 ? 0 : 1) })"

# Start the application
CMD ["node", "dist/apps/worker-service/src/main"]
