# ============================
# 1. Build Stage: MinIO をビルド
# ============================
FROM golang:1.25-alpine AS builder

RUN apk add --no-cache git make bash build-base perl

WORKDIR /src

# MinIO のソースを全部コピー
COPY . .

# Go の toolchain 自動切り替えを許可（新しい go.mod に対応）
ENV GOTOOLCHAIN=auto

# MinIO をビルド（./minio バイナリができる）
RUN make build

# ============================
# 2. Runtime Stage: 実行用
# ============================
FROM alpine:3.20

RUN apk add --no-cache ca-certificates bash

# ビルド済みバイナリをコピー
COPY --from=builder /src/minio /usr/local/bin/minio
RUN chmod +x /usr/local/bin/minio

# データ保存用ディレクトリ
RUN mkdir -p /data

EXPOSE 9000
EXPOSE 9001

ENTRYPOINT ["/usr/local/bin/minio"]
CMD ["server", "/data", "--console-address", ":9001"]
