import api, { unwrap } from './axios'
import type {
  ApiResult,
  ApiSuccessResponse,
  PostItem,
  PostListPayload,
  PostVisibility
} from './types'

export interface PostListParams {
  cursor?: string
}

export interface PostCreatePayload {
  body: string
  visibility?: PostVisibility | string
  pinned?: boolean
}

export const listPosts = async (
  params: PostListParams = {}
): Promise<ApiResult<PostListPayload>> => {
  const response = await api.get<ApiSuccessResponse<PostListPayload>>('posts', { params })
  return unwrap(response)
}

export const createPost = async (
  payload: PostCreatePayload
): Promise<ApiResult<PostItem>> => {
  const response = await api.post<ApiSuccessResponse<PostItem>>('posts', payload)
  return unwrap(response)
}

export const deletePost = async (postId: number | string) => {
  await api.delete(`posts/${postId}`)
}
