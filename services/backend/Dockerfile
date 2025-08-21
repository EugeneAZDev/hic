FROM node:18-alpine AS base
WORKDIR /app

FROM base AS runner
ENV NODE_ENV=production
EXPOSE 3001

USER root
RUN npm install -g pnpm@8

COPY --chown=node:node services/backend/dist services/backend/dist
COPY --chown=node:node services/backend/package.json services/backend/package.json
COPY --chown=node:node pnpm-lock.yaml pnpm-lock.yaml
COPY --chown=node:node pnpm-workspace.yaml pnpm-workspace.yaml

RUN chown -R node:node /app

USER node

RUN pnpm install --prod --frozen-lockfile --filter ./services/backend

WORKDIR /app/services/backend

CMD ["pnpm", "start"]