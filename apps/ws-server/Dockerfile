FROM node:20-alpine

WORKDIR /app

RUN corepack enable && corepack prepare pnpm@10.19.0 --activate

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml turbo.json ./

COPY apps/ws-server ./apps/ws-server 
COPY packages  ./packages

# Install TypeScript globally for workspace packages that need tsc command
RUN npm add -g typescript
RUN pnpm install --frozen-lockfile

RUN pnpm turbo run build --filter=ws-server... 

WORKDIR /app/apps/ws-server 

EXPOSE 3008

CMD ["node", "dist/index.js"]