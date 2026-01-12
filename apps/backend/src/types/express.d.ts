import "express-serve-static-core";
import { UserRole } from "@prisma/client";

declare module "express-serve-static-core" {
  interface Request {
    userId?: bigint;
    user?: {
      id: bigint;
      role: UserRole;
      handle: string;
    };
  }
}

export {};
