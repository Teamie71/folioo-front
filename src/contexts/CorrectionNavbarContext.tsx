'use client';

import { createContext, useContext } from 'react';

type CorrectionNavbarContextValue = {
  setShowNavbarOnResult: (show: boolean) => void;
};

export const CorrectionNavbarContext = createContext<
  CorrectionNavbarContextValue | undefined
>(undefined);

export function useCorrectionNavbar() {
  return useContext(CorrectionNavbarContext);
}
