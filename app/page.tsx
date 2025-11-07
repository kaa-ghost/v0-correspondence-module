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
    console.log("[v0] App mounted, checking authentication")
    const validateSession = async () => {
      const token = localStorage.getItem("sessionToken")

      if (!token) {
        console.log("[v0] No token found, showing login form")
        setIsLoading(false)
        return
      }

      console.log("[v0] Token found, validating session")
      try {
        const user = await api.validateSession(token)
        console.log("[v0] Session valid, user:", user)
        setCurrentUser(user)
        setIsAuthenticated(true)
      } catch (error) {
        console.log("[v0] Session validation failed:", error)
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
    console.log("[v0] Login successful, user:", user)
    localStorage.setItem("sessionToken", token)
    localStorage.setItem("currentUser", JSON.stringify(user))
    setCurrentUser(user)
    setIsAuthenticated(true)
  }

  const handleLogout = async () => {
    console.log("[v0] Logging out")
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

  console.log("[v0] Render state - isLoading:", isLoading, "isAuthenticated:", isAuthenticated)

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
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
