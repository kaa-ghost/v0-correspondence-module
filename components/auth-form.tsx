"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Building2, ArrowLeft } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface AuthFormProps {
  onLogin: (username: string, password: string) => void
  onRegister: (username: string, email: string, password: string) => void
}

type ViewType = "login" | "register" | "forgot-password" | "reset-success"

export function AuthForm({ onLogin, onRegister }: AuthFormProps) {
  const [view, setView] = useState<ViewType>("login")
  const [username, setUsername] = useState("")
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

    setTimeout(() => {
      onLogin(username, password)
      setIsLoading(false)
    }, 1000)
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setSuccess("")

    // Validation
    if (password.length < 6) {
      setError("Пароль должен содержать минимум 6 символов")
      return
    }

    if (password !== confirmPassword) {
      setError("Пароли не совпадают")
      return
    }

    setIsLoading(true)

    // Simulate API call
    setTimeout(() => {
      onRegister(username, email, password)
      setSuccess("Регистрация успешна! Теперь вы можете войти в систему.")
      setIsLoading(false)

      // Switch to login view after 2 seconds
      setTimeout(() => {
        setView("login")
        setSuccess("")
      }, 2000)
    }, 1000)
  }

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false)
      setView("reset-success")
    }, 1000)
  }

  const resetForm = () => {
    setUsername("")
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
                <Label htmlFor="username">Имя пользователя</Label>
                <Input
                  id="username"
                  type="text"
                  placeholder="Введите имя пользователя"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
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
              <div className="mt-4 text-center text-sm text-muted-foreground">
                <p>Демо доступ: admin / admin</p>
              </div>
            </form>
          )}

          {/* Registration Form */}
          {view === "register" && (
            <form onSubmit={handleRegister} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="reg-username">Имя пользователя</Label>
                <Input
                  id="reg-username"
                  type="text"
                  placeholder="Введите имя пользователя"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
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
                  Письмо с инструкциями по восстановлению пароля отправлено на <strong>{email}</strong>
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
