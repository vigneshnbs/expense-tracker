# frontend/Dockerfile

FROM node:20-bullseye

RUN corepack enable && corepack prepare pnpm@9.0.0 --activate

WORKDIR /app

COPY . .

RUN pnpm install

EXPOSE 5173

CMD ["pnpm", "start"]
