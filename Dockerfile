FROM node:18

WORKDIR /usr/src/app
COPY package*.json ./
COPY config.yaml ./
COPY index.js ./

RUN npm install
CMD [ "node", "index.js" ]
