import api, { unwrap } from './axios'
import type { ApiResult, ApiSuccessResponse, ExportCreatePayload, ExportJob } from './types'

export const requestFamilyBookExport = async (): Promise<ApiResult<ExportCreatePayload>> => {
  const response = await api.post<ApiSuccessResponse<ExportCreatePayload>>('exports/family-book')
  return unwrap(response)
}

export const getExport = async (exportId: number | string): Promise<ApiResult<ExportJob>> => {
  const response = await api.get<ApiSuccessResponse<ExportJob>>(`exports/${exportId}`)
  return unwrap(response)
}
