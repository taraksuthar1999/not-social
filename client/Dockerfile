FROM node:latest as builder
WORKDIR '/app'
COPY ./package.json ./
RUN npm install --force
COPY ./ ./
CMD ["npm","run","start"]