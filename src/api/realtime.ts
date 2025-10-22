import api, { unwrap } from './axios'
import type { ApiResult, ApiSuccessResponse, RealtimeAuthPayload } from './types'

export interface RealtimeAuthParams {
  channel: string
  socket_id: string
}

export const authenticateRealtime = async (
  params: RealtimeAuthParams
): Promise<ApiResult<RealtimeAuthPayload>> => {
  const response = await api.get<ApiSuccessResponse<RealtimeAuthPayload>>('realtime/auth', {
    params
  })
  return unwrap(response)
}
