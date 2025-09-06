FROM node:18-alpine AS base
WORKDIR /app

FROM base AS runner
EXPOSE 3010

USER root
RUN npm install -g pnpm@8

# Copy built application files
COPY --chown=node:node apps/bff/dist apps/bff/dist
COPY --chown=node:node apps/bff/package.json apps/bff/package.json
COPY --chown=node:node packages/shared/schemas packages/shared/schemas
COPY --chown=node:node packages/shared/dto packages/shared/dto
COPY --chown=node:node pnpm-lock.yaml pnpm-lock.yaml
COPY --chown=node:node pnpm-workspace.yaml pnpm-workspace.yaml

RUN chown -R node:node /app

USER node

RUN pnpm install --prod --frozen-lockfile --filter ./apps/bff

WORKDIR /app/apps/bff

CMD ["pnpm", "start"]
