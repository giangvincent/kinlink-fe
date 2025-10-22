import api, { clearActiveFamilyId, unwrap, requestSanctumCsrf } from './axios'
import type {
  ApiResult,
  ApiSuccessResponse,
  Membership,
  User
} from './types'

export interface AuthCredentials {
  email: string
  password: string
  device_name?: string
}

export interface RegisterPayload extends AuthCredentials {
  name: string
  locale?: string
  time_zone?: string
}

export interface AuthSession {
  user: User
  token: string
  provider?: string
}

export interface MePayload {
  user: User
  memberships: Membership[]
}

export const register = async (
  payload: RegisterPayload
): Promise<ApiResult<AuthSession>> => {
  // Ensure CSRF cookie is set when using cookie/session based auth (Sanctum)
  await requestSanctumCsrf()
  const response = await api.post<ApiSuccessResponse<AuthSession>>('auth/register', payload)
  return unwrap(response)
}

export const login = async (payload: AuthCredentials): Promise<ApiResult<AuthSession>> => {
  // Ensure CSRF cookie is set when using cookie/session based auth (Sanctum)
  await requestSanctumCsrf()
  const response = await api.post<ApiSuccessResponse<AuthSession>>('auth/login', payload)
  return unwrap(response)
}

export const socialRedirect = async (
  provider: string
): Promise<ApiResult<{ url: string; provider: string }>> => {
  const response = await api.get<ApiSuccessResponse<{ url: string; provider: string }>>(
    `auth/social/${provider}/redirect`
  )
  return unwrap(response)
}

export const socialCallback = async (
  provider: string
): Promise<ApiResult<AuthSession>> => {
  const response = await api.get<ApiSuccessResponse<AuthSession>>(
    `auth/social/${provider}/callback`
  )
  return unwrap(response)
}

export const me = async (): Promise<ApiResult<MePayload>> => {
  const response = await api.get<ApiSuccessResponse<MePayload>>('auth/me')
  return unwrap(response)
}

export const logout = async () => {
  await api.post('auth/logout')
  clearActiveFamilyId()
}
