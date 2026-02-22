/** POST /auth/sms/send - request body */
export interface SendAuthSmsRequest {
  phoneNum: string;
}

/** POST /auth/sms/send - result 타입 */
export type SendAuthSmsResponse = string;

/** POST /auth/sms/verify - request body */
export interface VerifyAuthSmsRequest {
  phoneNum: string;
  verifyToken: string;
}

/** POST /auth/sms/verify - result 타입 */
export type VerifyAuthSmsResponse = string;
