import axios, { AxiosRequestConfig } from 'axios';

const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

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
