# Folioo Frontend

Folioo는 사용자가 자신의 경험을 기록하고, AI 인터뷰를 통해 포트폴리오를 생성한 뒤, 지원 기업과 직무에 맞게 포트폴리오를 첨삭받을 수 있는 커리어 포트폴리오 서비스입니다.

프론트엔드는 Next.js App Router 기반으로 구현되어 있으며, 긴 사용자 플로우와 AI 비동기 작업을 안정적으로 처리하는 데 초점을 맞췄습니다. 인사이트 기록, AI 채팅, 포트폴리오 생성 대기, PDF 구조화, 첨삭 결과 렌더링처럼 상태가 복잡한 화면을 React Query, Zustand, 상태머신형 UI 분기, polling, SSE 스트리밍으로 관리합니다.

## 핵심 사용자 흐름

```txt
인사이트 기록
  → 경험 정리 시작
  → AI 인터뷰 진행
  → 텍스트 포트폴리오 생성
  → 시각화 포트폴리오 생성 및 내보내기
  → 포트폴리오 첨삭 요청
  → 첨삭 결과 확인
```

## 주요 기능

### 1. 인사이트 로그

사용자가 경험의 재료가 되는 생각, 활동, 회고를 짧게 기록하는 기능입니다. 기록된 인사이트는 단독으로 관리할 수 있고, 이후 경험 정리 AI 채팅에서 `@` 멘션으로 불러와 답변 재료로 사용할 수 있습니다.

주요 구현 내용:

- 인사이트 로그 작성, 조회, 검색, 수정, 삭제
- 카테고리별 입력 템플릿과 글자 수 제한
- 활동 태그 생성 및 조회
- 검색어와 필터 조건 기반 목록 조회
- 비로그인 사용자가 작성 중 로그인해야 할 때 draft를 보존하는 흐름
- 서버 DTO를 카드 UI 모델로 변환하는 mapper 구성

기술 포인트:

- React state로 작성 폼, 수정 모드, 선택 태그, 입력 길이 상태 관리
- React Query로 로그 목록과 태그 목록 조회
- Zustand store와 browser storage로 작성 중 상태 복원
- Zod 기반 입력 검증

### 2. 경험 정리

사용자가 경험명, 희망 직군, 기본 정보를 입력하면 AI가 인터뷰 방식으로 질문을 이어가고, 답변을 바탕으로 포트폴리오를 생성하는 기능입니다.

주요 구현 내용:

- 경험 목록 조회와 검색
- 새 경험 생성 전 이용권 확인
- 경험 설정 폼 검증
- AI 인터뷰 채팅
- 채팅 중 인사이트 로그 멘션
- 파일 첨부
- 새로고침 또는 재진입 시 채팅 내역 복원
- 서버 진행 단계에 따른 화면 복원
- 포트폴리오 생성 요청과 생성 대기 화면

기술 포인트:

- Server-Sent Events 기반 AI 답변 스트리밍
- contentEditable 기반 멘션 입력 처리
- localStorage를 활용한 단계 역행 방지
- sessionStorage 기반 return path 저장
- 비동기 생성 작업을 전역 pending store와 polling으로 추적

### 3. 텍스트 포트폴리오

AI 인터뷰가 완료되면 사용자의 경험을 구조화한 텍스트 포트폴리오를 보여주는 기능입니다. 사용자는 포트폴리오 내용을 확인하고, 기여도를 수정하고, PDF로 내보낼 수 있습니다.

주요 구현 내용:

- 생성된 포트폴리오 상세 조회
- 활동별 상세 정보, 담당 업무, 문제 해결, 배운 점 렌더링
- 기여도 progress bar 드래그 수정
- 기여도 숫자 직접 입력
- 제목 수정과 삭제
- PDF 내보내기

기술 포인트:

- 화면 표시용 DOM과 PDF 출력용 DOM을 분리
- html2canvas와 jsPDF로 브라우저 기반 PDF 생성
- progress bar drag 이벤트를 window mouse event로 추적
- 임시 기여도와 저장 기여도를 분리해 불필요한 API 호출 방지

### 4. 시각화 포트폴리오

텍스트 포트폴리오를 기반으로 발표 자료 형태의 시각화 포트폴리오를 생성하는 기능입니다. 생성된 슬라이드는 미리보기로 확인하고 PDF 또는 PPTX로 내보낼 수 있습니다.

주요 구현 내용:

- 시각화 생성 옵션 선택
- 시각화 생성 job 요청
- 슬라이드 목록 조회
- 슬라이드별 생성 상태 표시
- 생성 실패 슬라이드 재시도
- 완성된 시각화 자료 PDF/PPTX 내보내기
- 키보드 기반 슬라이드 이동

기술 포인트:

- 생성 job과 slide 상태를 분리해 부분 완료/부분 실패 처리
- React Query polling으로 슬라이드 생성 상태 추적
- preview URL 응답 형태를 방어적으로 파싱
- export status polling으로 파일 생성 완료 후 signed URL open

### 5. 포트폴리오 첨삭

사용자가 생성한 텍스트 포트폴리오 또는 직접 업로드한 PDF 포트폴리오를 지원 기업, 직무, Job Description에 맞춰 AI가 첨삭하는 기능입니다.

주요 구현 내용:

- 첨삭 목록 조회와 검색
- 새 첨삭 생성 전 이용권 확인
- 지원 기업명, 직무명, JD 입력
- 내부 텍스트 포트폴리오 선택
- PDF 포트폴리오 업로드
- PDF 텍스트 추출과 AI 구조화 결과 편집
- 기업 분석 정보 생성 및 수정
- AI 첨삭 생성 요청
- 첨삭 생성 중 상태 polling
- 첨삭 실패 시 재시도
- 지원 정보, 총평, 활동별 상세 첨삭 결과 렌더링
- 원문에서 축소/제외 대상과 강조 대상 하이라이트

기술 포인트:

- 서버 status를 UI step/status로 변환하는 상태머신형 화면 제어
- PDF drag and drop overlay
- PDF 구조화 결과를 activity/category/bullet UI state로 변환
- bullet editor에서 Enter, Backspace, ArrowUp, ArrowDown 키보드 편집 지원
- debounce PATCH로 PDF 편집 내용 저장
- Markdown 원문에 부분 하이라이트를 적용한 뒤 React Markdown으로 렌더링

### 6. 계정, 결제, 부가 기능

서비스 사용을 위한 로그인, 이용권, 결제 내역, 피드백, 프로필 관련 화면을 제공합니다.

주요 구현 내용:

- 로그인 페이지와 OAuth callback 처리
- 인증 상태 기반 라우팅
- 이용권 안내 및 충전 화면
- 결제 내역 조회
- 환불 관련 화면
- 피드백 제출
- 프로필 관리
- 회원 탈퇴
- 약관, 개인정보 처리방침, 마케팅 페이지
- 모바일 제한 안내 화면

## 기술 스택

### 언어와 런타임

| 기술                       | 버전   | 사용 목적                                       |
| -------------------------- | ------ | ----------------------------------------------- |
| TypeScript                 | ^5     | 컴포넌트 props, API 모델, 상태 타입 안정성 확보 |
| JavaScript                 | ESNext | React/Next.js 런타임 코드 실행                  |
| React                      | 19.2.0 | UI 컴포넌트 렌더링과 클라이언트 상태 관리       |
| React DOM                  | 19.2.0 | 브라우저 DOM 렌더링                             |
| Node.js type definitions   | ^20    | Next.js 설정과 개발 환경 타입 지원              |
| React type definitions     | ^19    | React 컴포넌트와 hook 타입 지원                 |
| React DOM type definitions | ^19    | React DOM 렌더링 API 타입 지원                  |
| pnpm                       | 9.15.0 | 패키지 매니저                                   |

### 프레임워크와 라우팅

| 기술                | 버전         | 사용 목적                                           |
| ------------------- | ------------ | --------------------------------------------------- |
| Next.js             | ^16.1.3      | App Router 기반 페이지, layout, routing, build 구성 |
| Next.js App Router  | Next.js 내장 | route group, dynamic route, nested layout 구성      |
| @next/third-parties | ^16.1.6      | Next.js 환경에서 외부 third-party script 연동       |

### 스타일링과 디자인 시스템

| 기술                    | 버전          | 사용 목적                                                 |
| ----------------------- | ------------- | --------------------------------------------------------- |
| Tailwind CSS            | ^4.1.17       | utility-first 스타일링                                    |
| @tailwindcss/postcss    | ^4            | Tailwind CSS v4 PostCSS 연동                              |
| @tailwindcss/typography | ^0.5.19       | Markdown/prose 콘텐츠 스타일링                            |
| tailwindcss-animate     | ^1.0.7        | accordion 등 Tailwind animation utility                   |
| tw-animate-css          | ^1.4.0        | CSS animation utility                                     |
| PostCSS                 | ^8.5.6        | CSS transform pipeline                                    |
| Autoprefixer            | ^10.4.22      | 브라우저 prefix 자동 처리                                 |
| Design tokens JSON      | project local | 색상, 폰트, shadow, line-height, letter-spacing 토큰 관리 |
| Pretendard font stack   | project local | 한국어 UI에 적합한 기본 서체 구성                         |

Tailwind 설정은 `src/styles/tokens.json`의 디자인 토큰을 읽어 색상, 폰트, 폰트 크기, line-height, shadow를 theme으로 확장합니다. 디자인 값이 코드에 흩어지지 않도록 토큰 기반 스타일 구조를 사용했습니다.

### 서버 상태와 API 통신

| 기술                 | 버전          | 사용 목적                                        |
| -------------------- | ------------- | ------------------------------------------------ |
| TanStack React Query | ^5.90.21      | API 조회, cache, mutation, polling, invalidation |
| Axios                | ^1.7.9        | HTTP client                                      |
| Orval                | ^8.4.2        | OpenAPI schema 기반 API hook/model 자동 생성     |
| Custom Axios mutator | project local | baseURL, token, credentials 등 공통 요청 설정    |

API는 OpenAPI 문서를 Orval로 생성하고, React Query client 방식으로 사용합니다. 생성된 endpoint hook과 model을 기반으로 서버 DTO 타입을 유지하고, 화면 요구사항이 다른 경우 service/mapper 계층에서 UI 모델로 변환합니다.

### 클라이언트 상태, 폼, 검증

| 기술                | 버전    | 사용 목적                                                  |
| ------------------- | ------- | ---------------------------------------------------------- |
| Zustand             | ^5.0.10 | 인증 상태, 경험 생성 상태, 로그 폼 등 전역 클라이언트 상태 |
| React Hook Form     | ^7.71.1 | 폼 입력 상태 관리                                          |
| @hookform/resolvers | ^5.2.2  | React Hook Form과 Zod resolver 연결                        |
| Zod                 | ^4.3.6  | 입력값 schema 검증                                         |

서버에서 가져오는 데이터는 React Query에 두고, 브라우저에서만 필요한 UI 상태는 React state 또는 Zustand로 분리했습니다. 작성 중인 입력값, pending 생성 상태, 인증 복원 상태처럼 route 간 유지가 필요한 값은 store와 browser storage를 함께 사용합니다.

### UI 컴포넌트와 인터랙션

| 기술                     | 버전     | 사용 목적                         |
| ------------------------ | -------- | --------------------------------- |
| Radix Accordion          | ^1.2.12  | 접근성 기반 accordion UI          |
| Radix Checkbox           | ^1.3.3   | 접근성 기반 checkbox UI           |
| Radix Dialog             | ^1.1.15  | modal/dialog UI                   |
| Radix Progress           | ^1.1.8   | progress indicator                |
| Radix Slot               | ^1.2.4   | 합성 가능한 컴포넌트 API          |
| Radix Tabs               | ^1.1.13  | tab UI                            |
| Radix Toggle             | ^1.1.10  | toggle button UI                  |
| Radix Toggle Group       | ^1.1.11  | segmented control UI              |
| lucide-react             | ^0.554.0 | 아이콘                            |
| class-variance-authority | ^0.7.1   | variant 기반 컴포넌트 class 구성  |
| clsx                     | ^2.1.1   | 조건부 className 조합             |
| tailwind-merge           | ^3.4.0   | Tailwind class conflict 병합      |
| Framer Motion            | ^12.27.5 | 채팅, 로딩, 패널, 전환 애니메이션 |
| TanStack React Table     | ^8.21.3  | 테이블형 데이터 UI 구성 기반      |

공통 버튼, 입력, 모달, 탭, 카드 컴포넌트는 Radix primitive와 Tailwind utility를 조합해 구현했습니다. variant가 필요한 컴포넌트는 CVA, clsx, tailwind-merge를 사용해 className 충돌과 중복을 줄였습니다.

### Markdown, Editor, 콘텐츠 렌더링

| 기술                     | 버전    | 사용 목적                                  |
| ------------------------ | ------- | ------------------------------------------ |
| Tiptap React             | ^3.20.1 | 기업 분석 정보 Markdown editor             |
| Tiptap Starter Kit       | ^3.20.1 | editor 기본 node/mark 구성                 |
| Tiptap Placeholder       | ^3.20.1 | editor placeholder                         |
| @tiptap/pm               | ^3.20.1 | ProseMirror 기반 editor runtime            |
| tiptap-markdown          | ^0.9.0  | editor content와 Markdown 문자열 변환      |
| React Markdown           | ^10.1.0 | AI 생성 텍스트와 첨삭 결과 Markdown 렌더링 |
| remark-gfm               | ^4.0.1  | GitHub Flavored Markdown 지원              |
| remark-breaks            | ^4.0.0  | 줄바꿈 유지                                |
| rehype-raw               | ^7.0.0  | Markdown 내부 HTML span 렌더링             |
| react-syntax-highlighter | ^16.1.1 | 코드 블록 syntax highlight 기반            |

AI가 생성한 기업 분석, 포트폴리오 본문, 첨삭 결과는 Markdown 형태로 다뤘습니다. 편집이 필요한 기업 분석에는 Tiptap editor를 사용하고, 결과 렌더링에는 React Markdown과 remark/rehype 플러그인을 조합했습니다.

### PDF와 파일 처리

| 기술              | 버전    | 사용 목적                       |
| ----------------- | ------- | ------------------------------- |
| html2canvas       | ^1.4.1  | 포트폴리오 DOM을 canvas로 변환  |
| jsPDF             | ^4.0.0  | 브라우저에서 PDF 파일 생성      |
| Browser File API  | Web API | PDF 업로드, 파일 크기/타입 검증 |
| Drag and Drop API | Web API | PDF drag overlay와 drop 처리    |

텍스트 포트폴리오 PDF 내보내기는 화면 DOM과 출력 DOM을 분리한 뒤 html2canvas로 이미지화하고 jsPDF로 저장합니다. 첨삭용 PDF 업로드는 파일 타입, 용량, 개수 제한을 프론트에서 먼저 검사하고, 서버의 구조화 결과를 편집 가능한 bullet UI로 변환합니다.

### 개발, 테스트, 문서화 도구

| 기술                        | 버전     | 사용 목적                              |
| --------------------------- | -------- | -------------------------------------- |
| ESLint                      | ^9       | 정적 분석                              |
| eslint-config-next          | 16.0.3   | Next.js 권장 lint 설정                 |
| eslint-plugin-storybook     | ^10.2.19 | Storybook 관련 lint 규칙               |
| Prettier                    | ^3.6.2   | 코드 포맷팅                            |
| prettier-plugin-tailwindcss | ^0.7.1   | Tailwind class 정렬                    |
| Storybook                   | ^10.2.19 | UI 컴포넌트 문서화와 독립 실행         |
| @storybook/nextjs-vite      | ^10.2.19 | Next.js + Vite 기반 Storybook 실행     |
| @storybook/addon-a11y       | ^10.2.19 | 접근성 점검                            |
| @storybook/addon-docs       | ^10.2.19 | 컴포넌트 문서 생성                     |
| @storybook/addon-onboarding | ^10.2.19 | Storybook 온보딩                       |
| @storybook/addon-vitest     | ^10.2.19 | Storybook과 Vitest 연동                |
| Chromatic                   | ^16.0.0  | Storybook 기반 시각 회귀 테스트와 배포 |
| @chromatic-com/storybook    | ^5.0.1   | Chromatic Storybook 연동               |
| Vitest                      | ^4.1.0   | 테스트 러너                            |
| @vitest/browser-playwright  | ^4.1.0   | 브라우저 환경 테스트                   |
| @vitest/coverage-v8         | ^4.1.0   | 테스트 커버리지                        |
| Playwright                  | ^1.58.2  | 브라우저 자동화 기반 테스트            |
| Vite                        | ^8.0.0   | Storybook/Vitest 개발 도구 기반        |

### 주요 npm scripts

| script                 | 설명                           |
| ---------------------- | ------------------------------ |
| `pnpm dev`             | Next.js 개발 서버 실행         |
| `pnpm build`           | Next.js production build       |
| `pnpm start`           | production server 실행         |
| `pnpm lint`            | ESLint 실행                    |
| `pnpm api:generate`    | Orval 기반 API 코드 생성       |
| `pnpm api:gen`         | Orval 기반 API 코드 생성 alias |
| `pnpm storybook`       | Storybook 개발 서버 실행       |
| `pnpm build-storybook` | Storybook 정적 빌드            |
| `pnpm chromatic`       | Chromatic 업로드               |

## 프론트엔드 구조

```txt
src
  app          Next.js App Router 페이지와 layout
  api          Orval이 생성한 endpoint hook과 model
  components   공통 UI 컴포넌트
  constants    공통 상수
  contexts     layout 또는 route 간 공유 context
  features     도메인별 기능 구현
  lib          axios, query client, SSE stream 등 기반 코드
  services     API DTO와 UI 모델 사이의 mapper/service
  store        Zustand 전역 store
  styles       global CSS와 design tokens
  utils        device, 날짜, 문자열 등 유틸 함수
```

도메인 기능은 `features` 아래에 인사이트 로그, 경험 정리, 포트폴리오 첨삭, 피드백, 결제 내역, 로그인 등으로 분리했습니다. 라우트 파일은 `app`에 두고, 실제 화면 상태와 비즈니스 로직은 feature hook/component로 분리해 페이지 컴포넌트가 과도하게 커지지 않도록 구성했습니다.

## 구현 방식의 핵심

### 1. API DTO와 UI 모델 분리

서버 응답을 화면에서 그대로 사용하지 않고, 화면에 맞는 모델로 변환했습니다.

예시:

- 인사이트 로그 DTO를 카드 UI 데이터로 변환
- PDF 구조화 결과를 activity/category/bullet 편집 모델로 변환
- 직군 enum을 사용자에게 보이는 한국어 label로 변환
- 외부 PDF 포트폴리오 DTO를 내부 포트폴리오 결과 UI와 호환되는 형태로 보정

이 방식으로 서버 API 구조가 화면 구조와 달라도 컴포넌트 복잡도를 낮췄습니다.

### 2. AI 비동기 작업 처리

AI 기반 기능은 즉시 결과가 나오지 않기 때문에 작업 상태를 계속 추적해야 합니다.

적용한 방식:

- AI 채팅 답변은 SSE 스트리밍으로 수신
- 포트폴리오 생성, 시각화 생성, PDF 추출, 기업 분석, 첨삭 생성은 polling으로 상태 추적
- 생성 중 페이지를 이탈해도 재진입 시 서버 status를 조회해 화면 복원
- 실패 상태에서는 재시도 버튼과 fallback UI 제공

### 3. 상태머신형 화면 전환

경험 정리와 포트폴리오 첨삭은 URL만으로 화면을 결정하지 않습니다. 서버 status를 조회한 뒤 프론트에서 사용하는 step/status로 변환해 현재 보여줄 화면을 결정합니다.

예시:

```txt
NOT_STARTED      → 포트폴리오 선택
COMPANY_INSIGHT  → 기업 분석 입력
DOING_RAG        → 첨삭 생성 중
GENERATING       → 첨삭 생성 중
DONE             → 첨삭 결과
FAILED           → 실패/재시도
```

이 구조 덕분에 새로고침, 뒤로가기, 직접 URL 접근, 생성 중 이탈 후 재진입 상황에서도 현재 작업 상태에 맞는 화면을 복원할 수 있습니다.

### 4. 사용자 입력 안정성

긴 플로우에서 사용자가 입력한 값이 유실되지 않도록 여러 방어 로직을 적용했습니다.

- 비로그인 작성 중 로그인 전환 시 draft 보존
- AI 채팅 단계 localStorage 저장으로 단계 역행 방지
- 검색어 debounce로 과도한 API 호출 방지
- PDF bullet 입력 debounce PATCH로 서버 저장 요청 최적화
- Tiptap editor 외부 value 동기화 시 현재 markdown과 비교 후 필요한 경우에만 setContent

### 5. Markdown과 하이라이트 렌더링

AI 생성 결과는 Markdown 기반으로 렌더링합니다. 첨삭 결과에서는 원문 일부에 하이라이트를 적용해야 하므로, line item의 `originalText`를 찾아 span으로 감싸고 React Markdown에서 렌더링합니다.

처리 방식:

```txt
원문 Markdown
  → 첨삭 line item을 originalText 길이 내림차순 정렬
  → originalText 정규식 escape
  → reduce/emphasize 타입에 따라 span class 적용
  → React Markdown + remark/rehype plugin으로 렌더링
```

긴 문장부터 치환해 짧은 문장이 긴 문장의 일부를 먼저 변경하는 문제를 줄였습니다.
