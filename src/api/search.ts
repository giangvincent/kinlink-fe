import api, { unwrap } from './axios'
import type { ApiResult, ApiSuccessResponse, Person, PostItem } from './types'

export const searchPeople = async (query: string): Promise<ApiResult<Person[]>> => {
  const response = await api.get<ApiSuccessResponse<Person[]>>('search/people', {
    params: { query }
  })
  return unwrap(response)
}

export const searchPosts = async (query: string): Promise<ApiResult<PostItem[]>> => {
  const response = await api.get<ApiSuccessResponse<PostItem[]>>('search/posts', {
    params: { query }
  })
  return unwrap(response)
}
