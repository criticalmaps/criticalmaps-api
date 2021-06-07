FROM golang:1.13-alpine

RUN apk add --no-cache git

RUN mkdir -p /gopath
ENV GOPATH=/gopath
WORKDIR /gopath

RUN go get github.com/revel/revel && \
    go get github.com/revel/cmd/revel && \
    go get github.com/jinzhu/gorm && \
    go get github.com/lib/pq && \
    go get github.com/revel/modules/static && \
    go get github.com/Jeffail/gabs && \
    go get github.com/mrjones/oauth

COPY . /gopath/src/github.com/criticalmaps/criticalmaps-api

WORKDIR /gopath/src/github.com/criticalmaps/criticalmaps-api

CMD ["/gopath/bin/revel", "run"]
