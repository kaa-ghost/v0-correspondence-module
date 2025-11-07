const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"

// Demo users for offline mode
const DEMO_USERS = [
  {
    id: 1,
    email: "admin@test.com",
    password: "admin123",
    full_name: "Администратор",
    role: "admin",
    position: "Системный администратор",
    is_active: true,
    created_at: new Date().toISOString(),
    last_login: new Date().toISOString(),
  },
  {
    id: 2,
    email: "user@test.com",
    password: "user123",
    full_name: "Тестовый пользователь",
    role: "user",
    position: "Пользователь",
    is_active: true,
    created_at: new Date().toISOString(),
    last_login: new Date().toISOString(),
  },
]

let demoMode = false

async function fetchWithFallback(url: string, options: RequestInit = {}) {
  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
    })
    return response
  } catch (error) {
    console.log("[v0] API request failed, switching to demo mode")
    demoMode = true
    throw error
  }
}

export const api = {
  async login(email: string, password: string) {
    try {
      const response = await fetchWithFallback(`${API_URL}/auth/login`, {
        method: "POST",
        body: JSON.stringify({ email, password }),
      })

      if (response.ok) {
        return await response.json()
      }
    } catch (error) {
      // Demo mode fallback
      console.log("[v0] Demo mode fallback: login attempt for", email)
      const user = DEMO_USERS.find((u) => u.email === email && u.password === password)
      if (user) {
        const { password: _, ...userWithoutPassword } = user
        return {
          access_token: "demo-token-" + user.id,
          user: userWithoutPassword,
        }
      }
      throw new Error("Invalid credentials")
    }
    throw new Error("Invalid credentials")
  },

  async register(email: string, password: string, full_name: string) {
    try {
      const response = await fetchWithFallback(`${API_URL}/auth/register`, {
        method: "POST",
        body: JSON.stringify({ email, password, full_name }),
      })

      if (response.ok) {
        return await response.json()
      }
    } catch (error) {
      // Demo mode fallback
      console.log("[v0] Demo mode fallback: registration for", email)
      return {
        message: "Registration successful (demo mode)",
        email,
      }
    }
    throw new Error("Registration failed")
  },

  async validateSession(token: string) {
    try {
      const response = await fetchWithFallback(`${API_URL}/auth/validate`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (response.ok) {
        return await response.json()
      }
    } catch (error) {
      // Demo mode fallback
      console.log("[v0] Demo mode fallback: validating session")
      const userId = token.replace("demo-token-", "")
      const user = DEMO_USERS.find((u) => u.id === Number.parseInt(userId))
      if (user) {
        const { password: _, ...userWithoutPassword } = user
        return {
          valid: true,
          user: userWithoutPassword,
        }
      }
    }
    throw new Error("Invalid session")
  },

  async logout(token: string) {
    try {
      const response = await fetchWithFallback(`${API_URL}/auth/logout`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (response.ok) {
        return await response.json()
      }
    } catch (error) {
      // Demo mode fallback
      console.log("[v0] Demo mode fallback: logout")
      return { message: "Logged out successfully" }
    }
  },

  async get(endpoint: string, token?: string) {
    try {
      const headers: HeadersInit = {
        "Content-Type": "application/json",
      }
      if (token) {
        headers.Authorization = `Bearer ${token}`
      }

      const response = await fetchWithFallback(`${API_URL}${endpoint}`, {
        method: "GET",
        headers,
      })

      if (response.ok) {
        return await response.json()
      }
    } catch (error) {
      // Demo mode fallback for users list
      if (endpoint === "/users") {
        console.log("[v0] Demo mode fallback: GET", endpoint)
        return DEMO_USERS.map(({ password: _, ...user }) => user)
      }
      throw error
    }
    throw new Error("Request failed")
  },

  async put(endpoint: string, data: any, token?: string) {
    try {
      const headers: HeadersInit = {
        "Content-Type": "application/json",
      }
      if (token) {
        headers.Authorization = `Bearer ${token}`
      }

      const response = await fetchWithFallback(`${API_URL}${endpoint}`, {
        method: "PUT",
        headers,
        body: JSON.stringify(data),
      })

      if (response.ok) {
        return await response.json()
      }
    } catch (error) {
      // Demo mode fallback
      console.log("[v0] Demo mode fallback: PUT request", endpoint, data)
      return { ...data, updated_at: new Date().toISOString() }
    }
    throw new Error("Update failed")
  },

  async delete(endpoint: string, token?: string) {
    try {
      const headers: HeadersInit = {
        "Content-Type": "application/json",
      }
      if (token) {
        headers.Authorization = `Bearer ${token}`
      }

      const response = await fetchWithFallback(`${API_URL}${endpoint}`, {
        method: "DELETE",
        headers,
      })

      if (response.ok) {
        return await response.json()
      }
    } catch (error) {
      // Demo mode fallback
      console.log("[v0] Demo mode fallback: DELETE request", endpoint)
      return { message: "Deleted successfully" }
    }
    throw new Error("Delete failed")
  },
}
