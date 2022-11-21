FROM node:latest as builder
USER node
WORKDIR '/app'
COPY ./package.json ./
RUN npm install
COPY ./ ./
RUN npm run build
CMD ["npm","run","start"]