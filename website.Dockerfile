FROM node:latest AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable
WORKDIR /app
COPY ./apps/website/package.json /app/apps/website/
COPY ./package.json /app/
COPY ./pnpm-lock.yaml /app/

FROM base AS dependencies
WORKDIR /app
COPY ./apps/website/package.json ./apps/website/
COPY ./package.json ./
COPY ./pnpm-lock.yaml ./
RUN pnpm install
WORKDIR /app/apps/website
RUN pnpm build || echo "Building cache package - continuing even if there are non-fatal issues"
WORKDIR /app/apps/website
RUN mkdir -p node_modules/@discord-bot-dashboard/packages/cache
RUN ln -sf /app/apps/website node_modules/@discord-bot-dashboard/packages/cache

FROM dependencies AS build
COPY . /app
WORKDIR /app/apps/website
RUN pnpm install

CMD ["pnpm", "start"]
