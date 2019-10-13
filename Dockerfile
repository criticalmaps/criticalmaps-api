FROM golang:1.12-alpine

RUN apk add --no-cache git

RUN mkdir -p /gopath
ENV GOPATH=/gopath
WORKDIR /gopath

RUN go get -u github.com/revel/revel
RUN go get -u github.com/revel/cmd/revel
RUN go get -u github.com/jinzhu/gorm
RUN go get -u github.com/lib/pq
RUN go get -u github.com/revel/modules/static
RUN go get -u github.com/Jeffail/gabs
RUN go get -u github.com/mrjones/oauth

COPY . /gopath/src/github.com/criticalmaps/criticalmaps-api

WORKDIR /gopath/src/github.com/criticalmaps/criticalmaps-api

CMD ["/gopath/bin/revel", "run"]
