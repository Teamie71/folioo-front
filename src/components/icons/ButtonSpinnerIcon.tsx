'use client';

import { motion } from 'framer-motion';

const DEFAULT_SIZE = 32;

interface ButtonSpinnerIconProps {
  size?: number;
}

export const ButtonSpinnerIcon = ({
  size = DEFAULT_SIZE,
}: ButtonSpinnerIconProps) => {
  return (
    <motion.svg
      xmlns='http://www.w3.org/2000/svg'
      width={size}
      height={size}
      viewBox='0 0 32 32'
      fill='none'
      animate={{ rotate: 360 }}
      transition={{
        repeat: Infinity,
        duration: 1,
        ease: 'linear',
      }}
    >
      <path
        opacity='0.5'
        fillRule='evenodd'
        clipRule='evenodd'
        d='M16 6C13.3478 6 10.8043 7.05357 8.92893 8.92893C7.05357 10.8043 6 13.3478 6 16C6 18.6522 7.05357 21.1957 8.92893 23.0711C10.8043 24.9464 13.3478 26 16 26C18.6522 26 21.1957 24.9464 23.0711 23.0711C24.9464 21.1957 26 18.6522 26 16C26 13.3478 24.9464 10.8043 23.0711 8.92893C21.1957 7.05357 18.6522 6 16 6ZM2 16C2 8.268 8.268 2 16 2C23.732 2 30 8.268 30 16C30 23.732 23.732 30 16 30C8.268 30 2 23.732 2 16Z'
        fill='white'
      />
      <path
        fillRule='evenodd'
        clipRule='evenodd'
        d='M16.0003 6.00001C13.4222 5.9945 10.9426 6.99025 9.08434 8.77735C8.69937 9.13329 8.19003 9.32383 7.66596 9.30794C7.1419 9.29206 6.64504 9.07102 6.28234 8.69241C5.91964 8.31381 5.72011 7.80791 5.72672 7.28365C5.73333 6.75939 5.94554 6.25869 6.31767 5.88935C8.92038 3.38886 12.3911 1.99474 16.0003 2.00001C16.5308 2.00001 17.0395 2.21073 17.4145 2.5858C17.7896 2.96087 18.0003 3.46958 18.0003 4.00001C18.0003 4.53045 17.7896 5.03916 17.4145 5.41423C17.0395 5.7893 16.5308 6.00001 16.0003 6.00001Z'
        fill='white'
      />
    </motion.svg>
  );
};
