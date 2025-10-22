import api, { unwrap } from './axios'
import type { ApiResult, ApiSuccessResponse, Relationship, RelationshipType } from './types'

export interface RelationshipPayload {
  person_id_a: number
  person_id_b: number
  type: RelationshipType
  certainty?: number
  source?: string | null
  notes?: string | null
}

export const createRelationship = async (
  payload: RelationshipPayload
): Promise<ApiResult<Relationship>> => {
  const response = await api.post<ApiSuccessResponse<Relationship>>('relationships', payload)
  return unwrap(response)
}

export const deleteRelationship = async (relationshipId: number | string) => {
  await api.delete(`relationships/${relationshipId}`)
}
