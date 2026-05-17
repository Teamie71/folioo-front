'use client';

import { useRef } from 'react';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import ReactMarkdown from 'react-markdown';
import { DropdownButton } from '@/components/DropdownButton';
import { ExportIcon } from '@/components/icons/ExportIcon';

const A4_WIDTH_MM = 210;

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

export function ExperienceExportDropdown({
  title,
  data,
  className,
}: ExperienceExportProps) {
  const hiddenContentRef = useRef<HTMLDivElement>(null);

  const handleExportPdf = async () => {
    const element = hiddenContentRef.current;
    if (!element) return;

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
      <DropdownButton
        items={[{ id: 'pdf', label: 'PDF로 내보내기' }]}
        onChange={(id) => {
          if (id === 'pdf') {
            handleExportPdf();
          }
        }}
        className={className}
        menuClassName='w-max whitespace-nowrap border-none [&_.group:hover]:bg-sub1 [&_.group:hover_span]:text-main [&_.group:hover_span]:font-semibold'
      >
        <div className='flex cursor-pointer items-center gap-[0.5rem]'>
          <ExportIcon />
          <span className='text-[1rem] text-[#1A1A1A]'>내보내기</span>
        </div>
      </DropdownButton>

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
    </>
  );
}
