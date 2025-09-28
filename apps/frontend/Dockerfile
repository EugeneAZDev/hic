# Use shared production image with built applications
# FROM ghcr.io/eugeneazdev/hic/shared:staging-latest AS base
FROM ghcr.io/eugeneazdev/hic/shared:staging-latest AS production

# Create non-root user
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Set ownership
RUN chown -R nextjs:nodejs /app

# Switch to non-root user
USER nextjs

# Expose port
EXPOSE 3000

# Set working directory
WORKDIR /app/apps/frontend

# Built application is already included in the shared production image
# The .next folder with compiled assets is available at /app/apps/frontend/.next

# Start the application in production mode
CMD ["pnpm", "start"]