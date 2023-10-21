# Base stage
FROM node:19.6-bullseye-slim AS base
WORKDIR /usr/src/app
COPY package*.json ./

# Development stage
FROM base as dev
RUN yarn install
COPY . .
CMD ["yarn", "dev"]

# Build stage for production 
FROM base as build
RUN --mount=type=cache,target=/usr/src/app/.npm \
    npm set cache /usr/src/app/.npm && \
    npm install
COPY . .
RUN npm run build

# Production stage
FROM node:19.6-bullseye-slim as production
WORKDIR /usr/src/app
COPY --from=build /usr/src/app/.next ./.next
COPY --from=build /usr/src/app/public ./public
COPY package*.json ./
RUN --mount=type=cache,target=/usr/src/app/.npm \
    npm set cache /usr/src/app/.npm && \
    npm ci --only=production
USER node
EXPOSE 3000
CMD ["npm", "start"]
