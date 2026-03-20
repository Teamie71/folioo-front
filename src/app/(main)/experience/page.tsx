'use client';

import ExperienceClient from './ExperienceClient';
import ExperienceClientMobile from './ExperienceClientMobile';

export default function ExperiencePage() {
  return (
    <>
      <div className='hidden md:block'>
        <ExperienceClient />
      </div>
      <div className='md:hidden'>
        <ExperienceClientMobile />
      </div>
    </>
  );
}
