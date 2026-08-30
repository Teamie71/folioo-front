'use client';

export interface PendingCorrectionDraft {
  companyName: string;
  jobTitle: string;
  jobDescription: string;
}

const DRAFT_KEY = 'folioo:pending-correction-draft';
const DRAFT_CORRECTION_ID_KEY = 'folioo:pending-correction-id';
const PDF_DATABASE_NAME = 'folioo-pending-correction';
const PDF_STORE_NAME = 'draft';
const PDF_FILE_KEY = 'pdf-file';

function canUseBrowserStorage() {
  return typeof window !== 'undefined';
}

export function savePendingCorrectionDraft(draft: PendingCorrectionDraft) {
  if (!canUseBrowserStorage()) return;
  window.sessionStorage.setItem(DRAFT_KEY, JSON.stringify(draft));
}

export function getPendingCorrectionDraft(): PendingCorrectionDraft | null {
  if (!canUseBrowserStorage()) return null;

  try {
    const rawDraft = window.sessionStorage.getItem(DRAFT_KEY);
    if (!rawDraft) return null;
    const draft = JSON.parse(rawDraft) as PendingCorrectionDraft;
    if (
      typeof draft.companyName !== 'string' ||
      typeof draft.jobTitle !== 'string' ||
      typeof draft.jobDescription !== 'string'
    ) {
      return null;
    }
    return draft;
  } catch {
    return null;
  }
}

export function clearPendingCorrectionDraft() {
  if (!canUseBrowserStorage()) return;
  window.sessionStorage.removeItem(DRAFT_KEY);
}

export function markPendingCorrectionId(correctionId: number) {
  if (!canUseBrowserStorage()) return;
  window.sessionStorage.setItem(DRAFT_CORRECTION_ID_KEY, String(correctionId));
}

function isPendingCorrectionId(correctionId: number) {
  if (!canUseBrowserStorage()) return false;
  return (
    window.sessionStorage.getItem(DRAFT_CORRECTION_ID_KEY) ===
    String(correctionId)
  );
}

function clearPendingCorrectionId() {
  if (!canUseBrowserStorage()) return;
  window.sessionStorage.removeItem(DRAFT_CORRECTION_ID_KEY);
}

function openPdfDatabase(): Promise<IDBDatabase | null> {
  if (!canUseBrowserStorage() || !('indexedDB' in window)) {
    return Promise.resolve(null);
  }

  return new Promise((resolve, reject) => {
    const request = window.indexedDB.open(PDF_DATABASE_NAME, 1);
    request.onupgradeneeded = () => {
      if (!request.result.objectStoreNames.contains(PDF_STORE_NAME)) {
        request.result.createObjectStore(PDF_STORE_NAME);
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

export async function savePendingCorrectionPdf(file: File) {
  const database = await openPdfDatabase();
  if (!database) return;

  await new Promise<void>((resolve, reject) => {
    const transaction = database.transaction(PDF_STORE_NAME, 'readwrite');
    transaction.objectStore(PDF_STORE_NAME).put(file, PDF_FILE_KEY);
    transaction.oncomplete = () => resolve();
    transaction.onerror = () => reject(transaction.error);
  });
  database.close();
}

export async function clearPendingCorrectionPdf() {
  const database = await openPdfDatabase();
  if (!database) return;

  await new Promise<void>((resolve, reject) => {
    const transaction = database.transaction(PDF_STORE_NAME, 'readwrite');
    transaction.objectStore(PDF_STORE_NAME).delete(PDF_FILE_KEY);
    transaction.oncomplete = () => resolve();
    transaction.onerror = () => reject(transaction.error);
  });
  database.close();
}

export async function consumePendingCorrectionPdf(
  correctionId: number,
): Promise<File | null> {
  if (!isPendingCorrectionId(correctionId)) return null;

  const database = await openPdfDatabase();
  if (!database) return null;

  try {
    return await new Promise<File | null>((resolve, reject) => {
      const transaction = database.transaction(PDF_STORE_NAME, 'readwrite');
      const store = transaction.objectStore(PDF_STORE_NAME);
      const request = store.get(PDF_FILE_KEY);
      let pendingFile: File | null = null;
      request.onsuccess = () => {
        const value = request.result;
        pendingFile = value instanceof File ? value : null;
        store.delete(PDF_FILE_KEY);
      };
      request.onerror = () => reject(request.error);
      transaction.oncomplete = () => resolve(pendingFile);
      transaction.onerror = () => reject(transaction.error);
    });
  } finally {
    clearPendingCorrectionId();
    database.close();
  }
}
