import api, { unwrap } from './axios'
import type {
  ApiResult,
  ApiSuccessResponse,
  BillingCheckoutPayload,
  BillingPlanSummary,
  BillingUsagePayload
} from './types'

export interface BillingCheckoutRequest {
  plan: string
  seats: number
}

export const getPlan = async (): Promise<ApiResult<BillingPlanSummary>> => {
  const response = await api.get<ApiSuccessResponse<BillingPlanSummary>>('billing/plan')
  return unwrap(response)
}

export const checkout = async (
  payload: BillingCheckoutRequest
): Promise<ApiResult<BillingCheckoutPayload>> => {
  const response = await api.post<ApiSuccessResponse<BillingCheckoutPayload>>(
    'billing/checkout',
    payload
  )
  return unwrap(response)
}

export const getUsage = async (): Promise<ApiResult<BillingUsagePayload>> => {
  const response = await api.get<ApiSuccessResponse<BillingUsagePayload>>('billing/usage')
  return unwrap(response)
}
