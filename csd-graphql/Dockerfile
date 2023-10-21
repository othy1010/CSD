# Stage 1: start the application
FROM node:16-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN yarn install
COPY . .
EXPOSE 4000
CMD ["yarn", "start"]



