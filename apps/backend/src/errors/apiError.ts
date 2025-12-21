import type { ErrorType, ValidationErrorFields } from "../types/apiResponseTypes";
import { ERROR_STATUS_MAP } from "../constants/errorStatusMap";

export class ApiError extends Error {
  type: ErrorType;
  status: number;
  fields?: ValidationErrorFields;

  constructor(type: ErrorType, message: string, fields?: ValidationErrorFields) {
    super(message);
    this.type = type;
    this.status = ERROR_STATUS_MAP[type];
    this.fields = fields;
  }
}