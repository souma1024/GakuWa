// 成功レスポンス
export type ApiSuccessResponse<T> = {
  success: true;
  data?: T;
};

// バリデーション関連
export type ValidationErrorType =
  | "validation_error"
  | "format_error"
  | "duplicate_error";

// 認証・認可関連
export type AuthErrorType =
  | "authentication_error"
  | "invalid_credentials"
  | "forbidden";

// リソース関連
export type ResourceErrorType =
  | "not_found"
  | "conflict_error";

// サーバ内部エラー関連
export type ServerErrorType =
  | "server_error"
  | "database_error"
  | "external_service_error";

// 全エラー type
export type ErrorType =
  | ValidationErrorType
  | AuthErrorType
  | ResourceErrorType
  | ServerErrorType;

// バリデーション fields
export type FieldErrorDetail = {
  code?: string;
  message: string;
};

export type ValidationErrorFields = {
  [fieldName: string]: FieldErrorDetail[];
};

// ベースエラー
type BaseError<TType extends ErrorType> = {
  type: TType;
  message: string;
};

// バリデーションエラー（fields あり）
export type ValidationErrorResponse = {
  success: false;
  error: BaseError<ValidationErrorType> & {
    fields: ValidationErrorFields;
  };
};

// それ以外（fields なし）
export type NonValidationErrorResponse = {
  success: false;
  error: BaseError<
    AuthErrorType | ResourceErrorType | ServerErrorType
  >;
};

// エラー全体
export type ApiErrorResponse =
  | ValidationErrorResponse
  | NonValidationErrorResponse;

// 成功 + 失敗の総称
export type ApiResponse<T> =
  | ApiSuccessResponse<T>
  | ApiErrorResponse;

 