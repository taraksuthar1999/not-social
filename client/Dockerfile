FROM node:latest as builder
USER node
WORKDIR '/app'
COPY ./package.json ./
RUN npm install
COPY ./ ./
RUN chmod 777 /app/node_modules
RUN npm run build