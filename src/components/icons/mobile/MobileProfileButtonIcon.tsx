import Image from 'next/image';

export const MobileProfileButtonIcon = () => (
  <Image
    src='/sidebar/profile-chevron.svg'
    alt=''
    width={20}
    height={20}
    className='shrink-0 rotate-90'
  />
);
