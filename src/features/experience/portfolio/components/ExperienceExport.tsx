'use client';

import { useState, useRef } from 'react';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import ReactMarkdown from 'react-markdown';
import { CommonModal } from '@/components/CommonModal';

const A4_WIDTH_MM = 210; // 표준 A4 너비

export interface ExperienceExportProps {
  title: string;
  data: {
    description: string;
    responsibilities: string;
    problemSolving: string;
    learnings: string;
  };
  className?: string;
}

export function ExperienceExport({
  title,
  data,
  className,
}: ExperienceExportProps) {
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const hiddenContentRef = useRef<HTMLDivElement>(null);

  const handleConfirmExport = async () => {
    const element = hiddenContentRef.current;
    if (!element) return;

    setIsExportModalOpen(false);

    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      logging: false,
      backgroundColor: '#ffffff',
    });

    const imgData = canvas.toDataURL('image/png');
    const imgWidth = A4_WIDTH_MM;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
    });

    doc.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);

    const safeTitle =
      title.replace(/[/\\?%*:|"<>]/g, '_').slice(0, 50) || 'portfolio';
    doc.save(`${safeTitle}.pdf`);
  };

  return (
    <>
      <button
        type='button'
        onClick={() => setIsExportModalOpen(true)}
        className={
          className ??
          'flex cursor-pointer items-center gap-[0.5rem] border-none bg-transparent'
        }
        aria-label='내보내기'
      >
        <svg
          xmlns='http://www.w3.org/2000/svg'
          width='24'
          height='24'
          viewBox='0 0 24 24'
          fill='none'
        >
          <path
            d='M8.71 7.71002L11 5.41002V15C11 15.2652 11.1054 15.5196 11.2929 15.7071C11.4804 15.8947 11.7348 16 12 16C12.2652 16 12.5196 15.8947 12.7071 15.7071C12.8946 15.5196 13 15.2652 13 15V5.41002L15.29 7.71002C15.383 7.80375 15.4936 7.87814 15.6154 7.92891C15.7373 7.97968 15.868 8.00582 16 8.00582C16.132 8.00582 16.2627 7.97968 16.3846 7.92891C16.5064 7.87814 16.617 7.80375 16.71 7.71002C16.8037 7.61706 16.8781 7.50645 16.9289 7.3846C16.9797 7.26274 17.0058 7.13203 17.0058 7.00002C17.0058 6.86801 16.9797 6.7373 16.9289 6.61544C16.8781 6.49358 16.8037 6.38298 16.71 6.29002L12.71 2.29002C12.6149 2.19898 12.5028 2.12761 12.38 2.08002C12.1365 1.98 11.8635 1.98 11.62 2.08002C11.4972 2.12761 11.3851 2.19898 11.29 2.29002L7.29 6.29002C7.19676 6.38326 7.1228 6.49395 7.07234 6.61577C7.02188 6.73759 6.99591 6.86816 6.99591 7.00002C6.99591 7.13188 7.02188 7.26245 7.07234 7.38427C7.1228 7.50609 7.19676 7.61678 7.29 7.71002C7.38324 7.80326 7.49393 7.87722 7.61575 7.92768C7.73757 7.97814 7.86814 8.00411 8 8.00411C8.13186 8.00411 8.26243 7.97814 8.38425 7.92768C8.50607 7.87722 8.61676 7.80326 8.71 7.71002ZM21 14C20.7348 14 20.4804 14.1054 20.2929 14.2929C20.1054 14.4804 20 14.7348 20 15V19C20 19.2652 19.8946 19.5196 19.7071 19.7071C19.5196 19.8947 19.2652 20 19 20H5C4.73478 20 4.48043 19.8947 4.29289 19.7071C4.10536 19.5196 4 19.2652 4 19V15C4 14.7348 3.89464 14.4804 3.70711 14.2929C3.51957 14.1054 3.26522 14 3 14C2.73478 14 2.48043 14.1054 2.29289 14.2929C2.10536 14.4804 2 14.7348 2 15V19C2 19.7957 2.31607 20.5587 2.87868 21.1213C3.44129 21.6839 4.20435 22 5 22H19C19.7956 22 20.5587 21.6839 21.1213 21.1213C21.6839 20.5587 22 19.7957 22 19V15C22 14.7348 21.8946 14.4804 21.7071 14.2929C21.5196 14.1054 21.2652 14 21 14Z'
            fill='#74777D'
          />
        </svg>
        <span className='text-[1rem] text-[#1A1A1A]'>내보내기</span>
      </button>

      {/* PDF 생성을 위한 숨겨진 템플릿 (화면 밖 렌더링) */}
      <div style={{ position: 'absolute', left: '-9999px', top: '0' }}>
        <div
          ref={hiddenContentRef}
          style={{
            width: '210mm',
            padding: '20mm',
            backgroundColor: '#ffffff',
            color: '#1A1A1A',
            fontFamily: 'Pretendard, sans-serif',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          {/* 제목: 글꼴 크기 11, Bold */}
          <h1
            style={{
              fontSize: '11pt',
              fontWeight: 'bold',
              margin: '0 0 24pt 0',
            }}
          >
            {title}
          </h1>

          {/* 상세정보 섹션 */}
          <div style={{ marginBottom: '24pt' }}>
            <h2
              style={{
                fontSize: '11pt',
                fontWeight: 'normal',
                margin: '0 0 8pt 0',
              }}
            >
              상세정보
            </h2>
            <div style={{ fontSize: '10pt', lineHeight: '1.8' }}>
              <ReactMarkdown>{data.description}</ReactMarkdown>
            </div>
          </div>

          {/* 담당업무 섹션 */}
          <div style={{ marginBottom: '24pt' }}>
            <h2
              style={{
                fontSize: '11pt',
                fontWeight: 'normal',
                margin: '0 0 8pt 0',
              }}
            >
              담당업무
            </h2>
            <div style={{ fontSize: '10pt', lineHeight: '1.8' }}>
              <ReactMarkdown>{data.responsibilities}</ReactMarkdown>
            </div>
          </div>

          {/* 문제해결 섹션 */}
          <div style={{ marginBottom: '24pt' }}>
            <h2
              style={{
                fontSize: '11pt',
                fontWeight: 'normal',
                margin: '0 0 8pt 0',
              }}
            >
              문제해결
            </h2>
            <div style={{ fontSize: '10pt', lineHeight: '1.8' }}>
              <ReactMarkdown>{data.problemSolving}</ReactMarkdown>
            </div>
          </div>

          {/* 배운 점 섹션 */}
          <div style={{ marginBottom: '24pt' }}>
            <h2
              style={{
                fontSize: '11pt',
                fontWeight: 'normal',
                margin: '0 0 8pt 0',
              }}
            >
              배운 점
            </h2>
            <div style={{ fontSize: '10pt', lineHeight: '1.8' }}>
              <ReactMarkdown>{data.learnings}</ReactMarkdown>
            </div>
          </div>
        </div>
      </div>

      <CommonModal
        open={isExportModalOpen}
        onOpenChange={setIsExportModalOpen}
        title='이 포트폴리오를 PDF로 내보내시겠습니까?'
        cancelBtnText='취소'
        secondaryBtnText='내보내기'
        onCancelClick={() => setIsExportModalOpen(false)}
        onSecondaryClick={handleConfirmExport}
      />
    </>
  );
}
