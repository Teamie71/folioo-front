'use client';

import { useState } from 'react';
import { OBTFeedbackModal } from '@/components/OBT/OBTFeedbackModal';
import { openFeedbackForm } from '@/constants/feedback';

export const FeedbackFloatingButton = () => {
  const [modalOpen, setModalOpen] = useState(false);
  // TODO: API로 첫 피드백 여부 조회 후 연동
  const isFirstFeedback = true;

  const handleFeedbackClick = () => {
    setModalOpen(false);
    openFeedbackForm();
  };

  return (
    <>
      <button
        type='button'
        className='group fixed right-[3.75rem] bottom-[5rem] z-50 flex h-[3.75rem] w-[3.75rem] cursor-pointer flex-row-reverse items-center overflow-hidden rounded-full bg-gradient-to-b from-[#93B3F4] to-[#5060C5] transition-all duration-300 ease-in-out hover:w-[12.125rem]'
        aria-label='피드백 남기기'
        onClick={() => setModalOpen(true)}
      >
        <svg
          xmlns='http://www.w3.org/2000/svg'
          width='34'
          height='34'
          viewBox='0 0 34 34'
          fill='none'
          className='mr-[0.625rem] shrink-0 translate-y-[0.125rem]'
        >
          <path
            d='M22.3993 12.1042C22.3993 13.0781 21.6083 13.875 20.6414 13.875H2.82039C1.85355 13.875 1.0625 13.0781 1.0625 12.1042C1.0625 11.1302 1.85355 10.3333 2.82039 10.3333H20.6414C21.6083 10.3333 22.3993 11.1302 22.3993 12.1042ZM1.0625 5.02083C1.0625 5.99479 1.85355 6.79167 2.82039 6.79167H20.6414C21.6083 6.79167 22.3993 5.99479 22.3993 5.02083C22.3993 4.04688 21.6083 3.25 20.6414 3.25H2.82039C1.85355 3.25 1.0625 4.04688 1.0625 5.02083ZM15.3678 19.1875C15.3678 18.2135 14.5767 17.4167 13.6099 17.4167H2.82039C1.85355 17.4167 1.0625 18.2135 1.0625 19.1875C1.0625 20.1615 1.85355 20.9583 2.82039 20.9583H13.6099C14.5767 20.9583 15.3678 20.1615 15.3678 19.1875ZM27.4485 15.4156L28.6966 14.1583C28.8592 13.9942 29.0524 13.8639 29.265 13.7751C29.4777 13.6862 29.7057 13.6405 29.9359 13.6405C30.1661 13.6405 30.3941 13.6862 30.6068 13.7751C30.8194 13.8639 31.0126 13.9942 31.1752 14.1583L32.4233 15.4156C33.1089 16.1062 33.1089 17.2219 32.4233 17.9125L31.1752 19.1698L27.4485 15.4156ZM26.2004 16.6729L17.1296 25.8104C16.9714 25.9698 16.8835 26.1823 16.8835 26.4302V28.9271C16.8835 29.4229 17.2703 29.8125 17.7625 29.8125H20.2411C20.4696 29.8125 20.6982 29.724 20.8564 29.5469L29.9271 20.4094L26.2004 16.6729Z'
            fill='white'
          />
        </svg>
        <span className='mr-[1.5rem] text-[1.125rem] font-semibold whitespace-nowrap text-white opacity-0 transition-opacity duration-300 group-hover:opacity-100'>
          피드백 남기기
        </span>
      </button>

      <OBTFeedbackModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        isFirstFeedback={isFirstFeedback}
        onFeedbackClick={handleFeedbackClick}
      />
    </>
  );
};
