import { create } from 'zustand';

interface PendingPortfolioCreation {
  experienceId: string;
  portfolioId: number;
}

interface PortfolioCreationStore {
  pending: PendingPortfolioCreation | null;
  /* experienceId → portfolioId (리다이렉트 후 portfolio 페이지에서 조회용) */
  resolvedPortfolioIds: Record<string, number>;
  setPending: (experienceId: string, portfolioId: number) => void;
  setResolved: (experienceId: string, portfolioId: number) => void;
  clearPending: () => void;
  getPortfolioId: (experienceId: string) => number | undefined;
}

export const usePortfolioCreationStore = create<PortfolioCreationStore>(
  (set, get) => ({
    pending: null,
    resolvedPortfolioIds: {},
    setPending: (experienceId, portfolioId) =>
      set({ pending: { experienceId, portfolioId } }),
    setResolved: (experienceId, portfolioId) =>
      set((state) => ({
        resolvedPortfolioIds: {
          ...state.resolvedPortfolioIds,
          [experienceId]: portfolioId,
        },
      })),
    clearPending: () => set({ pending: null }),
    getPortfolioId: (experienceId) => get().resolvedPortfolioIds[experienceId],
  }),
);
