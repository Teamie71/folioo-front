'use client';

import { useRouter } from 'next/navigation';
import * as Accordion from '@radix-ui/react-accordion';
import { DropdownIcon } from '@/components/icons/DropdownIcon';
import { RecommendationLightbulbIcon } from '@/components/icons/RecommendationLightbulbIcon';
import type {
  RecommendedCompany,
  RecommendedJob,
} from '@/features/recommendation/types';
import { RECOMMENDATION_WHITE_BUTTON_HOVER } from '@/features/recommendation/constants';
import { cn } from '@/utils/utils';

const CARD_SHADOW = 'shadow-[0px_2px_8px_0px_rgba(0,0,0,0.15)]';
const HEADER_PAD = 'px-[0.75rem] py-[0.75rem]';
const LOCKED_HEADER_BLUR_H = 'h-[4.25rem]';

type ResultCardsVariant = 'web' | 'mobile';

function defaultOpenIds<T extends { id: string }>(
  items: T[],
  openFirst: boolean,
): string[] {
  if (!openFirst || items.length === 0) return [];
  return [items[0].id];
}

function LockedFrost({ variant }: { variant: ResultCardsVariant }) {
  if (variant === 'mobile') {
    return (
      <>
        <div
          aria-hidden
          className={cn(
            'pointer-events-none absolute inset-x-0 top-0 z-[1] rounded-[12px]',
            LOCKED_HEADER_BLUR_H,
            'bg-[rgba(255,255,255,0.02)] backdrop-blur-[5px]',
            'group-data-[state=open]:hidden',
          )}
        />
        <div
          aria-hidden
          className={cn(
            'pointer-events-none absolute inset-0 z-[1] hidden rounded-[12px]',
            'bg-[rgba(255,255,255,0.02)] backdrop-blur-[5px]',
            'group-data-[state=open]:block',
          )}
        />
      </>
    );
  }

  return (
    <div
      aria-hidden
      className='pointer-events-none absolute inset-0 z-[1] rounded-[12px] bg-[rgba(255,255,255,0.02)] backdrop-blur-[5px]'
    />
  );
}

function LoginToViewButton({
  loginHref,
  variant,
}: {
  loginHref: string;
  variant: ResultCardsVariant;
}) {
  const router = useRouter();

  return (
    <div className='pointer-events-none absolute inset-0 z-[2] hidden items-center justify-center group-data-[state=open]:flex'>
      <button
        type='button'
        className={cn(
          'pointer-events-auto cursor-pointer rounded-[12px] border border-gray4 bg-white px-[0.625rem] py-[0.75rem] shadow-[0px_2px_10px_rgba(80,96,197,0.25)]',
          variant === 'web' && RECOMMENDATION_WHITE_BUTTON_HOVER,
        )}
        onClick={() => router.push(loginHref)}
      >
        <span className='typo-b2 text-gray9'>로그인하고 결과 확인하기</span>
      </button>
    </div>
  );
}

function LockedHeaderChrome({
  title,
  fitPercent,
}: {
  title: string;
  fitPercent?: string;
}) {
  return (
    <div
      aria-hidden
      className={cn(
        'pointer-events-none absolute inset-x-0 top-0 z-[2] flex items-center gap-[0.75rem]',
        HEADER_PAD,
      )}
    >
      <span className='size-[2.6875rem] shrink-0' />
      <span className='flex min-w-0 flex-1 flex-col'>
        <span className='typo-b2 invisible'>{title}</span>
        {fitPercent != null && (
          <span className='typo-c2 text-gray9'>적합도 {fitPercent}%</span>
        )}
      </span>
      <DropdownIcon className='size-[24px] shrink-0 transition-transform duration-200 group-data-[state=open]:rotate-180' />
    </div>
  );
}

interface RecommendationJobCardsProps {
  jobs: RecommendedJob[];
  locked?: boolean;
  loginHref?: string;
  variant?: ResultCardsVariant;
  defaultOpenFirst?: boolean;
}

export function RecommendationJobCards({
  jobs,
  locked = false,
  loginHref = '/login?redirect_to=%2Frecommendation%2Fresult',
  variant = 'web',
  defaultOpenFirst = false,
}: RecommendationJobCardsProps) {
  return (
    <Accordion.Root
      type='multiple'
      defaultValue={defaultOpenIds(jobs, defaultOpenFirst)}
      className='flex flex-col gap-[0.75rem]'
    >
      {jobs.map((job) => (
        <Accordion.Item
          key={job.id}
          value={job.id}
          className={cn(
            'group relative rounded-[12px] bg-gray1',
            CARD_SHADOW,
            !locked && 'overflow-hidden',
          )}
        >
          <Accordion.Header>
            <Accordion.Trigger
              className={cn(
                'flex w-full cursor-pointer items-center gap-[0.75rem] text-left',
                HEADER_PAD,
              )}
            >
              <span className='size-[2.6875rem] shrink-0 rounded-[8px] bg-[#d9d9d9]' />
              <span className='flex min-w-0 flex-1 flex-col'>
                <span className='typo-b2 text-gray9'>{job.name}</span>
                <span
                  className={cn('typo-c2 text-gray9', locked && 'invisible')}
                >
                  적합도 {job.fitPercent}%
                </span>
              </span>
              <DropdownIcon
                className={cn(
                  'size-[24px] shrink-0 transition-transform duration-200 group-data-[state=open]:rotate-180',
                  locked && 'invisible',
                )}
              />
            </Accordion.Trigger>
          </Accordion.Header>
          <Accordion.Content className='overflow-hidden data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down'>
            <div className='flex flex-col gap-[1rem] px-[0.75rem] pt-[0.25rem] pb-[1.25rem]'>
              <div>
                <p className='typo-c1-b text-gray5'>직무 소개</p>
                <p className='typo-c1 mt-[0.25rem] text-gray9'>{job.intro}</p>
              </div>
              <div>
                <p className='typo-c1-b text-gray5'>핵심 스킬</p>
                <ul className='typo-c1 mt-[0.25rem] list-disc pl-[1.3125rem] text-gray9'>
                  {job.skills.map((skill, index) => (
                    <li key={`${job.id}-skill-${index}`}>{skill}</li>
                  ))}
                </ul>
              </div>
              <div>
                <p className='typo-c1-b text-gray5'>추천 활동</p>
                <ul className='typo-c1 mt-[0.25rem] list-disc pl-[1.3125rem] text-gray9'>
                  {job.activities.map((activity, index) => (
                    <li key={`${job.id}-activity-${index}`}>{activity}</li>
                  ))}
                </ul>
              </div>
            </div>
          </Accordion.Content>
          {locked && <LockedFrost variant={variant} />}
          {locked && (
            <LockedHeaderChrome title={job.name} fitPercent={job.fitPercent} />
          )}
          {locked && <LoginToViewButton loginHref={loginHref} variant={variant} />}
        </Accordion.Item>
      ))}
    </Accordion.Root>
  );
}

interface RecommendationCompanyCardsProps {
  companies: RecommendedCompany[];
  locked?: boolean;
  loginHref?: string;
  variant?: ResultCardsVariant;
  defaultOpenFirst?: boolean;
}

export function RecommendationCompanyCards({
  companies,
  locked = false,
  loginHref = '/login?redirect_to=%2Frecommendation%2Fresult',
  variant = 'web',
  defaultOpenFirst = false,
}: RecommendationCompanyCardsProps) {
  return (
    <Accordion.Root
      type='multiple'
      defaultValue={defaultOpenIds(companies, defaultOpenFirst)}
      className='flex flex-col gap-[0.75rem]'
    >
      {companies.map((company) => (
        <Accordion.Item
          key={company.id}
          value={company.id}
          className={cn(
            'group relative rounded-[12px] bg-gray1',
            CARD_SHADOW,
            !locked && 'overflow-hidden',
          )}
        >
          <Accordion.Header>
            <Accordion.Trigger
              className={cn(
                'flex w-full cursor-pointer items-center gap-[0.75rem] text-left',
                HEADER_PAD,
              )}
            >
              <span className='size-[2.6875rem] shrink-0 rounded-[8px] bg-[#d9d9d9]' />
              <span className='typo-b2 min-w-0 flex-1 text-gray9'>
                {company.name}
              </span>
              <DropdownIcon
                className={cn(
                  'size-[24px] shrink-0 transition-transform duration-200 group-data-[state=open]:rotate-180',
                  locked && 'invisible',
                )}
              />
            </Accordion.Trigger>
          </Accordion.Header>
          <Accordion.Content className='overflow-hidden data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down'>
            <div className='flex flex-col gap-[0.75rem] px-[0.75rem] pt-[0.25rem] pb-[1.25rem]'>
              <div>
                <p className='typo-c1-b text-gray5'>특징</p>
                <p className='typo-c1 mt-[0.25rem] text-gray9'>
                  {company.features}
                </p>
              </div>
              <div className='flex items-start gap-[0.25rem]'>
                <RecommendationLightbulbIcon className='mt-[3px]' />
                <p className='typo-c1 min-w-0 flex-1 text-gray9'>{company.tip}</p>
              </div>
            </div>
          </Accordion.Content>
          {locked && <LockedFrost variant={variant} />}
          {locked && <LockedHeaderChrome title={company.name} />}
          {locked && <LoginToViewButton loginHref={loginHref} variant={variant} />}
        </Accordion.Item>
      ))}
    </Accordion.Root>
  );
}
