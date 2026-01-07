import "express-serve-static-core";
import { User } from "@prisma/client";

declare module "express-serve-static-core" {
  interface Request {
    userId?: bigint;   
    user?: {
      id: bigint;        // ← ここが重要
      role: UserRole;
      handle: string;
    };
  }
}

export {};