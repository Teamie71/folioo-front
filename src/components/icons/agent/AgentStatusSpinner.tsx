import React from 'react';

const AgentStatusSpinner = () => {
  return (
    <div>
      <svg
        xmlns='http://www.w3.org/2000/svg'
        width='12'
        height='12'
        viewBox='0 0 12 12'
        fill='none'
      >
        <g clipPath='url(#clip0_11558_11243)'>
          <path
            d='M6 1.5C6.89002 1.5 7.76004 1.76392 8.50007 2.25839C9.24009 2.75285 9.81686 3.45566 10.1575 4.27792C10.4981 5.10019 10.5872 6.00499 10.4135 6.87791C10.2399 7.75082 9.81132 8.55264 9.18198 9.18198C8.55264 9.81132 7.75082 10.2399 6.87791 10.4135C6.00499 10.5872 5.10019 10.4981 4.27792 10.1575C3.45566 9.81686 2.75285 9.24009 2.25839 8.50007C1.76392 7.76004 1.5 6.89002 1.5 6'
            stroke='#5060C5'
            strokeWidth='1.5'
            strokeLinecap='round'
            strokeLinejoin='round'
          />
        </g>
        <defs>
          <clipPath id='clip0_11558_11243'>
            <rect width='12' height='12' fill='white' />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
};

export default AgentStatusSpinner;
