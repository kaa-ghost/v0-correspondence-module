"use client"

import { useState, useEffect } from "react"
import { DocumentDashboard } from "@/components/document-dashboard"
import { LoginForm } from "@/components/login-form"

export default function Home() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const authStatus = localStorage.getItem("isAuthenticated")
    if (authStatus === "true") {
      setIsAuthenticated(true)
    }
    setIsLoading(false)
  }, [])

  const handleLogin = (username: string, password: string) => {
    // Simple demo authentication - in production, this would call your backend API
    if (username === "admin" && password === "admin") {
      localStorage.setItem("isAuthenticated", "true")
      localStorage.setItem("username", username)
      setIsAuthenticated(true)
    } else {
      alert("Неверное имя пользователя или пароль")
    }
  }

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-muted-foreground">Загрузка...</div>
      </div>
    )
  }

  return isAuthenticated ? <DocumentDashboard /> : <LoginForm onLogin={handleLogin} />
}
