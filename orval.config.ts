import { defineConfig, defineTransformer } from 'orval';
import { loadEnvConfig } from '@next/env';

loadEnvConfig(process.cwd());

const swaggerUsername = process.env.FOLIOO_API_DOCS_USERNAME;
const swaggerPassword = process.env.FOLIOO_API_DOCS_PASSWORD;
const swaggerAuthorization =
  swaggerUsername && swaggerPassword
    ? `Basic ${Buffer.from(`${swaggerUsername}:${swaggerPassword}`).toString('base64')}`
    : undefined;

const normalizeAiFileArrays = defineTransformer((spec) => {
  for (const name of [
    'Body_chat_api_v1_interview_sessions__session_id__chat_post',
    'Body_chat_stream_api_v1_interview_sessions__session_id__chat_stream_post',
  ]) {
    const schema = spec.components?.schemas?.[name];
    if (!schema || !('properties' in schema)) continue;
    const files = schema.properties?.files;
    if (!files || !('anyOf' in files) || !Array.isArray(files.anyOf)) continue;
    const array = files.anyOf.find(
      (option: unknown) =>
        typeof option === 'object' &&
        option !== null &&
        'type' in option &&
        option.type === 'array',
    );
    if (!array || !('items' in array)) continue;
    schema.properties.files = {
      type: 'array',
      items: array.items,
      nullable: true,
      title: 'Files',
    };
  }
  return spec;
});

export default defineConfig({
  foliooApi: {
    input: {
      target: 'https://dev-api.folioo.ai.kr/docs-json',
      ...(swaggerAuthorization && {
        parserOptions: {
          headers: [
            {
              domains: ['dev-api.folioo.ai.kr'],
              headers: { Authorization: swaggerAuthorization },
            },
          ],
        },
      }),
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
      override: { transformer: normalizeAiFileArrays },
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
