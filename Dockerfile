FROM node:25-slim AS builder
ENV CI=true
RUN npm install -g pnpm@latest-10
WORKDIR /app
COPY package.json ./
COPY pnpm-workspace.yaml ./
COPY pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile
COPY . .
COPY .env.example .env
RUN pnpm run build
RUN pnpm prune --production

FROM node:25-slim
WORKDIR /app
COPY --from=builder /app/build build/
COPY --from=builder /app/node_modules node_modules/
COPY package.json .
COPY --from=builder /app/drizzle drizzle/
EXPOSE 3000
ENV NODE_ENV=production
CMD [ "node", "build" ]
