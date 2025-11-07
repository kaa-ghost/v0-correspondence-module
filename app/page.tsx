"use client"

import { useState, useEffect } from "react"
import { AuthForm } from "@/components/auth-form"
import { DocumentDashboard } from "@/components/document-dashboard"
import { api } from "@/lib/api"

export default function HomePage() {
  const [isLoading, setIsLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    console.log("[v0] App mounted, checking authentication")
    checkAuth()
  }, [])

  const checkAuth = async () => {
    const token = localStorage.getItem("token")
    if (!token) {
      setIsLoading(false)
      return
    }

    try {
      const response = await api.validateSession(token)
      setUser(response.user)
      setIsAuthenticated(true)
    } catch (error) {
      localStorage.removeItem("token")
      localStorage.removeItem("user")
    }
    setIsLoading(false)
  }

  const handleLoginSuccess = (userData: any) => {
    setUser(userData)
    setIsAuthenticated(true)
  }

  const handleLogout = () => {
    console.log("[v0] Logging out")
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    setIsAuthenticated(false)
    setUser(null)
  }

  console.log("[v0] Render state - isLoading:", isLoading, "isAuthenticated:", isAuthenticated)

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent"></div>
          <p className="mt-2 text-sm text-muted-foreground">Загрузка...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return <AuthForm onLoginSuccess={handleLoginSuccess} />
  }

  return <DocumentDashboard user={user} onLogout={handleLogout} />
}
