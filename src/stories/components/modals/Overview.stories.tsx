import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { useState } from 'react';
import { ChallengeModal } from '@/components/ChallengeModal';
import { CommonModal } from '@/components/CommonModal';
import { CorrectionLimitModal } from '@/components/CorrectionLimitModal';
import { EventModal } from '@/components/EventModal';
import { FeedbackModal } from '@/components/FeedbackModal';
import { LoginRequiredModal } from '@/components/LoginRequiredModal';
import { LogoutModal } from '@/components/LogoutModal';
import { OutOfTicketModal } from '@/components/OutOfTicketModal';
import { PaymentModal } from '@/components/PaymentModal';
import { ProfileModal } from '@/components/ProfileModal';
import { CommonButton } from '@/components/CommonButton';
import type { TicketGrantNoticeResDTO } from '@/api/models';

const meta = {
  title: 'Components/Modals/Overview',
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: `
# Modals Overview

모달 컴포넌트들의 전체 컬렉션입니다.
다양한 용도와 스타일의 모달들을 한눈에 확인할 수 있습니다.

## 카테고리

### 기본 모달
- **CommonModal**: 가장 기본적인 모달 컴포넌트로 다양한 옵션 지원
- **CorrectionLimitModal**: 첨삭 개수 제한 안내 모달

### 인증 관련
- **LoginRequiredModal**: 로그인이 필요할 때 표시되는 모달
- **LogoutModal**: 로그아웃 확인 모달

### 챌린지 & 이벤트
- **ChallengeModal**: 챌린지 참여 안내 모달
- **EventModal**: 이벤트 안내 모달

### 결제 & 이용권
- **OutOfTicketModal**: 이용권 소진 안내 모달
- **PaymentModal**: 결제 확인 모달

### 기타
- **FeedbackModal**: 피드백 작성 안내 모달
- **ProfileModal**: 프로필 정보 모달
        `,
      },
    },
  },
  tags: ['autodocs'],
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const AllModals: Story = {
  render: () => {
    const [commonModalOpen, setCommonModalOpen] = useState(false);
    const [challengeModalOpen, setChallengeModalOpen] = useState(false);
    const [correctionLimitModalOpen, setCorrectionLimitModalOpen] =
      useState(false);
    const [eventModalOpen, setEventModalOpen] = useState(false);
    const [feedbackModalOpen, setFeedbackModalOpen] = useState(false);
    const [loginRequiredModalOpen, setLoginRequiredModalOpen] = useState(false);
    const [logoutModalOpen, setLogoutModalOpen] = useState(false);
    const [outOfTicketModalOpen, setOutOfTicketModalOpen] = useState(false);
    const [paymentModalOpen, setPaymentModalOpen] = useState(false);
    const [profileModalOpen, setProfileModalOpen] = useState(false);

    // Mock data for EventModal (TicketGrantNoticeResDTO)
    const mockEventNotice: TicketGrantNoticeResDTO = {
      id: 1,
      ticketGrantId: 1,
      status: 'SHOWN',
      title: '🎉 이벤트 공지',
      body: '새로운 이벤트가 시작되었습니다!\n지금 바로 참여하세요.',
      ctaText: '확인' as unknown as TicketGrantNoticeResDTO['ctaText'],
      ctaLink: null,
      createdAt: new Date().toISOString(),
    };

    return (
      <div className='min-h-screen bg-gray-50 p-8'>
        <div className='mx-auto max-w-7xl'>
          <h1 className='mb-8 text-4xl font-bold text-gray-900'>
            Modals Collection
          </h1>

          {/* CommonModal */}
          <section className='mb-12'>
            <div className='mb-4 border-b border-gray-200 pb-2'>
              <h2 className='text-2xl font-bold text-gray-800'>CommonModal</h2>
              <p className='text-sm text-gray-600'>
                기본 모달 컴포넌트 - 다양한 버튼 옵션과 커스텀 콘텐츠 지원
              </p>
            </div>
            <div className='rounded-lg bg-white p-6 shadow'>
              <CommonButton
                variantType='Primary'
                px='2rem'
                py='0.75rem'
                onClick={() => setCommonModalOpen(true)}
              >
                CommonModal 열기
              </CommonButton>
              <CommonModal
                open={commonModalOpen}
                onOpenChange={setCommonModalOpen}
                title='기본 모달입니다'
                description='이것은 CommonModal의 예시입니다. 다양한 옵션을 지원합니다.'
                primaryBtnText='확인'
                cancelBtnText='취소'
                onPrimaryClick={() => {
                  alert('확인 클릭!');
                  setCommonModalOpen(false);
                }}
                onCancelClick={() => setCommonModalOpen(false)}
              />
            </div>
          </section>

          {/* ChallengeModal */}
          <section className='mb-12'>
            <div className='mb-4 border-b border-gray-200 pb-2'>
              <h2 className='text-2xl font-bold text-gray-800'>
                ChallengeModal
              </h2>
              <p className='text-sm text-gray-600'>
                챌린지 참여 안내 모달 - 도전 과제와 현재 진행 상황 표시
              </p>
            </div>
            <div className='rounded-lg bg-white p-6 shadow'>
              <CommonButton
                variantType='Primary'
                px='2rem'
                py='0.75rem'
                onClick={() => setChallengeModalOpen(true)}
              >
                ChallengeModal 열기
              </CommonButton>
              <ChallengeModal
                open={challengeModalOpen}
                onOpenChange={setChallengeModalOpen}
                currentCount={3}
                hasWrittenToday={false}
                onLogClick={() => alert('인사이트 로그 작성!')}
              />
            </div>
          </section>

          {/* CorrectionLimitModal */}
          <section className='mb-12'>
            <div className='mb-4 border-b border-gray-200 pb-2'>
              <h2 className='text-2xl font-bold text-gray-800'>
                CorrectionLimitModal
              </h2>
              <p className='text-sm text-gray-600'>
                첨삭 개수 제한 안내 모달 - 최대 15개까지 저장 가능 안내
              </p>
            </div>
            <div className='rounded-lg bg-white p-6 shadow'>
              <CommonButton
                variantType='Primary'
                px='2rem'
                py='0.75rem'
                onClick={() => setCorrectionLimitModalOpen(true)}
              >
                CorrectionLimitModal 열기
              </CommonButton>
              <CorrectionLimitModal
                open={correctionLimitModalOpen}
                onOpenChange={setCorrectionLimitModalOpen}
              />
            </div>
          </section>

          {/* EventModal */}
          <section className='mb-12'>
            <div className='mb-4 border-b border-gray-200 pb-2'>
              <h2 className='text-2xl font-bold text-gray-800'>EventModal</h2>
              <p className='text-sm text-gray-600'>
                이벤트 안내 모달 - 이벤트 공지사항 및 안내 표시
              </p>
            </div>
            <div className='rounded-lg bg-white p-6 shadow'>
              <CommonButton
                variantType='Primary'
                px='2rem'
                py='0.75rem'
                onClick={() => setEventModalOpen(true)}
              >
                EventModal 열기
              </CommonButton>
              <EventModal
                open={eventModalOpen}
                onOpenChange={setEventModalOpen}
                notice={mockEventNotice}
              />
            </div>
          </section>

          {/* FeedbackModal */}
          <section className='mb-12'>
            <div className='mb-4 border-b border-gray-200 pb-2'>
              <h2 className='text-2xl font-bold text-gray-800'>
                FeedbackModal
              </h2>
              <p className='text-sm text-gray-600'>
                피드백 작성 안내 모달 - 사용자 피드백 수집을 위한 모달
              </p>
            </div>
            <div className='rounded-lg bg-white p-6 shadow'>
              <CommonButton
                variantType='Primary'
                px='2rem'
                py='0.75rem'
                onClick={() => setFeedbackModalOpen(true)}
              >
                FeedbackModal 열기
              </CommonButton>
              <FeedbackModal
                open={feedbackModalOpen}
                onOpenChange={setFeedbackModalOpen}
                isFirstFeedback={true}
                onFeedbackClick={() => {}}
              />
            </div>
          </section>

          {/* LoginRequiredModal */}
          <section className='mb-12'>
            <div className='mb-4 border-b border-gray-200 pb-2'>
              <h2 className='text-2xl font-bold text-gray-800'>
                LoginRequiredModal
              </h2>
              <p className='text-sm text-gray-600'>
                로그인 필요 모달 - 로그인이 필요한 기능 접근 시 표시
              </p>
            </div>
            <div className='rounded-lg bg-white p-6 shadow'>
              <CommonButton
                variantType='Primary'
                px='2rem'
                py='0.75rem'
                onClick={() => setLoginRequiredModalOpen(true)}
              >
                LoginRequiredModal 열기
              </CommonButton>
              <LoginRequiredModal
                open={loginRequiredModalOpen}
                onOpenChange={setLoginRequiredModalOpen}
              />
            </div>
          </section>

          {/* LogoutModal */}
          <section className='mb-12'>
            <div className='mb-4 border-b border-gray-200 pb-2'>
              <h2 className='text-2xl font-bold text-gray-800'>LogoutModal</h2>
              <p className='text-sm text-gray-600'>
                로그아웃 확인 모달 - 로그아웃 진행 전 사용자 확인
              </p>
            </div>
            <div className='rounded-lg bg-white p-6 shadow'>
              <CommonButton
                variantType='Primary'
                px='2rem'
                py='0.75rem'
                onClick={() => setLogoutModalOpen(true)}
              >
                LogoutModal 열기
              </CommonButton>
              <LogoutModal
                open={logoutModalOpen}
                onOpenChange={setLogoutModalOpen}
                onConfirm={() => {
                  alert('로그아웃 되었습니다!');
                  setLogoutModalOpen(false);
                }}
              />
            </div>
          </section>

          {/* OutOfTicketModal */}
          <section className='mb-12'>
            <div className='mb-4 border-b border-gray-200 pb-2'>
              <h2 className='text-2xl font-bold text-gray-800'>
                OutOfTicketModal
              </h2>
              <p className='text-sm text-gray-600'>
                이용권 소진 안내 모달 - 이용권이 부족할 때 결제 유도
              </p>
            </div>
            <div className='rounded-lg bg-white p-6 shadow'>
              <CommonButton
                variantType='Primary'
                px='2rem'
                py='0.75rem'
                onClick={() => setOutOfTicketModalOpen(true)}
              >
                OutOfTicketModal 열기
              </CommonButton>
              <OutOfTicketModal
                open={outOfTicketModalOpen}
                onOpenChange={setOutOfTicketModalOpen}
                ticketTypes={['experience', 'correction']}
                onPurchase={(type) => alert(`${type} 이용권 구매!`)}
                onViewPackages={() => alert('패키지 보기!')}
              />
            </div>
          </section>

          {/* PaymentModal */}
          <section className='mb-12'>
            <div className='mb-4 border-b border-gray-200 pb-2'>
              <h2 className='text-2xl font-bold text-gray-800'>PaymentModal</h2>
              <p className='text-sm text-gray-600'>
                결제 확인 모달 - 결제 진행 전 최종 확인 및 약관 동의
              </p>
            </div>
            <div className='rounded-lg bg-white p-6 shadow'>
              <CommonButton
                variantType='Primary'
                px='2rem'
                py='0.75rem'
                onClick={() => setPaymentModalOpen(true)}
              >
                PaymentModal 열기
              </CommonButton>
              <PaymentModal
                open={paymentModalOpen}
                onOpenChange={setPaymentModalOpen}
                productName='경험 정리 이용권 10개'
                onConfirm={() => alert('결제 완료!')}
              />
            </div>
          </section>

          {/* ProfileModal */}
          <section className='mb-12'>
            <div className='mb-4 border-b border-gray-200 pb-2'>
              <h2 className='text-2xl font-bold text-gray-800'>ProfileModal</h2>
              <p className='text-sm text-gray-600'>
                프로필 정보 모달 - 사용자 프로필 및 설정 관리
              </p>
            </div>
            <div className='rounded-lg bg-white p-6 shadow'>
              <CommonButton
                variantType='Primary'
                px='2rem'
                py='0.75rem'
                onClick={() => setProfileModalOpen(true)}
              >
                ProfileModal 열기
              </CommonButton>
              <ProfileModal
                open={profileModalOpen}
                onOpenChange={setProfileModalOpen}
              />
            </div>
          </section>
        </div>
      </div>
    );
  },
};

export const ByCategory: Story = {
  render: () => {
    const [commonModalOpen, setCommonModalOpen] = useState(false);
    const [correctionLimitModalOpen, setCorrectionLimitModalOpen] =
      useState(false);
    const [loginRequiredModalOpen, setLoginRequiredModalOpen] = useState(false);
    const [logoutModalOpen, setLogoutModalOpen] = useState(false);
    const [challengeModalOpen, setChallengeModalOpen] = useState(false);
    const [eventModalOpen, setEventModalOpen] = useState(false);
    const [outOfTicketModalOpen, setOutOfTicketModalOpen] = useState(false);
    const [paymentModalOpen, setPaymentModalOpen] = useState(false);
    const [feedbackModalOpen, setFeedbackModalOpen] = useState(false);
    const [profileModalOpen, setProfileModalOpen] = useState(false);

    const mockEventNotice: TicketGrantNoticeResDTO = {
      id: 1,
      ticketGrantId: 1,
      status: 'SHOWN',
      title: '🎉 이벤트 공지',
      body: '새로운 이벤트가 시작되었습니다!',
      ctaText: '확인' as unknown as TicketGrantNoticeResDTO['ctaText'],
      ctaLink: null,
      createdAt: new Date().toISOString(),
    };

    return (
      <div className='min-h-screen bg-gray-50 p-8'>
        <div className='mx-auto max-w-7xl'>
          <h1 className='mb-8 text-4xl font-bold text-gray-900'>
            Modals by Category
          </h1>

          {/* 기본 모달 */}
          <section className='mb-12'>
            <div className='mb-6 rounded-lg bg-blue-50 p-4'>
              <h2 className='text-2xl font-bold text-blue-900'>기본 모달</h2>
              <p className='text-sm text-blue-700'>
                일반적인 용도로 사용되는 모달들
              </p>
            </div>
            <div className='grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3'>
              <div className='rounded-lg bg-white p-6 shadow'>
                <h3 className='mb-4 font-semibold text-gray-800'>
                  CommonModal
                </h3>
                <p className='mb-4 text-sm text-gray-600'>
                  기본 모달 컴포넌트로 다양한 옵션 지원
                </p>
                <CommonButton
                  variantType='Outline'
                  px='1.5rem'
                  py='0.5rem'
                  onClick={() => setCommonModalOpen(true)}
                >
                  열기
                </CommonButton>
                <CommonModal
                  open={commonModalOpen}
                  onOpenChange={setCommonModalOpen}
                  title='기본 모달입니다'
                  description='다양한 옵션을 지원합니다.'
                  primaryBtnText='확인'
                  onPrimaryClick={() => setCommonModalOpen(false)}
                />
              </div>

              <div className='rounded-lg bg-white p-6 shadow'>
                <h3 className='mb-4 font-semibold text-gray-800'>
                  CorrectionLimitModal
                </h3>
                <p className='mb-4 text-sm text-gray-600'>
                  첨삭 개수 제한 안내
                </p>
                <CommonButton
                  variantType='Outline'
                  px='1.5rem'
                  py='0.5rem'
                  onClick={() => setCorrectionLimitModalOpen(true)}
                >
                  열기
                </CommonButton>
                <CorrectionLimitModal
                  open={correctionLimitModalOpen}
                  onOpenChange={setCorrectionLimitModalOpen}
                />
              </div>
            </div>
          </section>

          {/* 인증 관련 */}
          <section className='mb-12'>
            <div className='mb-6 rounded-lg bg-purple-50 p-4'>
              <h2 className='text-2xl font-bold text-purple-900'>인증 관련</h2>
              <p className='text-sm text-purple-700'>
                로그인/로그아웃 관련 모달들
              </p>
            </div>
            <div className='grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3'>
              <div className='rounded-lg bg-white p-6 shadow'>
                <h3 className='mb-4 font-semibold text-gray-800'>
                  LoginRequiredModal
                </h3>
                <p className='mb-4 text-sm text-gray-600'>
                  로그인이 필요할 때 표시
                </p>
                <CommonButton
                  variantType='Outline'
                  px='1.5rem'
                  py='0.5rem'
                  onClick={() => setLoginRequiredModalOpen(true)}
                >
                  열기
                </CommonButton>
                <LoginRequiredModal
                  open={loginRequiredModalOpen}
                  onOpenChange={setLoginRequiredModalOpen}
                />
              </div>

              <div className='rounded-lg bg-white p-6 shadow'>
                <h3 className='mb-4 font-semibold text-gray-800'>
                  LogoutModal
                </h3>
                <p className='mb-4 text-sm text-gray-600'>로그아웃 확인 모달</p>
                <CommonButton
                  variantType='Outline'
                  px='1.5rem'
                  py='0.5rem'
                  onClick={() => setLogoutModalOpen(true)}
                >
                  열기
                </CommonButton>
                <LogoutModal
                  open={logoutModalOpen}
                  onOpenChange={setLogoutModalOpen}
                  onConfirm={() => {
                    alert('로그아웃!');
                    setLogoutModalOpen(false);
                  }}
                />
              </div>
            </div>
          </section>

          {/* 챌린지 & 이벤트 */}
          <section className='mb-12'>
            <div className='mb-6 rounded-lg bg-green-50 p-4'>
              <h2 className='text-2xl font-bold text-green-900'>
                챌린지 & 이벤트
              </h2>
              <p className='text-sm text-green-700'>
                챌린지 및 이벤트 관련 모달들
              </p>
            </div>
            <div className='grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3'>
              <div className='rounded-lg bg-white p-6 shadow'>
                <h3 className='mb-4 font-semibold text-gray-800'>
                  ChallengeModal
                </h3>
                <p className='mb-4 text-sm text-gray-600'>챌린지 참여 안내</p>
                <CommonButton
                  variantType='Outline'
                  px='1.5rem'
                  py='0.5rem'
                  onClick={() => setChallengeModalOpen(true)}
                >
                  열기
                </CommonButton>
                <ChallengeModal
                  open={challengeModalOpen}
                  onOpenChange={setChallengeModalOpen}
                  currentCount={3}
                  hasWrittenToday={false}
                  onLogClick={() => alert('인사이트 로그 작성!')}
                />
              </div>

              <div className='rounded-lg bg-white p-6 shadow'>
                <h3 className='mb-4 font-semibold text-gray-800'>EventModal</h3>
                <p className='mb-4 text-sm text-gray-600'>이벤트 공지 안내</p>
                <CommonButton
                  variantType='Outline'
                  px='1.5rem'
                  py='0.5rem'
                  onClick={() => setEventModalOpen(true)}
                >
                  열기
                </CommonButton>
                <EventModal
                  open={eventModalOpen}
                  onOpenChange={setEventModalOpen}
                  notice={mockEventNotice}
                />
              </div>
            </div>
          </section>

          {/* 결제 & 이용권 */}
          <section className='mb-12'>
            <div className='mb-6 rounded-lg bg-yellow-50 p-4'>
              <h2 className='text-2xl font-bold text-yellow-900'>
                결제 & 이용권
              </h2>
              <p className='text-sm text-yellow-700'>
                결제 및 이용권 관련 모달들
              </p>
            </div>
            <div className='grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3'>
              <div className='rounded-lg bg-white p-6 shadow'>
                <h3 className='mb-4 font-semibold text-gray-800'>
                  OutOfTicketModal
                </h3>
                <p className='mb-4 text-sm text-gray-600'>이용권 소진 안내</p>
                <CommonButton
                  variantType='Outline'
                  px='1.5rem'
                  py='0.5rem'
                  onClick={() => setOutOfTicketModalOpen(true)}
                >
                  열기
                </CommonButton>
                <OutOfTicketModal
                  open={outOfTicketModalOpen}
                  onOpenChange={setOutOfTicketModalOpen}
                  ticketTypes={['experience', 'correction']}
                  onPurchase={(type) => alert(`${type} 구매!`)}
                />
              </div>

              <div className='rounded-lg bg-white p-6 shadow'>
                <h3 className='mb-4 font-semibold text-gray-800'>
                  PaymentModal
                </h3>
                <p className='mb-4 text-sm text-gray-600'>
                  결제 확인 및 약관 동의
                </p>
                <CommonButton
                  variantType='Outline'
                  px='1.5rem'
                  py='0.5rem'
                  onClick={() => setPaymentModalOpen(true)}
                >
                  열기
                </CommonButton>
                <PaymentModal
                  open={paymentModalOpen}
                  onOpenChange={setPaymentModalOpen}
                  productName='경험 정리 이용권 10개'
                  onConfirm={() => alert('결제 완료!')}
                />
              </div>
            </div>
          </section>

          {/* 기타 */}
          <section className='mb-12'>
            <div className='mb-6 rounded-lg bg-red-50 p-4'>
              <h2 className='text-2xl font-bold text-red-900'>기타</h2>
              <p className='text-sm text-red-700'>기타 특수 목적 모달들</p>
            </div>
            <div className='grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3'>
              <div className='rounded-lg bg-white p-6 shadow'>
                <h3 className='mb-4 font-semibold text-gray-800'>
                  FeedbackModal
                </h3>
                <p className='mb-4 text-sm text-gray-600'>피드백 작성 안내</p>
                <CommonButton
                  variantType='Outline'
                  px='1.5rem'
                  py='0.5rem'
                  onClick={() => setFeedbackModalOpen(true)}
                >
                  열기
                </CommonButton>
                <FeedbackModal
                  open={feedbackModalOpen}
                  onOpenChange={setFeedbackModalOpen}
                  isFirstFeedback={true}
                  onFeedbackClick={() => {}}
                />
              </div>

              <div className='rounded-lg bg-white p-6 shadow'>
                <h3 className='mb-4 font-semibold text-gray-800'>
                  ProfileModal
                </h3>
                <p className='mb-4 text-sm text-gray-600'>
                  프로필 정보 및 설정
                </p>
                <CommonButton
                  variantType='Outline'
                  px='1.5rem'
                  py='0.5rem'
                  onClick={() => setProfileModalOpen(true)}
                >
                  열기
                </CommonButton>
                <ProfileModal
                  open={profileModalOpen}
                  onOpenChange={setProfileModalOpen}
                />
              </div>
            </div>
          </section>
        </div>
      </div>
    );
  },
};
