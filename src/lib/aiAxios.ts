import axios, { type AxiosRequestConfig } from 'axios';

const aiAxiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_AI_API_BASE_URL ?? 'https://folioo-ai-dev.onrender.com',
  headers: {
    'Content-Type': 'application/json',
  },
});

/** Orval mutator for the AI service. Ticket-authenticated calls pass their ticket in request headers. */
export const aiCustomInstance = <T>(
  config: AxiosRequestConfig,
  options?: AxiosRequestConfig,
): Promise<T> =>
  aiAxiosInstance({
    ...config,
    ...options,
  }).then((response) => response.data);

export default aiAxiosInstance;
