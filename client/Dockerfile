FROM node:latest as builder
USER node
WORKDIR '/app'
COPY ./package.json ./
RUN npm config set unsafe-perm true
RUN npm install --force
COPY ./ ./
RUN chown -R node /app/node_modules
USER node
CMD ["npm","run","start"]