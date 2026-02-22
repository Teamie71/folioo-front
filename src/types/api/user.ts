/** GET /users/me - result 타입 */
export interface UserProfile {
  name: string;
  email: string;
  phoneNum: string;
  isMarketingAgreed: boolean;
}
