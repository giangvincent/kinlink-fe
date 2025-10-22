import api, { unwrap } from './axios'
import type { ApiResult, ApiSuccessResponse, EventItem, EventType } from './types'

export interface EventListParams {
  from?: string
  to?: string
}

export interface EventCreatePayload {
  person_id?: number | null
  type: EventType | string
  date_exact?: string | null
  date_range?: Record<string, unknown> | null
  lunar?: boolean
  place?: string | null
  notes?: string | null
}

export const listEvents = async (
  params: EventListParams = {}
): Promise<ApiResult<EventItem[]>> => {
  const response = await api.get<ApiSuccessResponse<EventItem[]>>('events', { params })
  return unwrap(response)
}

export const createEvent = async (
  payload: EventCreatePayload
): Promise<ApiResult<EventItem>> => {
  const response = await api.post<ApiSuccessResponse<EventItem>>('events', payload)
  return unwrap(response)
}
