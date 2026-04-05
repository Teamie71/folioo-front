import type { ComponentType } from 'react';

const TEMPLATE_ROW_FIX_CSS = `
.sb-log-template-fix div[class*="justify-between"] {
  flex-direction: row !important;
  align-items: flex-start !important;
  justify-content: flex-start !important;
  gap: 0.75rem !important;
}
.sb-log-template-fix div[class*="justify-between"] > span:first-child {
  box-sizing: border-box;
  flex: 0 0 9.5rem;
  width: 9.5rem;
  max-width: 9.5rem;
  white-space: nowrap;
  padding-top: 0.375rem;
  text-align: left;
}
.sb-log-template-fix div[class*="justify-between"] > div:last-child {
  flex: 1 1 0% !important;
  min-width: 0 !important;
  width: auto !important;
  max-width: none !important;
}
.sb-log-template-fix textarea::placeholder {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
`;

export function templateFormStoryDecorator(Story: ComponentType) {
  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: TEMPLATE_ROW_FIX_CSS }} />
      <div className='sb-log-template-fix mx-auto min-w-[52rem] max-w-[56rem] px-6 pb-10 pt-10'>
        <Story />
      </div>
    </>
  );
}
