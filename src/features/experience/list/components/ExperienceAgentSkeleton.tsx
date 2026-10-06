import styles from '@/styles/experience-agent.module.css';
import skeletonStyles from '@/styles/experience-skeleton.module.css';

export function ExperienceAgentSkeleton({
  mobile = false,
}: {
  mobile?: boolean;
}) {
  return (
    <div
      className={`${styles.mainScroll} min-h-0 flex-1 overflow-y-auto ${mobile ? 'px-[16px]' : 'px-[20px]'}`}
      role='status'
      aria-busy='true'
      aria-label='대화 내역 불러오는 중'
    >
      <div
        className='flex flex-col gap-[34px] pt-[32px] pb-[32px]'
        aria-hidden='true'
      >
        <div className='flex justify-end'>
          <div
            className={`bg-gray3 h-[42px] w-[270px] max-w-[80%] rounded-[10px] ${skeletonStyles.shimmer}`}
          />
        </div>
        <div className='flex flex-col gap-[4px]'>
          <div
            className={`bg-gray3 h-[20px] w-[252px] max-w-[75%] rounded-[4px] ${skeletonStyles.shimmer}`}
          />
          <div
            className={`bg-gray3 h-[20px] w-[232px] max-w-[70%] rounded-[4px] ${skeletonStyles.shimmer}`}
          />
          <div
            className={`bg-gray3 h-[20px] w-[240px] max-w-[72%] rounded-[4px] ${skeletonStyles.shimmer}`}
          />
        </div>
        <div className='flex flex-col items-end gap-[8px]'>
          <div
            className={`bg-gray3 h-[52px] w-[220px] max-w-[70%] rounded-[10px] ${skeletonStyles.shimmer}`}
          />
          <div
            className={`bg-gray3 h-[46px] w-[270px] max-w-[80%] rounded-[10px] ${skeletonStyles.shimmer}`}
          />
        </div>
        <div className='flex flex-col gap-[4px]'>
          <div
            className={`bg-gray3 h-[20px] w-[205px] max-w-[65%] rounded-[4px] ${skeletonStyles.shimmer}`}
          />
          <div
            className={`bg-gray3 h-[20px] w-[255px] max-w-[76%] rounded-[4px] ${skeletonStyles.shimmer}`}
          />
          <div
            className={`bg-gray3 mt-[4px] h-[34px] w-[100px] rounded-full ${skeletonStyles.shimmer}`}
          />
        </div>
      </div>
    </div>
  );
}
