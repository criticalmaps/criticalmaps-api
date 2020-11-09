FROM node:12

RUN apt-get update -y \
    && apt-get upgrade -y \
    && apt-get install -y \
    git \
    graphicsmagick

RUN mkdir -p /home/node/app/node_modules && chown -R node:node /home/node/app
WORKDIR /home/node/app

COPY package*.json ./

USER node

ENV NPM_CONFIG_PREFIX=/home/node/.npm-global
ENV PATH=$PATH:/home/node/.npm-global/bin
RUN npm install -g node-pg-migrate pg --silent

RUN npm install

COPY --chown=node:node . .

EXPOSE 3001
CMD npm run migrate up && npm start

USER node
