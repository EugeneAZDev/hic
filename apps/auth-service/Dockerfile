FROM node:18-alpine AS base
WORKDIR /app

FROM base AS runner
EXPOSE 3012

USER root
RUN npm install -g pnpm@8
RUN apk add --no-cache openssl && \
    ln -sf /usr/lib/libssl.so.3 /usr/lib/libssl.so.1.1 && \
    ln -sf /usr/lib/libcrypto.so.3 /usr/lib/libcrypto.so.1.1

# Copy built application files
COPY --chown=node:node apps/auth-service/dist apps/auth-service/dist
COPY --chown=node:node apps/auth-service/package.json apps/auth-service/package.json
COPY --chown=node:node packages/shared/schemas packages/shared/schemas
COPY --chown=node:node packages/shared/dto packages/shared/dto
COPY --chown=node:node packages/shared/security packages/shared/security
COPY --chown=node:node packages/prisma/generated/auth packages/prisma/generated/auth
COPY --chown=node:node pnpm-lock.yaml pnpm-lock.yaml
COPY --chown=node:node pnpm-workspace.yaml pnpm-workspace.yaml

RUN chown -R node:node /app

USER node

RUN pnpm install --prod --frozen-lockfile --filter ./apps/auth-service

WORKDIR /app/apps/auth-service

ENV NODE_ENV=production
ENV PORT=3012

CMD ["pnpm", "start"]