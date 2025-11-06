"use client"

import { useState, useEffect } from "react"
import { DocumentDashboard } from "@/components/document-dashboard"
import { AuthForm } from "@/components/auth-form"

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
    const users = JSON.parse(localStorage.getItem("users") || "[]")
    const user = users.find((u: any) => u.username === username && u.password === password)

    if ((username === "admin" && password === "admin") || user) {
      localStorage.setItem("isAuthenticated", "true")
      localStorage.setItem("username", username)
      setIsAuthenticated(true)
    } else {
      alert("Неверное имя пользователя или пароль")
    }
  }

  const handleRegister = (username: string, email: string, password: string) => {
    const users = JSON.parse(localStorage.getItem("users") || "[]")

    // Check if user already exists
    const existingUser = users.find((u: any) => u.username === username || u.email === email)
    if (existingUser) {
      alert("Пользователь с таким именем или email уже существует")
      return
    }

    // Add new user
    users.push({ username, email, password })
    localStorage.setItem("users", JSON.stringify(users))
  }

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-muted-foreground">Загрузка...</div>
      </div>
    )
  }

  return isAuthenticated ? <DocumentDashboard /> : <AuthForm onLogin={handleLogin} onRegister={handleRegister} />
}
