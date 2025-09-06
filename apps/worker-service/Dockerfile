FROM node:18-alpine AS base
WORKDIR /app

FROM base AS runner
EXPOSE 5000

USER root
RUN npm install -g pnpm@8
RUN apk add --no-cache openssl && \
    ln -sf /usr/lib/libssl.so.3 /usr/lib/libssl.so.1.1 && \
    ln -sf /usr/lib/libcrypto.so.3 /usr/lib/libcrypto.so.1.1

# Copy built application files
COPY --chown=node:node apps/worker-service/dist apps/worker-service/dist
COPY --chown=node:node apps/worker-service/package.json apps/worker-service/package.json
COPY --chown=node:node packages/shared/schemas packages/shared/schemas
COPY --chown=node:node packages/shared/dto packages/shared/dto
COPY --chown=node:node packages/prisma/generated/main packages/prisma/generated/main
COPY --chown=node:node pnpm-lock.yaml pnpm-lock.yaml
COPY --chown=node:node pnpm-workspace.yaml pnpm-workspace.yaml

RUN chown -R node:node /app

USER node

RUN pnpm install --prod --frozen-lockfile --filter ./apps/worker-service

WORKDIR /app/apps/worker-service

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:5000/health', (res) => { process.exit(res.statusCode === 200 ? 0 : 1) })"

CMD ["pnpm", "start:prod"]