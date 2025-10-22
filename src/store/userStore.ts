import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { requestSanctumCsrf } from '@/api/axios'
import { clearToken, getToken, setToken } from '@/utils/auth'
import { login as apiLogin, register as apiRegister, me as apiMe } from '@/api/auth'
import { switchFamily } from '@/api/family'
import { createFamily } from '@/api/family'

interface UserProfile {
  id: string
  name: string
  email: string
  avatarUrl?: string
}

interface Credentials {
  email: string
  password: string
}

interface RegisterPayload extends Credentials {
  name: string
}

interface AuthResponse {
  token: string
  user: UserProfile
}

interface Membership {
  family_id: number
  family_name: string
  family_slug: string
  role: string | null
}

export const useUserStore = defineStore('user', () => {
  const storedToken = getToken()
  const user = ref<UserProfile | null>(null)
  const token = ref<string | null>(storedToken ?? null)
  const memberships = ref<Membership[] | null>(null)
  const loading = ref(false)

  if (storedToken) {
    setToken(storedToken)
  }

  const applySession = (session: AuthResponse) => {
    token.value = session.token
    setToken(session.token)
    user.value = session.user
    return session
  }

  const isAuthenticated = computed(() => Boolean(token.value))

  async function login(payload: Credentials) {
    loading.value = true
    try {
      // ensure CSRF cookie when using Sanctum session login
      await requestSanctumCsrf()
      const res = await apiLogin(payload)
      const session = applySession(res.data)

      // fetch full profile including memberships
      const meRes = await apiMe()
      if (meRes?.data) {
        user.value = meRes.data.user
        memberships.value = meRes.data.memberships ?? []

        const familyId = memberships.value?.[0]?.family_id ?? null
        if (familyId) {
          await switchFamily(familyId)
        } else {
          // If the user has no memberships yet, create a default family for them so
          // the app has a family context and APIs that expect X-Family-ID won't 401.
          const defaultName = `${user.value?.name ?? 'My'} Family`
          const created = await createFamily({ name: defaultName })
          // createFamily will set the active family id when successful
          if (created?.data?.id) {
            await switchFamily(created.data.id)
          }
        }
      }

      return session
    } finally {
      loading.value = false
    }
  }

  async function register(payload: RegisterPayload) {
    loading.value = true
    try {
      await requestSanctumCsrf()
      const res = await apiRegister(payload)
      const session = applySession(res.data)

      const meRes = await apiMe()
      if (meRes?.data) {
        user.value = meRes.data.user
        memberships.value = meRes.data.memberships ?? []

        const familyId = memberships.value?.[0]?.family_id ?? null
        if (familyId) {
          await switchFamily(familyId)
        } else {
          const defaultName = `${user.value?.name ?? 'My'} Family`
          const created = await createFamily({ name: defaultName })
          if (created?.data?.id) {
            await switchFamily(created.data.id)
          }
        }
      }

      return session
    } finally {
      loading.value = false
    }
  }

  async function fetchProfile() {
    if (!token.value) return null
    const meRes = await apiMe()
    if (!meRes?.data) return null
    user.value = meRes.data.user
    memberships.value = meRes.data.memberships ?? []
    return user.value
  }

  function logout() {
    token.value = null
    user.value = null
    clearToken()
  }

  return {
    user,
    token,
    memberships,
    loading,
    isAuthenticated,
    login,
    register,
    fetchProfile,
    logout
  }
})
