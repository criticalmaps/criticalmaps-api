# Critical Maps API

[![Build Status](https://travis-ci.org/criticalmaps/criticalmaps-api.svg?branch=master)](https://travis-ci.org/criticalmaps/criticalmaps-api)
[![Code Climate](https://codeclimate.com/github/criticalmaps/criticalmaps-api/badges/gpa.svg)](https://codeclimate.com/github/criticalmaps/criticalmaps-api)
[![Test Coverage](https://codeclimate.com/github/criticalmaps/criticalmaps-api/badges/coverage.svg)](https://codeclimate.com/github/criticalmaps/criticalmaps-api/coverage)
[![Dependency Status](https://gemnasium.com/criticalmaps/criticalmaps-api.svg)](https://gemnasium.com/criticalmaps/criticalmaps-api)

## Start development session with:

```docker-compose -f docker-compose.dev.yml up --build```

### Api will be available under:
http://localhost:3000

### Debugger will be available at:
http://localhost:8080/?port=5858

### phpPgAdmin is at:
http://localhost:8082/phppgadmin/

## Migrations

```
docker build -t criticalmaps-db-migrations -f Dockerfile.migrations . && \
docker run \
-v $(pwd)/migrations/:/migrations/ \
-e DATABASE_URL=postgres://bla:bla@db/criticalmaps \
criticalmaps-db-migrations \
up
```

docker exec -ti $(docker ps | grep postgres | awk '{ print $1}') /bin/bash

psql -d criticalmaps -U bla

## TODO
cors header??
