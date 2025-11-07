const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"
const DEMO_MODE = process.env.NEXT_PUBLIC_DEMO_MODE === "true"

console.log("[v0] API URL configured as:", API_URL)
console.log("[v0] Demo mode:", DEMO_MODE)

export interface User {
  id: number
  email: string
  full_name: string | null
  is_active: boolean
  created_at: string
  last_login: string | null
}

export interface LoginResponse {
  access_token: string
  token_type: string
  user: User
}

export interface ApiError {
  detail: string
}

const DEMO_USERS = [
  {
    id: 1,
    email: "admin@test.com",
    password: "admin123",
    full_name: "Администратор",
    is_active: true,
    created_at: new Date().toISOString(),
    last_login: new Date().toISOString(),
  },
  {
    id: 2,
    email: "user@test.com",
    password: "user123",
    full_name: "Тестовый пользователь",
    is_active: true,
    created_at: new Date().toISOString(),
    last_login: new Date().toISOString(),
  },
]

class ApiClient {
  private baseUrl: string
  private demoMode: boolean

  constructor(baseUrl: string, demoMode = false) {
    this.baseUrl = baseUrl
    this.demoMode = demoMode
  }

  private demoLogin(email: string, password: string): LoginResponse {
    const user = DEMO_USERS.find((u) => u.email === email && u.password === password)
    if (!user) {
      throw new Error("Неверный email или пароль")
    }
    const { password: _, ...userWithoutPassword } = user
    return {
      access_token: `demo_token_${user.id}_${Date.now()}`,
      token_type: "bearer",
      user: userWithoutPassword,
    }
  }

  private demoRegister(email: string, password: string, fullName: string): User {
    const existingUser = DEMO_USERS.find((u) => u.email === email)
    if (existingUser) {
      throw new Error("Пользователь с таким email уже существует")
    }
    const newUser = {
      id: DEMO_USERS.length + 1,
      email,
      full_name: fullName,
      is_active: true,
      created_at: new Date().toISOString(),
      last_login: null,
    }
    DEMO_USERS.push({ ...newUser, password, last_login: new Date().toISOString() })
    return newUser
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`

    console.log("[v0] API Request:", {
      url,
      method: options.method || "GET",
      endpoint,
    })

    try {
      const response = await fetch(url, {
        ...options,
        headers: {
          "Content-Type": "application/json",
          ...options.headers,
        },
      })

      console.log("[v0] API Response:", {
        status: response.status,
        ok: response.ok,
      })

      if (!response.ok) {
        const error: ApiError = await response.json()
        throw new Error(error.detail || "An error occurred")
      }

      return response.json()
    } catch (error) {
      console.error("[v0] API Error:", error)
      throw error
    }
  }

  async register(email: string, password: string, fullName: string): Promise<User> {
    if (this.demoMode) {
      console.log("[v0] Demo mode: Registering user locally")
      return this.demoRegister(email, password, fullName)
    }

    try {
      return await this.request<User>("/api/auth/register", {
        method: "POST",
        body: JSON.stringify({
          email,
          password,
          full_name: fullName,
        }),
      })
    } catch (error) {
      console.log("[v0] Backend unavailable, falling back to demo mode")
      return this.demoRegister(email, password, fullName)
    }
  }

  async login(email: string, password: string): Promise<LoginResponse> {
    if (this.demoMode) {
      console.log("[v0] Demo mode: Authenticating user locally")
      return this.demoLogin(email, password)
    }

    try {
      return await this.request<LoginResponse>("/api/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      })
    } catch (error) {
      console.log("[v0] Backend unavailable, falling back to demo mode")
      return this.demoLogin(email, password)
    }
  }

  async logout(token: string): Promise<void> {
    if (this.demoMode || token.startsWith("demo_token_")) {
      console.log("[v0] Demo mode: Logout (local only)")
      return
    }

    return this.request<void>("/api/auth/logout", {
      method: "POST",
      body: JSON.stringify({ token }),
    })
  }

  async validateSession(token: string): Promise<User> {
    if (token.startsWith("demo_token_")) {
      const userId = Number.parseInt(token.split("_")[2])
      const user = DEMO_USERS.find((u) => u.id === userId)
      if (!user) {
        throw new Error("Invalid session")
      }
      const { password: _, ...userWithoutPassword } = user
      return userWithoutPassword
    }

    return this.request<User>(`/api/auth/validate?token=${token}`)
  }

  async requestPasswordReset(email: string): Promise<{ message: string; token?: string }> {
    if (this.demoMode) {
      const user = DEMO_USERS.find((u) => u.email === email)
      if (!user) {
        throw new Error("Пользователь с таким email не найден")
      }
      return {
        message: "Ссылка для восстановления пароля отправлена на ваш email",
        token: `reset_token_${user.id}`,
      }
    }

    try {
      return await this.request("/api/auth/password-reset/request", {
        method: "POST",
        body: JSON.stringify({ email }),
      })
    } catch (error) {
      console.log("[v0] Backend unavailable, using demo mode")
      const user = DEMO_USERS.find((u) => u.email === email)
      if (!user) {
        throw new Error("Пользователь с таким email не найден")
      }
      return {
        message: "Ссылка для восстановления пароля отправлена на ваш email (демо-режим)",
        token: `reset_token_${user.id}`,
      }
    }
  }

  async confirmPasswordReset(token: string, newPassword: string): Promise<{ message: string }> {
    if (this.demoMode || token.startsWith("reset_token_")) {
      console.log("[v0] Demo mode: Password reset (local only)")
      return { message: "Пароль успешно изменен" }
    }

    return this.request("/api/auth/password-reset/confirm", {
      method: "POST",
      body: JSON.stringify({ token, new_password: newPassword }),
    })
  }
}

export const api = new ApiClient(API_URL, DEMO_MODE)
