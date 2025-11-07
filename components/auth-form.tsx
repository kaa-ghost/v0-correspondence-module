"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Building2, ArrowLeft } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { api, type User } from "@/lib/api"

interface AuthFormProps {
  onLogin: (user: User, token: string) => void
}

type ViewType = "login" | "register" | "forgot-password" | "reset-success"

export function AuthForm({ onLogin }: AuthFormProps) {
  const [view, setView] = useState<ViewType>("login")
  const [fullName, setFullName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    console.log("[v0] Attempting login with email:", email)

    try {
      const response = await api.login(email, password)
      console.log("[v0] Login successful:", response)
      onLogin(response.user, response.access_token)
    } catch (err) {
      console.error("[v0] Login error:", err)
      if (err instanceof TypeError && err.message.includes("fetch")) {
        setError(
          "Не удается подключиться к серверу. Убедитесь, что backend запущен на http://localhost:8000 или используйте демо-режим (admin@test.com / admin123)",
        )
      } else {
        setError(err instanceof Error ? err.message : "Ошибка входа")
      }
    } finally {
      setIsLoading(false)
    }
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setSuccess("")

    if (password.length < 6) {
      setError("Пароль должен содержать минимум 6 символов")
      return
    }

    if (password !== confirmPassword) {
      setError("Пароли не совпадают")
      return
    }

    setIsLoading(true)

    console.log("[v0] Attempting registration with email:", email)

    try {
      await api.register(email, password, fullName)
      console.log("[v0] Registration successful")
      setSuccess("Регистрация успешна! Теперь вы можете войти в систему.")

      setTimeout(() => {
        setView("login")
        setSuccess("")
      }, 2000)
    } catch (err) {
      console.error("[v0] Registration error:", err)
      if (err instanceof TypeError && err.message.includes("fetch")) {
        setError("Не удается подключиться к серверу. Убедитесь, что backend запущен на http://localhost:8000")
      } else {
        setError(err instanceof Error ? err.message : "Ошибка регистрации")
      }
    } finally {
      setIsLoading(false)
    }
  }

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    console.log("[v0] Requesting password reset for:", email)

    try {
      const response = await api.requestPasswordReset(email)
      console.log("[v0] Password reset requested:", response)
      setSuccess(response.message)
      setView("reset-success")
    } catch (err) {
      console.error("[v0] Password reset error:", err)
      if (err instanceof TypeError && err.message.includes("fetch")) {
        setError("Не удается подключиться к серверу. Убедитесь, что backend запущен на http://localhost:8000")
      } else {
        setError(err instanceof Error ? err.message : "Ошибка отправки письма")
      }
    } finally {
      setIsLoading(false)
    }
  }

  const resetForm = () => {
    setFullName("")
    setEmail("")
    setPassword("")
    setConfirmPassword("")
    setError("")
    setSuccess("")
  }

  const switchView = (newView: ViewType) => {
    resetForm()
    setView(newView)
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/30 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-4 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
            <Building2 className="h-8 w-8 text-primary" />
          </div>
          <div>
            <CardTitle className="text-2xl">
              {view === "login" && "Вход в систему"}
              {view === "register" && "Регистрация"}
              {view === "forgot-password" && "Восстановление пароля"}
              {view === "reset-success" && "Письмо отправлено"}
            </CardTitle>
            <CardDescription className="mt-2">
              {view === "login" && "Войдите в систему для доступа к модулям"}
              {view === "register" && "Создайте новый аккаунт для работы с системой"}
              {view === "forgot-password" && "Введите email для восстановления пароля"}
              {view === "reset-success" && "Проверьте вашу почту"}
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {success && (
            <Alert className="mb-4 border-green-500 bg-green-50 text-green-900 dark:bg-green-950 dark:text-green-100">
              <AlertDescription>{success}</AlertDescription>
            </Alert>
          )}

          {/* Login Form */}
          {view === "login" && (
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Введите email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={isLoading}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Пароль</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Введите пароль"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={isLoading}
                />
              </div>
              <div className="flex items-center justify-between text-sm">
                <button
                  type="button"
                  onClick={() => switchView("forgot-password")}
                  className="text-primary hover:underline"
                >
                  Забыли пароль?
                </button>
              </div>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Вход..." : "Войти"}
              </Button>
              <div className="text-center text-sm">
                <span className="text-muted-foreground">Нет аккаунта? </span>
                <button type="button" onClick={() => switchView("register")} className="text-primary hover:underline">
                  Зарегистрироваться
                </button>
              </div>
              <div className="rounded-lg bg-muted p-3 text-center text-sm">
                <p className="font-medium">Демо-доступ:</p>
                <p className="text-muted-foreground">admin@test.com / admin123</p>
              </div>
            </form>
          )}

          {/* Registration Form */}
          {view === "register" && (
            <form onSubmit={handleRegister} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="reg-fullname">Полное имя</Label>
                <Input
                  id="reg-fullname"
                  type="text"
                  placeholder="Введите полное имя"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                  disabled={isLoading}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="reg-email">Email</Label>
                <Input
                  id="reg-email"
                  type="email"
                  placeholder="Введите email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={isLoading}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="reg-password">Пароль</Label>
                <Input
                  id="reg-password"
                  type="password"
                  placeholder="Минимум 6 символов"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={isLoading}
                  minLength={6}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirm-password">Подтвердите пароль</Label>
                <Input
                  id="confirm-password"
                  type="password"
                  placeholder="Повторите пароль"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  disabled={isLoading}
                />
              </div>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Регистрация..." : "Зарегистрироваться"}
              </Button>
              <div className="text-center text-sm">
                <span className="text-muted-foreground">Уже есть аккаунт? </span>
                <button type="button" onClick={() => switchView("login")} className="text-primary hover:underline">
                  Войти
                </button>
              </div>
            </form>
          )}

          {/* Forgot Password Form */}
          {view === "forgot-password" && (
            <form onSubmit={handleForgotPassword} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="forgot-email">Email</Label>
                <Input
                  id="forgot-email"
                  type="email"
                  placeholder="Введите ваш email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={isLoading}
                />
              </div>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Отправка..." : "Отправить ссылку для сброса"}
              </Button>
              <button
                type="button"
                onClick={() => switchView("login")}
                className="flex w-full items-center justify-center gap-2 text-sm text-muted-foreground hover:text-foreground"
              >
                <ArrowLeft className="h-4 w-4" />
                Вернуться к входу
              </button>
            </form>
          )}

          {/* Reset Success Message */}
          {view === "reset-success" && (
            <div className="space-y-4 text-center">
              <div className="rounded-lg bg-green-50 p-4 dark:bg-green-950">
                <p className="text-sm text-green-900 dark:text-green-100">
                  {success || `Письмо с инструкциями по восстановлению пароля отправлено на ${email}`}
                </p>
              </div>
              <p className="text-sm text-muted-foreground">
                Проверьте папку "Спам", если письмо не пришло в течение нескольких минут.
              </p>
              <Button onClick={() => switchView("login")} className="w-full">
                Вернуться к входу
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
