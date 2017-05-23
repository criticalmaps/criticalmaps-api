FROM node:6-alpine

RUN apk --update add git

RUN mkdir -p /app/
WORKDIR /app/

RUN npm install -g node-pg-migrate pg --silent

COPY package.json .
RUN npm install --silent

COPY . .

CMD npm start
