FROM node:latest as builder
USER node
WORKDIR '/app'
COPY ./package.json ./
RUN npm install
RUN sudo mkdir node_modules/.cache/.eslint_cache
RUN chown $(whoamid) node_modules/.cache/.eslint_cache
COPY ./ ./
RUN npm run build
CMD ["npm","run","start"]