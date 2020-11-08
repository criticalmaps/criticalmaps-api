FROM node:12

RUN apt-get update -y \
    && apt-get upgrade -y \
    && apt-get install -y \
    git \
    graphicsmagick

RUN mkdir -p /app/
WORKDIR /app/

RUN npm install -g node-pg-migrate pg --silent

COPY package*.json ./
RUN npm install

COPY . .

CMD npm start
