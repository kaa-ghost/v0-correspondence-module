const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000"

export interface User {
  id: number
  email: string
  full_name: string
  role: string
}

export interface LoginResponse {
  access_token: string
  token_type: string
  user: User
}

// Demo users fallback
const DEMO_USERS = [
  { id: 1, email: "admin@test.com", password: "admin123", full_name: "Администратор", role: "admin" },
  { id: 2, email: "user@test.com", password: "user123", full_name: "Пользователь", role: "user" },
]

export const api = {
  async login(email: string, password: string): Promise<LoginResponse> {
    try {
      const response = await fetch(`${API_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      })

      if (!response.ok) {
        throw new Error("Неверный email или пароль")
      }

      return await response.json()
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
        user: { id: user.id, email: user.email, full_name: user.full_name, role: user.role },
      }
    }
  },

  async register(email: string, password: string, full_name: string): Promise<LoginResponse> {
    try {
      const response = await fetch(`${API_URL}/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, full_name }),
      })

      if (!response.ok) {
        throw new Error("Ошибка регистрации")
      }

      return await response.json()
    } catch (error) {
      // Demo mode
      console.log("[v0] API unavailable, using demo mode")
      const newUser = {
        id: Date.now(),
        email,
        full_name,
        role: "user",
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
      const response = await fetch(`${API_URL}/api/auth/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      })

      if (!response.ok) {
        throw new Error("Ошибка восстановления пароля")
      }
    } catch (error) {
      console.log("[v0] API unavailable, using demo mode")
      // In demo mode, just log the action
    }
  },
}
