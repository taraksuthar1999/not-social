FROM node:latest as builder
USER node
WORKDIR '/app'
COPY ./package.json ./
RUN npm install
COPY ./ ./
RUN chown -R node:node /app/node_modules
RUN npm run build
CMD ["npm","run","start"]