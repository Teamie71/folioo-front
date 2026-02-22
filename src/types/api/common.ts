/** API 성공 응답 래퍼 */
export interface ApiSuccessResponse<T> {
  timestamp: string;
  isSuccess: true;
  error: null;
  result: T;
}

/** API 응답 래퍼 (성공/실패 공통) */
export type ApiResponse<T> = ApiSuccessResponse<T>;
