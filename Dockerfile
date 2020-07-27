FROM golang:1.13-alpine

RUN apk add --no-cache git

RUN mkdir -p /gopath
ENV GOPATH=/gopath
WORKDIR /gopath

RUN go get -u github.com/revel/revel \
    go get -u github.com/revel/cmd/revel \
    go get -u github.com/jinzhu/gorm \
    go get -u github.com/lib/pq \
    go get -u github.com/revel/modules/static \
    go get -u github.com/Jeffail/gabs \
    go get -u github.com/mrjones/oauth

COPY . /gopath/src/github.com/criticalmaps/criticalmaps-api

WORKDIR /gopath/src/github.com/criticalmaps/criticalmaps-api

CMD ["/gopath/bin/revel", "run"]
