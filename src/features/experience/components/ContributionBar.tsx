'use client';

import { useState } from 'react';
import { ContributionSection } from './ContributionSection';

interface ContributionBarProps {
  initialValue?: number;
  duration?: number;
}

export function ContributionBar({
  initialValue = 0,
  duration = 300,
}: ContributionBarProps) {
  const [contribution, setContribution] = useState(initialValue);

  return (
    <ContributionSection initialValue={contribution} duration={duration} />
  );
}
