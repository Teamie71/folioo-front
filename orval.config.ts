import { defineConfig } from 'orval';

export default defineConfig({
  foliooApi: {
    input: {
      target: 'https://folioo-dev-api.log8.kr/api-json', // API 문서 URL
    },
    output: {
      mode: 'tags-split',
      target: 'src/api/endpoints', // API 엔드포인트 생성 위치
      schemas: 'src/api/models', // API 모델 생성 위치
      client: 'react-query',
      mock: false, // 모의 데이터 생성 여부

      // 자동으로 생성된 axios 인스턴스를 덮어씌우기
      override: {
        mutator: {
          path: 'src/lib/axios.ts', // 우리가 새로 만들 커스텀 Axios 파일의 경로
          name: 'customInstance', // 그 파일 안에서 빼내올(export) 함수 이름
        },
      },
    },
  },
});
