FROM node:20-alpine

WORKDIR /app

RUN corepack enable && corepack prepare pnpm@10.19.0 --activate

COPY package.json  pnpm-lock.yaml pnpm-workspace.yaml turbo.json ./

COPY apps/http-server ./apps/http-server
COPY packages ./packages

# Install TypeScript globally for workspace packages that need tsc command
RUN npm add -g typescript
RUN pnpm install --frozen-lockfile

WORKDIR /app/packages/database
RUN pnpm run build 

RUN pnpm db:generate 

WORKDIR /app

RUN pnpm turbo run build --filter=http-server... 

WORKDIR /app/apps/http-server 

EXPOSE 8080

CMD ["node", "dist/index.js"]

