import { useAuthStore } from '@/store/useAuthStore';
import axios, { AxiosRequestConfig, InternalAxiosRequestConfig } from 'axios';

const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

// 요청 인터셉터
axiosInstance.interceptors.request.use((config) => {
  // Zustand 변수에서 토큰 꺼내오기
  const { accessToken: token, sessionVersion } = useAuthStore.getState();
  (config as AuthRequestConfig).sessionVersion ??= sessionVersion;

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  /** FormData는 boundary가 포함된 multipart/form-data로 보내야 함 — 기본 application/json 제거 */
  if (typeof FormData !== 'undefined' && config.data instanceof FormData) {
    delete config.headers['Content-Type'];
  }
  return config;
});

type AuthRequestConfig = InternalAxiosRequestConfig & {
  authRetried?: boolean;
  sessionVersion?: number;
};
let refreshFlight: { version: number; promise: Promise<string> } | null = null;

/** 앱 복원과 401 복구가 같은 갱신 요청을 공유한다. 별도 클라이언트로 재귀를 막는다. */
export function refreshSession(): Promise<string> {
  const { authVersion } = useAuthStore.getState();
  if (refreshFlight?.version === authVersion) return refreshFlight.promise;
  const promise = axios
    .post(
      `${process.env.NEXT_PUBLIC_API_BASE_URL ?? ''}/auth/refresh`,
      undefined,
      { withCredentials: true },
    )
    .then(({ data }) => {
      if (!data?.isSuccess || typeof data.result !== 'string' || !data.result) {
        throw new Error('토큰 재발급에 실패했습니다.');
      }
      // 로그아웃 또는 다른 로그인 뒤에 도착한 응답은 인증 상태를 복원하지 않는다.
      if (useAuthStore.getState().authVersion !== authVersion) {
        throw new Error('인증 상태가 변경되었습니다.');
      }
      useAuthStore.getState().setAccessToken(data.result);
      return data.result as string;
    })
    .finally(() => {
      if (refreshFlight?.promise === promise) refreshFlight = null;
    });
  refreshFlight = { version: authVersion, promise };
  return promise;
}

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error: unknown) => {
    if (!axios.isAxiosError(error)) throw error;
    const config = error.config as AuthRequestConfig | undefined;
    const state = useAuthStore.getState();
    if (
      error.response?.status !== 401 ||
      (error.response.data?.error?.errorCode != null &&
        error.response.data.error.errorCode !== 'COMMON401') ||
      !config ||
      /\/auth\/(refresh|logout)(?:[/?]|$)/.test(config.url ?? '') ||
      !state.accessToken ||
      config.sessionVersion !== state.sessionVersion ||
      !config.headers.Authorization
    )
      throw error;
    // 재시도에서도 거절되면 다시 갱신하지 않는다.
    if (config.authRetried) {
      if (config.headers.Authorization === `Bearer ${state.accessToken}`)
        state.expireSession();
      throw error;
    }
    config.authRetried = true;
    const version = state.authVersion;
    try {
      // 늦게 도착한 이전 토큰의 401은 이미 갱신된 토큰으로 바로 재시도한다.
      if (config.headers.Authorization === `Bearer ${state.accessToken}`) {
        await refreshSession();
      }
    } catch (refreshError) {
      if (useAuthStore.getState().authVersion === version)
        state.expireSession();
      throw refreshError;
    }
    if (
      !useAuthStore.getState().accessToken ||
      useAuthStore.getState().sessionVersion !== config.sessionVersion
    )
      throw error;
    return axiosInstance(config);
  },
);

// Orval이 API를 호출할 때 사용할 커스텀 함수 추가
export const customInstance = <T>(
  config: AxiosRequestConfig,
  options?: AxiosRequestConfig,
): Promise<T> => {
  return axiosInstance({
    ...config,
    ...options,
  }).then((response) => response.data);
  // response.data만 반환하도록 처리
};

export default axiosInstance;
export { axiosInstance as apiClient };
