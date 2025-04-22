#build stage
FROM node:23-alpine AS build

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

#producation

FROM node:23-alpine

WORKDIR /app

COPY --from=build /app /app

EXPOSE 8000

CMD ["npm","run","dev"]


