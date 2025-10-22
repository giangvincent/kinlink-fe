import api, { unwrap } from './axios'
import type { ApiResult, ApiSuccessResponse, MediaItem, UploadSignature } from './types'

export interface UploadSignaturePayload {
  filename: string
  contentType: string
}

export interface MediaAttachPayload {
  model_type: string
  model_id: number
  collection: string
  file_url: string
  meta?: Record<string, unknown> | null
}

export interface MediaListParams {
  collection?: string
}

export const signUpload = async (
  payload: UploadSignaturePayload
): Promise<ApiResult<UploadSignature>> => {
  const response = await api.post<ApiSuccessResponse<UploadSignature>>('uploads/sign', payload)
  return unwrap(response)
}

export const attachMedia = async (
  payload: MediaAttachPayload
): Promise<ApiResult<MediaItem>> => {
  const response = await api.post<ApiSuccessResponse<MediaItem>>('media/attach', payload)
  return unwrap(response)
}

export const listMedia = async (
  modelType: string,
  modelId: number | string,
  params: MediaListParams = {}
): Promise<ApiResult<MediaItem[]>> => {
  const response = await api.get<ApiSuccessResponse<MediaItem[]>>(
    `media/${modelType}/${modelId}`,
    { params }
  )
  return unwrap(response)
}

export const deleteMedia = async (uuid: string) => {
  await api.delete(`media/${uuid}`)
}
