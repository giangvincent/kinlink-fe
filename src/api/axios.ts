import Axios from 'axios'
import type { AxiosResponse } from 'axios'

import { clearToken, getToken } from '@/utils/auth'

import type { ApiResult, ApiSuccessResponse } from './types'

const FAMILY_STORAGE_KEY = 'kinlink-family-id'

const resolveBaseUrl = () => {
  const base = import.meta.env.VITE_API_BASE_URL

  if (!base) {
    return '/api'
  }

  return `${base.replace(/\/\/+$/, '')}/api`
}

const resolveApiRoot = () => {
  const base = import.meta.env.VITE_API_BASE_URL
  if (!base) return ''
  return base.replace(/\/\/+$/, '')
}

const api = Axios.create({
  baseURL: resolveBaseUrl(),
  withCredentials: true,
  headers: {
    Accept: 'application/json'
  }
})

let activeFamilyId: string | null = null
if (typeof window !== 'undefined') {
  activeFamilyId = window.localStorage.getItem(FAMILY_STORAGE_KEY)
}

export const getActiveFamilyId = () => activeFamilyId

export const setActiveFamilyId = (familyId: string | number | null) => {
  if (familyId === null || familyId === undefined || familyId === '') {
    activeFamilyId = null
    if (typeof window !== 'undefined') {
      window.localStorage.removeItem(FAMILY_STORAGE_KEY)
    }
    return
  }

  activeFamilyId = String(familyId)
  if (typeof window !== 'undefined') {
    window.localStorage.setItem(FAMILY_STORAGE_KEY, activeFamilyId)
  }
}

export const clearActiveFamilyId = () => setActiveFamilyId(null)

api.interceptors.request.use((config) => {
  const token = getToken()

  if (!config.headers) {
    config.headers = {}
  }

  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }

  if (activeFamilyId) {
    config.headers['X-Family-ID'] = activeFamilyId
  }

  return config
})

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      clearToken()
    }
    return Promise.reject(error)
  }
)

export const unwrap = <
  Data,
  Meta extends Record<string, unknown> = Record<string, unknown>
>(
  response: AxiosResponse<ApiSuccessResponse<Data, Meta>>
): ApiResult<Data, Meta> => {
  const payload = response.data

  return {
    data: payload.data,
    meta: (payload.meta ?? {}) as Meta
  }
}

export default api

/**
 * Request the Sanctum CSRF cookie from the application root.
 *
 * Note: Laravel's `/sanctum/csrf-cookie` endpoint lives at the application root
 * (not under the API prefix). We call the top-level Axios instance here so that
 * `baseURL` from the `api` instance isn't applied.
 */
const API_ROOT = resolveApiRoot()

export const requestSanctumCsrf = async (): Promise<void> => {
  // If VITE_API_BASE_URL is set, call that host's root `/sanctum/csrf-cookie`.
  // Otherwise fall back to same-origin `/sanctum/csrf-cookie`.
  const url = API_ROOT ? `${API_ROOT}/sanctum/csrf-cookie` : '/sanctum/csrf-cookie'
  await Axios.get(url, { withCredentials: true })
}
