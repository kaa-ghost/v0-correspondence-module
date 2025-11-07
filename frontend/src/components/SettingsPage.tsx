"use client"

import { useState, useEffect } from "react"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Label } from "./ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card"
import { Badge } from "./ui/badge"
import { Alert, AlertDescription } from "./ui/alert"
import { Users, Shield, Trash2, CheckCircle2, XCircle, AlertCircle } from "lucide-react"
import { api } from "../lib/api"

interface User {
  id: number
  email: string
  full_name: string | null
  role: "admin" | "user" | "viewer"
  is_active: boolean
  created_at: string
  last_login: string | null
}

interface SettingsPageProps {
  currentUser: User
}

export function SettingsPage({ currentUser }: SettingsPageProps) {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [editingUser, setEditingUser] = useState<User | null>(null)

  useEffect(() => {
    if (currentUser.role === "admin") {
      loadUsers()
    } else {
      setLoading(false)
    }
  }, [currentUser.role])

  const loadUsers = async () => {
    try {
      setLoading(true)
      const response = await api.get("/users/")
      setUsers(response.data)
      setError(null)
    } catch (err: any) {
      setError(err.response?.data?.detail || "Failed to load users")
    } finally {
      setLoading(false)
    }
  }

  const handleUpdateUser = async (userId: number, updates: Partial<User>) => {
    try {
      await api.put(`/users/${userId}`, updates)
      setSuccess("User updated successfully")
      setEditingUser(null)
      loadUsers()
      setTimeout(() => setSuccess(null), 3000)
    } catch (err: any) {
      setError(err.response?.data?.detail || "Failed to update user")
    }
  }

  const handleDeleteUser = async (userId: number) => {
    if (!confirm("Are you sure you want to delete this user?")) return

    try {
      await api.delete(`/users/${userId}`)
      setSuccess("User deleted successfully")
      loadUsers()
      setTimeout(() => setSuccess(null), 3000)
    } catch (err: any) {
      setError(err.response?.data?.detail || "Failed to delete user")
    }
  }

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case "admin":
        return "bg-red-500 text-white"
      case "user":
        return "bg-blue-500 text-white"
      case "viewer":
        return "bg-gray-500 text-white"
      default:
        return "bg-gray-300"
    }
  }

  if (currentUser.role !== "admin") {
    return (
      <div className="p-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Настройки
            </CardTitle>
            <CardDescription>Ваш профиль</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <Label>Email</Label>
                <Input value={currentUser.email} disabled />
              </div>
              <div>
                <Label>Полное имя</Label>
                <Input value={currentUser.full_name || ""} disabled />
              </div>
              <div>
                <Label>Роль</Label>
                <Badge className={getRoleBadgeColor(currentUser.role)}>
                  {currentUser.role === "admin" ? "Администратор" : "Пользователь"}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Shield className="h-6 w-6" />
          Управление пользователями
        </h1>
        <p className="text-sm text-muted-foreground">Администрирование системы</p>
      </div>

      {error && (
        <Alert className="mb-4 border-red-200 bg-red-50">
          <AlertCircle className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-600">{error}</AlertDescription>
        </Alert>
      )}

      {success && (
        <Alert className="mb-4 border-green-200 bg-green-50">
          <CheckCircle2 className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-600">{success}</AlertDescription>
        </Alert>
      )}

      {loading ? (
        <div className="text-center py-12">Загрузка...</div>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Пользователи системы
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {users.map((user) => (
                <div key={user.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="font-medium">{user.full_name || user.email}</span>
                      <Badge className={getRoleBadgeColor(user.role)}>
                        {user.role === "admin" ? "Администратор" : "Пользователь"}
                      </Badge>
                      {user.is_active ? (
                        <CheckCircle2 className="h-4 w-4 text-green-500" />
                      ) : (
                        <XCircle className="h-4 w-4 text-red-500" />
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">{user.email}</p>
                    {user.last_login && (
                      <p className="text-xs text-muted-foreground mt-1">
                        Последний вход: {new Date(user.last_login).toLocaleString("ru-RU")}
                      </p>
                    )}
                  </div>

                  {editingUser?.id === user.id ? (
                    <div className="flex items-center gap-2">
                      <select
                        value={editingUser.role}
                        onChange={(e) => setEditingUser({ ...editingUser, role: e.target.value as any })}
                        className="border rounded px-2 py-1 text-sm"
                      >
                        <option value="user">Пользователь</option>
                        <option value="admin">Администратор</option>
                        <option value="viewer">Наблюдатель</option>
                      </select>
                      <Button size="sm" onClick={() => handleUpdateUser(user.id, { role: editingUser.role })}>
                        Сохранить
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => setEditingUser(null)}>
                        Отмена
                      </Button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setEditingUser(user)}
                        disabled={user.id === currentUser.id}
                      >
                        Изменить роль
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleUpdateUser(user.id, { is_active: !user.is_active })}
                        disabled={user.id === currentUser.id}
                      >
                        {user.is_active ? "Деактивировать" : "Активировать"}
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleDeleteUser(user.id)}
                        disabled={user.id === currentUser.id}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
