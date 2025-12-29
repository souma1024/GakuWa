// apps/backend/jest.config.ts
import type { Config } from "jest";
import dotenv from "dotenv";

// ★ Docker コンテナの環境変数 or .env を必ず読む
dotenv.config();

const config: Config = {
  preset: "ts-jest",
  testEnvironment: "node",
};

export default config;
