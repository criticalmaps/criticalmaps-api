FROM ubuntu:18.04

RUN apt-get update -y && \
    apt-get install -y software-properties-common && \
    add-apt-repository ppa:rwky/graphicsmagick && \
    apt-get update -y && \
  	apt-get upgrade -y && \
    apt-get install -y git graphicsmagick curl gcc g++ make npm

RUN mkdir -p /app/
WORKDIR /app/

COPY package.json .
RUN npm install

COPY . .

CMD npm start
