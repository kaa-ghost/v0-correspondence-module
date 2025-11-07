"use client"

import { useState, useEffect } from "react"
import { DocumentDashboard } from "@/components/document-dashboard"
import { AuthForm } from "@/components/auth-form"
import { api, type User } from "@/lib/api"

export default function Home() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [currentUser, setCurrentUser] = useState<User | null>(null)

  useEffect(() => {
    const validateSession = async () => {
      const token = localStorage.getItem("sessionToken")

      if (!token) {
        setIsLoading(false)
        return
      }

      try {
        const user = await api.validateSession(token)
        setCurrentUser(user)
        setIsAuthenticated(true)
      } catch (error) {
        localStorage.removeItem("sessionToken")
        localStorage.removeItem("currentUser")
        setIsAuthenticated(false)
      } finally {
        setIsLoading(false)
      }
    }

    validateSession()
  }, [])

  const handleLogin = (user: User, token: string) => {
    localStorage.setItem("sessionToken", token)
    localStorage.setItem("currentUser", JSON.stringify(user))
    setCurrentUser(user)
    setIsAuthenticated(true)
  }

  const handleLogout = async () => {
    const token = localStorage.getItem("sessionToken")

    if (token) {
      try {
        await api.logout(token)
      } catch (error) {
        console.error("Logout error:", error)
      }
    }

    localStorage.removeItem("sessionToken")
    localStorage.removeItem("currentUser")
    setCurrentUser(null)
    setIsAuthenticated(false)
  }

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-muted-foreground">Загрузка...</div>
      </div>
    )
  }

  return isAuthenticated ? (
    <DocumentDashboard currentUser={currentUser} onLogout={handleLogout} />
  ) : (
    <AuthForm onLogin={handleLogin} />
  )
}
