import { NewCorrectionPageClient } from './NewCorrectionPageClient';

interface NewCorrectionPageProps {
  searchParams: Promise<{ resume?: string }>;
}

export default async function NewCorrectionPage({
  searchParams,
}: NewCorrectionPageProps) {
  const { resume } = await searchParams;

  return (
    <NewCorrectionPageClient shouldResumePortfolio={resume === 'portfolio'} />
  );
}
