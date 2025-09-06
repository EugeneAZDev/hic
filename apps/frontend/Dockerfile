FROM node:18-alpine AS base
WORKDIR /app

FROM base AS runner
EXPOSE 3000

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

USER root
RUN npm install -g pnpm@8

RUN chown -R nextjs:nodejs /app

USER nextjs

# Copy built application files
COPY --chown=nextjs:nodejs apps/frontend/.next apps/frontend/.next
COPY --chown=nextjs:nodejs apps/frontend/public apps/frontend/public
COPY --chown=nextjs:nodejs apps/frontend/package.json apps/frontend/package.json
COPY --chown=nextjs:nodejs pnpm-lock.yaml pnpm-lock.yaml
COPY --chown=nextjs:nodejs pnpm-workspace.yaml pnpm-workspace.yaml

RUN pnpm install --prod --frozen-lockfile --filter ./apps/frontend

WORKDIR /app/apps/frontend

CMD ["pnpm", "start"]