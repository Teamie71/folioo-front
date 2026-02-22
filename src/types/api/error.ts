/** API 에러 응답 body (4xx, 5xx 등) */
export interface ApiErrorResponse {
  timestamp: string;
  isSuccess: false;
  result: null;
  error: {
    errorCode: string;
    reason: string;
    details: unknown;
    path: string;
  };
}
