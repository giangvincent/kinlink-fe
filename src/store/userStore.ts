import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import api from '@/api/axios'
import { clearToken, getToken, setToken } from '@/utils/auth'

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

export const useUserStore = defineStore('user', () => {
  const user = ref<UserProfile | null>(null)
  const token = ref<string | null>(getToken())
  const loading = ref(false)

  const isAuthenticated = computed(() => Boolean(token.value))

  async function login(payload: Credentials) {
    loading.value = true
    try {
      const { data } = await api.post('/auth/login', payload)
      token.value = data.token
      setToken(data.token)
      user.value = data.user
      return data
    } finally {
      loading.value = false
    }
  }

  async function register(payload: RegisterPayload) {
    loading.value = true
    try {
      const { data } = await api.post('/auth/register', payload)
      token.value = data.token
      setToken(data.token)
      user.value = data.user
      return data
    } finally {
      loading.value = false
    }
  }

  async function fetchProfile() {
    if (!token.value) return null
    const { data } = await api.get('/me')
    user.value = data
    return data
  }

  function logout() {
    token.value = null
    user.value = null
    clearToken()
  }

  return {
    user,
    token,
    loading,
    isAuthenticated,
    login,
    register,
    fetchProfile,
    logout
  }
})
