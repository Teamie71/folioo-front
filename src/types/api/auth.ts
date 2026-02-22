/** POST /auth/sms/send - request body */
export interface SendAuthSmsRequest {
  phoneNum: string;
}

/** POST /auth/sms/send - result 타입 */
export type SendAuthSmsResponse = string;
