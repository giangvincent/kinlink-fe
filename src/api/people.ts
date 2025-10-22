import api, { unwrap } from './axios'
import type {
  ApiResult,
  ApiSuccessResponse,
  KinshipPathPayload,
  Person,
  PersonListPayload,
  PersonGender,
  PersonVisibility
} from './types'

export interface PersonCreatePayload {
  given_name: string
  surname: string
  middle_name?: string | null
  display_name?: string | null
  gender?: PersonGender | string | null
  birth_date?: string | null
  death_date?: string | null
  visibility?: PersonVisibility | string | null
  meta?: Record<string, unknown> | null
}

export type PersonUpdatePayload = Partial<PersonCreatePayload>

type ListParams = Record<string, string | number | boolean | undefined>

export const listPeople = async (
  params: ListParams = {}
): Promise<ApiResult<PersonListPayload>> => {
  const response = await api.get<ApiSuccessResponse<PersonListPayload>>('people', { params })
  return unwrap(response)
}

export const createPerson = async (
  payload: PersonCreatePayload
): Promise<ApiResult<Person>> => {
  const response = await api.post<ApiSuccessResponse<Person>>('people', payload)
  return unwrap(response)
}

export const getPerson = async (personId: number | string): Promise<ApiResult<Person>> => {
  const response = await api.get<ApiSuccessResponse<Person>>(`people/${personId}`)
  return unwrap(response)
}

export const updatePerson = async (
  personId: number | string,
  payload: PersonUpdatePayload
): Promise<ApiResult<Person>> => {
  const response = await api.put<ApiSuccessResponse<Person>>(`people/${personId}`, payload)
  return unwrap(response)
}

export const deletePerson = async (personId: number | string) => {
  await api.delete(`people/${personId}`)
}

export const getKinship = async (
  personId: number | string,
  targetPersonId: number | string
): Promise<ApiResult<KinshipPathPayload>> => {
  const response = await api.get<ApiSuccessResponse<KinshipPathPayload>>(
    `people/${personId}/kinship`,
    {
      params: { to: targetPersonId }
    }
  )
  return unwrap(response)
}
