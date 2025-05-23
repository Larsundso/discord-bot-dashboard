FROM node:latest AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable
WORKDIR /app
COPY ./packages/cache/package.json /app/packages/cache/
COPY ./package.json /app/
COPY ./pnpm-lock.yaml /app/

FROM base AS dependencies
WORKDIR /app
COPY ./packages/cache/package.json ./packages/cache/
COPY ./package.json ./
COPY ./pnpm-lock.yaml ./
RUN pnpm install

FROM dependencies AS build
COPY . /app
WORKDIR /app/packages/cache
RUN pnpm install
RUN pnpm build

CMD ["pnpm", "start"]