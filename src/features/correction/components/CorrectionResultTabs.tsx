'use client';

export interface CorrectionResultTabsProps {
  tabs: string[];
  resultTab: string;
  onResultTabChange: (tab: string) => void;
}

export function CorrectionResultTabs({
  tabs,
  resultTab,
  onResultTabChange,
}: CorrectionResultTabsProps) {
  return (
    <div className='flex'>
      {tabs.map((tab) => (
        <button
          key={tab}
          onClick={() => onResultTabChange(tab)}
          className={`cursor-pointer rounded-t-[0.5rem] border-none px-[2.5rem] py-[0.875rem] text-[1rem] font-bold transition-all ${
            resultTab === tab
              ? 'relative z-10 bg-[#FFFFFF] text-[#5060C5]'
              : 'bg-[#F6F8FA] text-[#9EA4A9]'
          }`}
          style={
            resultTab === tab
              ? { boxShadow: '0 -0.15rem 0.5rem 0 rgba(0,0,0,0.2)' }
              : undefined
          }
        >
          {tab}
        </button>
      ))}
    </div>
  );
}
