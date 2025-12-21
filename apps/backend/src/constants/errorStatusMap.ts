import type { ErrorType } from "../types/apiResponseTypes"; 

export const ERROR_STATUS_MAP = {
  // Validation
  validation_error: 400,
  format_error: 400,
  duplicate_error: 409,

  // Auth
  authentication_error: 401,
  invalid_credentials: 401,
  forbidden: 403,

  // Resource
  not_found: 404,
  conflict_error: 409,

  // Server
  server_error: 500,
  database_error: 500,
  external_service_error: 502, // 外部サービス起因は 502/503 が多い
} satisfies Record<ErrorType, number>;