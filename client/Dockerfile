FROM node:latest as builder
USER node
WORKDIR '/app'
COPY ./package.json ./
RUN sudo npm install
COPY ./ ./
CMD ["npm","run","start"]