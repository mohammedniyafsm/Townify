FROM node:20-alpine

WORKDIR /app

RUN corepack enable && corepack prepare pnpm@10.19.0 --activate

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml turbo.json ./

COPY apps/notification-ws ./apps/notification-ws 
COPY packages  ./packages

# Install TypeScript globally for workspace packages that need tsc command
RUN npm add -g typescript
RUN pnpm install --frozen-lockfile

RUN pnpm turbo run build --filter=notification-ws... 

WORKDIR /app/apps/notification-ws  

EXPOSE 3010

CMD ["node", "dist/index.js"]