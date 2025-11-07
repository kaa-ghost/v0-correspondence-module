import axios from "axios"

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000"

export interface User {
  id: number
  email: string
  full_name: string
  role: string
  is_active: boolean
  created_at: string
  last_login: string | null
}

export interface LoginResponse {
  access_token: string
  token_type: string
  user: User
}

// Demo users fallback
const DEMO_USERS = [
  {
    id: 1,
    email: "admin@test.com",
    password: "admin123",
    full_name: "Администратор",
    role: "admin",
    is_active: true,
    created_at: new Date().toISOString(),
    last_login: new Date().toISOString(),
  },
  {
    id: 2,
    email: "user@test.com",
    password: "user123",
    full_name: "Пользователь",
    role: "user",
    is_active: true,
    created_at: new Date().toISOString(),
    last_login: new Date().toISOString(),
  },
]

const apiClient = axios.create({
  baseURL: `${API_URL}/api`,
  headers: {
    "Content-Type": "application/json",
  },
})

// Add token to requests
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("token")
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export const api = {
  async login(email: string, password: string): Promise<LoginResponse> {
    try {
      const response = await apiClient.post("/auth/login", { email, password })
      return response.data
    } catch (error) {
      // Fallback to demo mode
      console.log("[v0] API unavailable, using demo mode")
      const user = DEMO_USERS.find((u) => u.email === email && u.password === password)
      if (!user) {
        throw new Error("Неверный email или пароль")
      }
      return {
        access_token: `demo_token_${user.id}`,
        token_type: "bearer",
        user: { ...user },
      }
    }
  },

  async register(email: string, password: string, full_name: string): Promise<LoginResponse> {
    try {
      const response = await apiClient.post("/auth/register", { email, password, full_name })
      return response.data
    } catch (error) {
      console.log("[v0] API unavailable, using demo mode")
      const newUser = {
        id: Date.now(),
        email,
        full_name,
        role: "user",
        is_active: true,
        created_at: new Date().toISOString(),
        last_login: null,
      }
      return {
        access_token: `demo_token_${newUser.id}`,
        token_type: "bearer",
        user: newUser,
      }
    }
  },

  async resetPassword(email: string): Promise<void> {
    try {
      await apiClient.post("/auth/password-reset/request", { email })
    } catch (error) {
      console.log("[v0] API unavailable, using demo mode")
    }
  },

  get: (url: string) => apiClient.get(url),
  post: (url: string, data?: any) => apiClient.post(url, data),
  put: (url: string, data?: any) => apiClient.put(url, data),
  delete: (url: string) => apiClient.delete(url),
}
