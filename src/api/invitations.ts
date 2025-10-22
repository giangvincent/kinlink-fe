import api, { unwrap } from './axios'
import type {
  ApiResult,
  ApiSuccessResponse,
  Invitation,
  InvitationAcceptPayload,
  InvitationLookupPayload,
  InvitationRole
} from './types'

export interface InvitationCreatePayload {
  email: string
  role: InvitationRole
}

export interface InvitationAcceptInput {
  name?: string
  password?: string
}

export const createInvitation = async (
  payload: InvitationCreatePayload
): Promise<ApiResult<Invitation>> => {
  const response = await api.post<ApiSuccessResponse<Invitation>>('invitations', payload)
  return unwrap(response)
}

export const getInvitation = async (
  token: string
): Promise<ApiResult<InvitationLookupPayload>> => {
  const response = await api.get<ApiSuccessResponse<InvitationLookupPayload>>(
    `invitations/${token}`
  )
  return unwrap(response)
}

export const acceptInvitation = async (
  token: string,
  payload: InvitationAcceptInput = {}
): Promise<ApiResult<InvitationAcceptPayload>> => {
  const response = await api.post<ApiSuccessResponse<InvitationAcceptPayload>>(
    `invitations/${token}/accept`,
    payload
  )
  return unwrap(response)
}
