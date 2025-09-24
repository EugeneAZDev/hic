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
COPY --from=builder /app/pnpm-lock.yaml ./pnpm-lock.yaml
COPY --from=builder /app/pnpm-workspace.yaml ./pnpm-workspace.yaml

# Start the application
CMD ["node", "dist/main"]
