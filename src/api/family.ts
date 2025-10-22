import api, { setActiveFamilyId, unwrap } from './axios'
import type { ApiResult, ApiSuccessResponse, Family, Membership } from './types'

export interface FamilyCreatePayload {
  name: string
  locale?: string
}

interface FamilySwitchMeta {
  family_id?: number
  suggested_headers?: Record<string, string>
}

export const listFamilies = async (): Promise<ApiResult<Family[]>> => {
  const response = await api.get<ApiSuccessResponse<Family[]>>('families')
  return unwrap(response)
}

export const createFamily = async (payload: FamilyCreatePayload): Promise<ApiResult<Family>> => {
  const response = await api.post<ApiSuccessResponse<Family>>('families', payload)
  const result = unwrap(response)

  if (result.data?.id) {
    setActiveFamilyId(result.data.id)
  }

  return result
}

export const getFamily = async (familyId: number | string): Promise<ApiResult<Family>> => {
  const response = await api.get<ApiSuccessResponse<Family>>(`families/${familyId}`)
  return unwrap(response)
}

export const switchFamily = async (
  familyId: number | string
): Promise<ApiResult<Family, FamilySwitchMeta>> => {
  const response = await api.post<ApiSuccessResponse<Family, FamilySwitchMeta>>(
    `families/${familyId}/switch`
  )
  const result = unwrap(response)

  const meta = result.meta ?? {}
  if (meta.family_id) {
    setActiveFamilyId(meta.family_id)
  } else if (meta.suggested_headers?.['X-Family-ID']) {
    setActiveFamilyId(meta.suggested_headers['X-Family-ID'])
  } else if (result.data?.id) {
    setActiveFamilyId(result.data.id)
  }

  return result
}

export const listMemberships = async (): Promise<ApiResult<Membership[]>> => {
  const response = await api.get<ApiSuccessResponse<Membership[]>>('memberships')
  return unwrap(response)
}
