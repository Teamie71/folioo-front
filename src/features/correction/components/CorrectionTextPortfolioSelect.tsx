'use client';

import { PortfolioCard } from '@/components/PortfolioCard';

export interface TextPortfolioItem {
  id: string;
  title: string;
  tag: string;
  date: string;
}

export interface CorrectionTextPortfolioSelectProps {
  showWarning: boolean;
  textPortfolios: TextPortfolioItem[];
  selectedTextPortfolioIds: string[];
  onTextPortfolioToggle: (portfolioId: string) => void;
  isLoading?: boolean;
}

export function CorrectionTextPortfolioSelect({
  showWarning,
  textPortfolios,
  selectedTextPortfolioIds,
  onTextPortfolioToggle,
  isLoading,
}: CorrectionTextPortfolioSelectProps) {
  return (
    <div className='mt-[4.75rem] flex flex-col'>
      <div className='flex items-center text-[1.125rem] font-bold leading-[1.3]'>
        <span>텍스트형 포트폴리오 선택</span>
      </div>
      <span className='pt-[0.25rem] text-[0.875rem] text-[#74777D]'>
        경험 정리를 통해 생성한 포트폴리오 중, 첨삭을 진행할 포트폴리오를
        최대 5개 클릭하여 선택해주세요.
      </span>
      {isLoading ? null : textPortfolios.length === 0 ? (
        <div className='mt-[2.5rem] flex items-center justify-center rounded-[1rem] bg-[#F6F8FA] py-[3rem] text-center'>
          <p className='text-[1.125rem] font-semibold text-[#464B53] leading-[1.3]'>
            아직 생성한 텍스트형 포트폴리오가 없어요.
            <br />
            PDF 포트폴리오 첨삭을 진행하거나, 경험 정리를 먼저 진행해보세요!
          </p>
        </div>
      ) : (
        <>
          {showWarning && (
            <span className='mt-[1.75rem] mb-[0.5rem] text-[0.875rem] text-[#DC0000]'>
              첨삭할 텍스트형 포트폴리오를 선택해주세요
            </span>
          )}
          <div
            className={`grid grid-cols-2 gap-[1.5rem] ${
              showWarning ? 'mt-[0.5rem]' : 'mt-[1.25rem]'
            }`}
          >
            {textPortfolios.map((portfolio) => (
              <PortfolioCard
                key={portfolio.id}
                title={portfolio.title}
                tag={portfolio.tag}
                date={portfolio.date}
                selected={selectedTextPortfolioIds.includes(portfolio.id)}
                onClick={() => onTextPortfolioToggle(portfolio.id)}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
