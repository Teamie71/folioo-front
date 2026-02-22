import apiClient from '@/lib/axios';
import type { ApiResponse } from '@/types/api/common';
import type { ExtractPdfResponse } from '@/types/api/correction';

/** PDF 텍스트 추출 */
export async function extractPdfPortfolio(
  file: File,
): Promise<ExtractPdfResponse> {
  const formData = new FormData();
  formData.append('file', file);

  const response = await apiClient.post<ApiResponse<ExtractPdfResponse>>(
    '/external-portfolios/extract',
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    },
  );

  if (response.data.isSuccess && response.data.result != null) {
    return response.data.result;
  }

  throw new Error('텍스트 추출에 실패했습니다.');
}
