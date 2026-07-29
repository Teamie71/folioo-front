'use client';

import { useState, useEffect } from 'react';
import { ContributionSection } from './ContributionSection';

interface ContributionBarProps {
  initialValue?: number;
  duration?: number;
  onSave?: (value: number) => void;
}

export function ContributionBar({
  initialValue = 0,
  duration = 300,
  onSave,
}: ContributionBarProps) {
  const [contribution, setContribution] = useState(initialValue);

  useEffect(() => {
    setContribution(initialValue);
  }, [initialValue]);

  return (
    <ContributionSection
      initialValue={contribution}
      duration={duration}
      onSave={(value) => {
        setContribution(value);
        onSave?.(value);
      }}
    />
  );
}
