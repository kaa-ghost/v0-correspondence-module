"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Label } from "./ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card"
import { Alert, AlertDescription } from "./ui/alert"
import { api, type User } from "../lib/api"

interface AuthFormProps {
  onLogin: (user: User, token: string) => void
}

type AuthMode = "login" | "register" | "reset"

export function AuthForm({ onLogin }: AuthFormProps) {
  const [mode, setMode] = useState<AuthMode>("login")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [fullName, setFullName] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setSuccess("")
    setIsLoading(true)

    try {
      if (mode === "login") {
        const response = await api.login(email, password)
        onLogin(response.user, response.access_token)
      } else if (mode === "register") {
        if (password !== confirmPassword) {
          setError("Пароли не совпадают")
          setIsLoading(false)
          return
        }
        if (password.length < 6) {
          setError("Пароль должен содержать минимум 6 символов")
          setIsLoading(false)
          return
        }
        const response = await api.register(email, password, fullName)
        onLogin(response.user, response.access_token)
      } else {
        await api.resetPassword(email)
        setSuccess("Ссылка для восстановления пароля отправлена на email")
        setTimeout(() => setMode("login"), 2000)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Произошла ошибка")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>
          {mode === "login" && "Вход в систему"}
          {mode === "register" && "Регистрация"}
          {mode === "reset" && "Восстановление пароля"}
        </CardTitle>
        <CardDescription>
          {mode === "login" && "Введите свои учетные данные для входа"}
          {mode === "register" && "Создайте новый аккаунт"}
          {mode === "reset" && "Введите email для восстановления пароля"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          {success && (
            <Alert>
              <AlertDescription>{success}</AlertDescription>
            </Alert>
          )}

          {mode === "register" && (
            <div className="space-y-2">
              <Label htmlFor="fullName">Полное имя</Label>
              <Input
                id="fullName"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Иван Иванов"
                required
              />
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="user@example.com"
              required
            />
          </div>

          {mode !== "reset" && (
            <div className="space-y-2">
              <Label htmlFor="password">Пароль</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••"
                required
              />
            </div>
          )}

          {mode === "register" && (
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Подтвердите пароль</Label>
              <Input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••"
                required
              />
            </div>
          )}

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading
              ? "Загрузка..."
              : mode === "login"
                ? "Войти"
                : mode === "register"
                  ? "Зарегистрироваться"
                  : "Отправить"}
          </Button>

          <div className="text-center text-sm space-y-2">
            {mode === "login" && (
              <>
                <button type="button" onClick={() => setMode("reset")} className="text-primary hover:underline">
                  Забыли пароль?
                </button>
                <div>
                  Нет аккаунта?{" "}
                  <button type="button" onClick={() => setMode("register")} className="text-primary hover:underline">
                    Зарегистрироваться
                  </button>
                </div>
              </>
            )}
            {mode === "register" && (
              <div>
                Уже есть аккаунт?{" "}
                <button type="button" onClick={() => setMode("login")} className="text-primary hover:underline">
                  Войти
                </button>
              </div>
            )}
            {mode === "reset" && (
              <button type="button" onClick={() => setMode("login")} className="text-primary hover:underline">
                Вернуться к входу
              </button>
            )}
          </div>

          {mode === "login" && (
            <div className="text-xs text-muted-foreground text-center pt-2 border-t">
              <p>Демо-доступ:</p>
              <p>admin@test.com / admin123</p>
              <p>user@test.com / user123</p>
            </div>
          )}
        </form>
      </CardContent>
    </Card>
  )
}
