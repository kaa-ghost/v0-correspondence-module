const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"

console.log("[v0] API URL configured as:", API_URL)

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

class ApiClient {
  private baseUrl: string

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl
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
    return this.request<User>("/api/auth/register", {
      method: "POST",
      body: JSON.stringify({
        email,
        password,
        full_name: fullName,
      }),
    })
  }

  async login(email: string, password: string): Promise<LoginResponse> {
    return this.request<LoginResponse>("/api/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    })
  }

  async logout(token: string): Promise<void> {
    return this.request<void>("/api/auth/logout", {
      method: "POST",
      body: JSON.stringify({ token }),
    })
  }

  async validateSession(token: string): Promise<User> {
    return this.request<User>(`/api/auth/validate?token=${token}`)
  }

  async requestPasswordReset(email: string): Promise<{ message: string; token?: string }> {
    return this.request("/api/auth/password-reset/request", {
      method: "POST",
      body: JSON.stringify({ email }),
    })
  }

  async confirmPasswordReset(token: string, newPassword: string): Promise<{ message: string }> {
    return this.request("/api/auth/password-reset/confirm", {
      method: "POST",
      body: JSON.stringify({ token, new_password: newPassword }),
    })
  }
}

export const api = new ApiClient(API_URL)
