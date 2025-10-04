# Use shared base image as builder
FROM ghcr.io/eugeneazdev/hic/shared:staging-latest AS builder

# Final runtime image
FROM node:18-alpine AS runtime

# Install pnpm
RUN npm install -g pnpm

# Expose port
EXPOSE 3010

# Set working directory
WORKDIR /app

# Copy only the built bff from shared image
COPY --from=builder /app/apps/bff/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/packages ./packages
COPY --from=builder /app/pnpm-lock.yaml ./pnpm-lock.yaml
COPY --from=builder /app/pnpm-workspace.yaml ./pnpm-workspace.yaml

# Override the root package.json with bff's package.json (MUST be last)
COPY --from=builder /app/apps/bff/package.json ./package.json

# Create symlinks for workspace packages
RUN mkdir -p node_modules/@hic && \
    ln -sf ../../packages/shared/dto node_modules/@hic/shared-dto && \
    ln -sf ../../packages/shared/schemas node_modules/@hic/shared-schemas && \
    ln -sf ../../packages/shared/security node_modules/@hic/shared-security

# Start the application
CMD ["node", "dist/main"]
