import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import SpanArea from '@/components/SpanArea';
import { TermsAccordion } from '@/components/TermsAccordion';

const meta = {
  title: 'Components/Misc/Overview',
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: `
# Miscellaneous Components Overview

다양한 용도로 사용되는 유틸리티 컴포넌트들의 컬렉션입니다.

## 컴포넌트

### 텍스트 영역
- **SpanArea**: 텍스트나 콘텐츠를 표시하는 인라인 영역 컴포넌트

### 아코디언
- **TermsAccordion**: 약관이나 긴 내용을 접었다 펼칠 수 있는 아코디언 컴포넌트
        `,
      },
    },
  },
  tags: ['autodocs'],
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const AllComponents: Story = {
  render: () => (
    <div className='min-h-screen bg-gray-50 p-8'>
      <div className='mx-auto max-w-7xl'>
        <h1 className='mb-8 text-4xl font-bold text-gray-900'>
          Miscellaneous Components Collection
        </h1>

        {/* SpanArea */}
        <section className='mb-12'>
          <div className='mb-4 border-b border-gray-200 pb-2'>
            <h2 className='text-2xl font-bold text-gray-800'>SpanArea</h2>
            <p className='text-sm text-gray-600'>
              텍스트나 콘텐츠를 표시하는 인라인 영역 컴포넌트
            </p>
          </div>
          <div className='space-y-6 rounded-lg bg-white p-6 shadow'>
            <div>
              <h3 className='mb-2 text-sm font-semibold text-gray-700'>
                기본 사용
              </h3>
              <SpanArea>기본 텍스트 영역입니다.</SpanArea>
            </div>
            <div>
              <h3 className='mb-2 text-sm font-semibold text-gray-700'>
                커스텀 너비
              </h3>
              <div className='space-y-2'>
                <SpanArea width='300px'>너비: 300px</SpanArea>
                <SpanArea width='500px'>너비: 500px</SpanArea>
                <SpanArea width='50%'>너비: 50%</SpanArea>
              </div>
            </div>
            <div>
              <h3 className='mb-2 text-sm font-semibold text-gray-700'>
                커스텀 높이
              </h3>
              <SpanArea height='100px'>
                높이: 100px
                <br />
                여러 줄의 텍스트를 포함할 수 있습니다.
              </SpanArea>
            </div>
            <div>
              <h3 className='mb-2 text-sm font-semibold text-gray-700'>
                긴 콘텐츠
              </h3>
              <SpanArea>
                이것은 긴 텍스트 내용의 예시입니다. SpanArea 컴포넌트는 텍스트나
                다른 콘텐츠를 담을 수 있는 영역을 제공합니다. 기본적으로 border,
                padding, rounded corners를 가지고 있어 시각적으로 구분되는
                영역을 만들 수 있습니다.
              </SpanArea>
            </div>
            <div>
              <h3 className='mb-2 text-sm font-semibold text-gray-700'>
                커스텀 클래스와 너비/높이
              </h3>
              <SpanArea
                width={400}
                height={80}
                className='bg-blue-50 text-blue-900'
              >
                커스텀 스타일이 적용된 SpanArea
              </SpanArea>
            </div>
          </div>
        </section>

        {/* TermsAccordion */}
        <section className='mb-12'>
          <div className='mb-4 border-b border-gray-200 pb-2'>
            <h2 className='text-2xl font-bold text-gray-800'>TermsAccordion</h2>
            <p className='text-sm text-gray-600'>
              약관이나 긴 내용을 접었다 펼칠 수 있는 아코디언 컴포넌트
            </p>
          </div>
          <div className='rounded-lg bg-white p-6 shadow'>
            <h3 className='mb-4 text-sm font-semibold text-gray-700'>
              서비스 약관 예시
            </h3>
            <TermsAccordion
              items={[
                {
                  value: 'item-1',
                  title: '제1조 (목적)',
                  content: (
                    <div className='text-gray-700'>
                      이 약관은 회사가 제공하는 서비스의 이용과 관련하여 회사와
                      회원 간의 권리, 의무 및 책임사항, 기타 필요한 사항을
                      규정함을 목적으로 합니다.
                    </div>
                  ),
                },
                {
                  value: 'item-2',
                  title: '제2조 (정의)',
                  content: (
                    <div className='space-y-2 text-gray-700'>
                      <p>
                        1. "서비스"란 구현되는 단말기(PC, TV, 휴대형단말기 등의
                        각종 유무선 장치를 포함)와 상관없이 "회원"이 이용할 수
                        있는 회사가 제공하는 제반 서비스를 의미합니다.
                      </p>
                      <p>
                        2. "회원"이란 회사의 "서비스"에 접속하여 이 약관에 따라
                        "회사"와 이용계약을 체결하고 "회사"가 제공하는
                        "서비스"를 이용하는 고객을 말합니다.
                      </p>
                    </div>
                  ),
                },
                {
                  value: 'item-3',
                  title: '제3조 (약관의 게시와 개정)',
                  content: (
                    <div className='space-y-2 text-gray-700'>
                      <p>
                        회사는 이 약관의 내용을 회원이 쉽게 알 수 있도록 서비스
                        초기 화면에 게시합니다.
                      </p>
                      <p>
                        회사는 필요한 경우 관련 법령을 위배하지 않는 범위에서 이
                        약관을 개정할 수 있습니다.
                      </p>
                    </div>
                  ),
                },
                {
                  value: 'item-4',
                  title: '제4조 (이용계약의 성립)',
                  content: (
                    <div className='text-gray-700'>
                      이용계약은 회원이 되고자 하는 자(이하 "가입신청자")가
                      약관의 내용에 대하여 동의를 한 다음 회원가입신청을 하고
                      회사가 이러한 신청에 대하여 승낙함으로써 체결됩니다.
                    </div>
                  ),
                },
              ]}
            />
          </div>
        </section>

        {/* TermsAccordion - Simple Example */}
        <section className='mb-12'>
          <div className='mb-4 border-b border-gray-200 pb-2'>
            <h2 className='text-2xl font-bold text-gray-800'>
              TermsAccordion - FAQ 예시
            </h2>
            <p className='text-sm text-gray-600'>간단한 FAQ 형태의 사용 예시</p>
          </div>
          <div className='rounded-lg bg-white p-6 shadow'>
            <TermsAccordion
              items={[
                {
                  value: 'faq-1',
                  title: '서비스 이용 방법은 어떻게 되나요?',
                  content: (
                    <div className='text-gray-700'>
                      회원가입 후 로그인하시면 모든 서비스를 이용하실 수
                      있습니다.
                    </div>
                  ),
                },
                {
                  value: 'faq-2',
                  title: '비밀번호를 잊어버렸어요.',
                  content: (
                    <div className='text-gray-700'>
                      로그인 페이지에서 "비밀번호 찾기"를 클릭하시고 등록된
                      이메일로 인증을 진행하시면 새로운 비밀번호를 설정하실 수
                      있습니다.
                    </div>
                  ),
                },
                {
                  value: 'faq-3',
                  title: '회원 탈퇴는 어떻게 하나요?',
                  content: (
                    <div className='text-gray-700'>
                      마이페이지 &gt; 설정 &gt; 회원탈퇴 메뉴에서 탈퇴하실 수
                      있습니다. 탈퇴 시 모든 데이터가 삭제되며 복구할 수
                      없습니다.
                    </div>
                  ),
                },
              ]}
            />
          </div>
        </section>
      </div>
    </div>
  ),
};

export const ByCategory: Story = {
  render: () => (
    <div className='min-h-screen bg-gray-50 p-8'>
      <div className='mx-auto max-w-7xl'>
        <h1 className='mb-8 text-4xl font-bold text-gray-900'>
          Miscellaneous Components by Category
        </h1>

        {/* 텍스트 영역 */}
        <section className='mb-12'>
          <div className='mb-6 rounded-lg bg-blue-50 p-4'>
            <h2 className='text-2xl font-bold text-blue-900'>텍스트 영역</h2>
            <p className='text-sm text-blue-700'>
              콘텐츠를 표시하는 영역 컴포넌트
            </p>
          </div>
          <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
            <div className='rounded-lg bg-white p-6 shadow'>
              <h3 className='mb-4 font-semibold text-gray-800'>
                SpanArea - 기본
              </h3>
              <SpanArea>기본 스타일의 SpanArea입니다.</SpanArea>
            </div>
            <div className='rounded-lg bg-white p-6 shadow'>
              <h3 className='mb-4 font-semibold text-gray-800'>
                SpanArea - 커스텀 크기
              </h3>
              <SpanArea width='100%' height='80px'>
                높이가 80px인 SpanArea입니다.
              </SpanArea>
            </div>
            <div className='rounded-lg bg-white p-6 shadow'>
              <h3 className='mb-4 font-semibold text-gray-800'>
                SpanArea - 긴 텍스트
              </h3>
              <SpanArea>
                이것은 긴 텍스트의 예시입니다. SpanArea는 다양한 길이의 텍스트를
                담을 수 있으며, 자동으로 줄바꿈이 됩니다. 기본적으로 테두리와
                패딩이 적용되어 있어 내용을 시각적으로 구분할 수 있습니다.
              </SpanArea>
            </div>
            <div className='rounded-lg bg-white p-6 shadow'>
              <h3 className='mb-4 font-semibold text-gray-800'>
                SpanArea - 커스텀 스타일
              </h3>
              <SpanArea className='border-2 border-blue-500 bg-blue-50 text-blue-900'>
                커스텀 스타일이 적용된 SpanArea
              </SpanArea>
            </div>
          </div>
        </section>

        {/* 아코디언 */}
        <section className='mb-12'>
          <div className='mb-6 rounded-lg bg-purple-50 p-4'>
            <h2 className='text-2xl font-bold text-purple-900'>아코디언</h2>
            <p className='text-sm text-purple-700'>
              접었다 펼칠 수 있는 콘텐츠 컴포넌트
            </p>
          </div>
          <div className='grid grid-cols-1 gap-6'>
            <div className='rounded-lg bg-white p-6 shadow'>
              <h3 className='mb-4 font-semibold text-gray-800'>
                TermsAccordion - 약관 예시
              </h3>
              <TermsAccordion
                items={[
                  {
                    value: 'privacy-1',
                    title: '개인정보 수집 및 이용 동의',
                    content: (
                      <div className='text-gray-700'>
                        회사는 다음과 같이 개인정보를 수집 및 이용합니다.
                        수집하는 개인정보 항목: 이름, 이메일, 연락처 등
                      </div>
                    ),
                  },
                  {
                    value: 'privacy-2',
                    title: '개인정보 보유 및 이용기간',
                    content: (
                      <div className='text-gray-700'>
                        회원 탈퇴 시까지 보유하며, 관련 법령에 따라 일정 기간
                        보관할 수 있습니다.
                      </div>
                    ),
                  },
                ]}
              />
            </div>
            <div className='rounded-lg bg-white p-6 shadow'>
              <h3 className='mb-4 font-semibold text-gray-800'>
                TermsAccordion - 상세 내용
              </h3>
              <TermsAccordion
                items={[
                  {
                    value: 'detail-1',
                    title: '서비스 소개',
                    content: (
                      <div className='space-y-2 text-gray-700'>
                        <p>
                          우리 서비스는 사용자들에게 최고의 경험을 제공하기 위해
                          만들어졌습니다.
                        </p>
                        <p>
                          다양한 기능과 편리한 인터페이스로 누구나 쉽게 이용할
                          수 있습니다.
                        </p>
                      </div>
                    ),
                  },
                  {
                    value: 'detail-2',
                    title: '주요 기능',
                    content: (
                      <ul className='list-disc space-y-1 pl-5 text-gray-700'>
                        <li>직관적인 사용자 인터페이스</li>
                        <li>빠른 응답 속도</li>
                        <li>안전한 데이터 보호</li>
                        <li>다양한 커스터마이징 옵션</li>
                      </ul>
                    ),
                  },
                  {
                    value: 'detail-3',
                    title: '지원 및 문의',
                    content: (
                      <div className='text-gray-700'>
                        문의사항이 있으시면 고객센터로 연락주시기 바랍니다.
                        이메일: support@example.com
                      </div>
                    ),
                  },
                ]}
              />
            </div>
          </div>
        </section>
      </div>
    </div>
  ),
};

export const UseCases: Story = {
  render: () => (
    <div className='min-h-screen bg-gray-50 p-8'>
      <div className='mx-auto max-w-7xl'>
        <h1 className='mb-8 text-4xl font-bold text-gray-900'>
          Use Cases & Examples
        </h1>

        {/* Use Case 1: 사용자 정보 표시 */}
        <section className='mb-12'>
          <div className='mb-6 rounded-lg bg-gradient-to-r from-blue-50 to-purple-50 p-4'>
            <h2 className='text-2xl font-bold text-gray-900'>
              사용자 정보 표시
            </h2>
            <p className='text-sm text-gray-700'>
              SpanArea를 사용한 정보 표시 예시
            </p>
          </div>
          <div className='rounded-lg bg-white p-6 shadow'>
            <div className='space-y-4'>
              <div>
                <label className='mb-1 block text-sm font-medium text-gray-700'>
                  이름
                </label>
                <SpanArea>홍길동</SpanArea>
              </div>
              <div>
                <label className='mb-1 block text-sm font-medium text-gray-700'>
                  이메일
                </label>
                <SpanArea>hong@example.com</SpanArea>
              </div>
              <div>
                <label className='mb-1 block text-sm font-medium text-gray-700'>
                  자기소개
                </label>
                <SpanArea height='100px'>
                  안녕하세요. 저는 프론트엔드 개발자입니다.
                  <br />
                  React와 TypeScript를 주로 사용합니다.
                </SpanArea>
              </div>
            </div>
          </div>
        </section>

        {/* Use Case 2: FAQ 섹션 */}
        <section className='mb-12'>
          <div className='mb-6 rounded-lg bg-gradient-to-r from-green-50 to-teal-50 p-4'>
            <h2 className='text-2xl font-bold text-gray-900'>
              자주 묻는 질문 (FAQ)
            </h2>
            <p className='text-sm text-gray-700'>
              TermsAccordion을 사용한 FAQ 섹션
            </p>
          </div>
          <div className='rounded-lg bg-white p-6 shadow'>
            <TermsAccordion
              items={[
                {
                  value: 'use-faq-1',
                  title: '❓ 무료 체험이 가능한가요?',
                  content: (
                    <div className='text-gray-700'>
                      네, 모든 신규 사용자에게 14일 무료 체험 기간이 제공됩니다.
                      체험 기간 동안 모든 프리미엄 기능을 사용하실 수 있습니다.
                    </div>
                  ),
                },
                {
                  value: 'use-faq-2',
                  title: '❓ 결제 방법은 무엇이 있나요?',
                  content: (
                    <div className='text-gray-700'>
                      신용카드, 체크카드, 계좌이체를 지원합니다. 해외 결제도
                      가능하며, PayPal도 사용하실 수 있습니다.
                    </div>
                  ),
                },
                {
                  value: 'use-faq-3',
                  title: '❓ 환불 정책은 어떻게 되나요?',
                  content: (
                    <div className='text-gray-700'>
                      구매 후 7일 이내에는 100% 환불이 가능합니다. 단, 서비스를
                      이용하지 않은 경우에 한합니다.
                    </div>
                  ),
                },
                {
                  value: 'use-faq-4',
                  title: '❓ 모바일 앱이 있나요?',
                  content: (
                    <div className='text-gray-700'>
                      현재 iOS와 Android 모바일 앱을 모두 제공하고 있습니다. App
                      Store와 Google Play에서 다운로드 받으실 수 있습니다.
                    </div>
                  ),
                },
              ]}
            />
          </div>
        </section>

        {/* Use Case 3: 안내 메시지 */}
        <section className='mb-12'>
          <div className='mb-6 rounded-lg bg-gradient-to-r from-yellow-50 to-orange-50 p-4'>
            <h2 className='text-2xl font-bold text-gray-900'>안내 메시지</h2>
            <p className='text-sm text-gray-700'>
              SpanArea를 사용한 다양한 안내 메시지
            </p>
          </div>
          <div className='space-y-4'>
            <div className='rounded-lg bg-white p-6 shadow'>
              <h3 className='mb-3 font-semibold text-gray-800'>정보 메시지</h3>
              <SpanArea className='border-blue-400 bg-blue-50 text-blue-900'>
                ℹ️ 시스템 점검이 진행 중입니다. 2024년 1월 15일 02:00 ~ 04:00
              </SpanArea>
            </div>
            <div className='rounded-lg bg-white p-6 shadow'>
              <h3 className='mb-3 font-semibold text-gray-800'>경고 메시지</h3>
              <SpanArea className='border-yellow-400 bg-yellow-50 text-yellow-900'>
                ⚠️ 비밀번호를 6개월 동안 변경하지 않았습니다. 보안을 위해
                비밀번호를 변경해주세요.
              </SpanArea>
            </div>
            <div className='rounded-lg bg-white p-6 shadow'>
              <h3 className='mb-3 font-semibold text-gray-800'>성공 메시지</h3>
              <SpanArea className='border-green-400 bg-green-50 text-green-900'>
                ✅ 프로필이 성공적으로 업데이트되었습니다.
              </SpanArea>
            </div>
            <div className='rounded-lg bg-white p-6 shadow'>
              <h3 className='mb-3 font-semibold text-gray-800'>오류 메시지</h3>
              <SpanArea className='border-red-400 bg-red-50 text-red-900'>
                ❌ 파일 업로드에 실패했습니다. 파일 크기는 10MB를 초과할 수
                없습니다.
              </SpanArea>
            </div>
          </div>
        </section>
      </div>
    </div>
  ),
};
