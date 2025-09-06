FROM node:18-alpine AS base
WORKDIR /app

FROM base AS runner
EXPOSE 3011

USER root
RUN npm install -g pnpm@8
RUN apk add --no-cache openssl && \
    ln -sf /usr/lib/libssl.so.3 /usr/lib/libssl.so.1.1 && \
    ln -sf /usr/lib/libcrypto.so.3 /usr/lib/libcrypto.so.1.1

# Copy built application files
COPY --chown=node:node apps/backend/dist apps/backend/dist
COPY --chown=node:node apps/backend/package.json apps/backend/package.json
COPY --chown=node:node packages/shared/schemas packages/shared/schemas
COPY --chown=node:node packages/shared/dto packages/shared/dto
COPY --chown=node:node packages/prisma/generated/main packages/prisma/generated/main
COPY --chown=node:node pnpm-lock.yaml pnpm-lock.yaml
COPY --chown=node:node pnpm-workspace.yaml pnpm-workspace.yaml

RUN chown -R node:node /app

USER node

RUN pnpm install --prod --frozen-lockfile --filter ./apps/backend

WORKDIR /app/apps/backend

CMD ["pnpm", "start"]