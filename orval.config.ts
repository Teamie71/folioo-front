import { defineConfig } from 'orval';

export default defineConfig({
  foliooApi: {
    input: {
      target: 'https://dev-api.folioo.ai.kr/api-json', // API 문서 URL
    },
    output: {
      mode: 'tags-split',
      target: 'src/api/endpoints',
      schemas: 'src/api/models',
      client: 'react-query',
      httpClient: 'axios', // fetch 대신 axios + customInstance 사용 (baseURL, 토큰, credentials)
      mock: false,
      override: {
        mutator: {
          path: 'src/lib/axios.ts',
          name: 'customInstance',
        },
      },
    },
  },
  foliooAiApi: {
    input: {
      target: 'https://folioo-ai-dev.onrender.com/openapi.json',
    },
    output: {
      mode: 'tags-split',
      target: 'src/api/ai/endpoints',
      schemas: 'src/api/ai/models',
      client: 'react-query',
      httpClient: 'axios',
      mock: false,
      override: {
        mutator: {
          path: 'src/lib/aiAxios.ts',
          name: 'aiCustomInstance',
        },
      },
    },
  },
});
