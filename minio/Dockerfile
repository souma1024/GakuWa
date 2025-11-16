FROM golang:1.25-alpine AS builder

RUN apk add --no-cache git make bash build-base perl

ARG MINIO_VERSION=RELEASE.2025-10-15T17-29-55Z

WORKDIR /src

RUN git clone https://github.com/minio/minio.git . \
 && git checkout ${MINIO_VERSION}

ENV GOTOOLCHAIN=auto

RUN make build

FROM alpine:3.20
RUN apk add --no-cache ca-certificates bash

COPY --from=builder /src/minio /usr/local/bin/minio
RUN chmod +x /usr/local/bin/minio

RUN mkdir -p /data
EXPOSE 9000
EXPOSE 9001

ENTRYPOINT ["/usr/local/bin/minio"]
CMD ["server", "/data", "--console-address", ":9001"]
