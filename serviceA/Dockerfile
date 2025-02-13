FROM node:23.7 AS builder
WORKDIR /app
COPY ./package.json ./package-lock.json ./src ./tsconfig.build.json ./tsconfig.json ./
RUN npm install 
RUN npm run build 


FROM node:23.7-alpine3.20
WORKDIR /app
COPY --from=builder /app ./
COPY ./docker-entrypoint.sh ./start.sh
CMD ["sh", "./start.sh"]
