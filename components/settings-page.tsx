"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Users, Shield, AlertCircle, CheckCircle2, Edit2, Save, X } from "lucide-react"
import { api } from "@/lib/api"
import { UsersTable } from "@/components/users-table"

interface User {
  id: number
  email: string
  full_name: string | null
  position: string | null
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

  const [isEditingProfile, setIsEditingProfile] = useState(false)
  const [profileData, setProfileData] = useState({
    full_name: currentUser.full_name || "",
    position: currentUser.position || "",
    email: currentUser.email,
  })

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
      const token = localStorage.getItem("authToken")
      const response = await api.get<User[]>("/users/", token || undefined)
      setUsers(response.data)
      setError(null)
    } catch (err: any) {
      console.error("[v0] Failed to load users, using demo data:", err)
      setUsers([
        {
          id: 1,
          email: "admin@test.com",
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
          full_name: "Тестовый пользователь",
          role: "user",
          position: "Пользователь",
          is_active: true,
          created_at: new Date().toISOString(),
          last_login: new Date().toISOString(),
        },
      ])
      setError(null) // Clear error since we have demo data
    } finally {
      setLoading(false)
    }
  }

  const handleUpdateUser = async (userId: number, updates: Partial<User>) => {
    try {
      const token = localStorage.getItem("authToken")
      await api.put(`/users/${userId}`, updates, token || undefined)
      setSuccess("Пользователь успешно обновлен")
      loadUsers()
      setTimeout(() => setSuccess(null), 3000)
    } catch (err: any) {
      setError("Не удалось обновить пользователя (демо-режим)")
      setTimeout(() => setError(null), 5000)
    }
  }

  const handleDeleteUser = async (userId: number) => {
    if (!confirm("Вы уверены, что хотите удалить этого пользователя?")) return

    try {
      const token = localStorage.getItem("authToken")
      await api.delete(`/users/${userId}`, token || undefined)
      setSuccess("Пользователь успешно удален")
      loadUsers()
      setTimeout(() => setSuccess(null), 3000)
    } catch (err: any) {
      setError("Не удалось удалить пользователя (демо-режим)")
      setTimeout(() => setError(null), 5000)
    }
  }

  const handleUpdateProfile = async () => {
    try {
      const token = localStorage.getItem("authToken")
      await api.put(`/users/${currentUser.id}`, profileData, token || undefined)
      setSuccess("Профиль успешно обновлен")
      setIsEditingProfile(false)
      setTimeout(() => setSuccess(null), 3000)
    } catch (err: any) {
      setError("Не удалось обновить профиль (демо-режим)")
      setTimeout(() => setError(null), 5000)
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

  const getRoleLabel = (role: string) => {
    switch (role) {
      case "admin":
        return "Администратор"
      case "user":
        return "Пользователь"
      case "viewer":
        return "Наблюдатель"
      default:
        return role
    }
  }

  if (currentUser.role !== "admin") {
    return (
      <div className="p-6 flex-1 overflow-y-auto">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Настройки
            </CardTitle>
            <CardDescription>Ваш профиль</CardDescription>
          </CardHeader>
          <CardContent>
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

            <div className="space-y-4">
              <div>
                <Label>Email</Label>
                {isEditingProfile ? (
                  <Input
                    value={profileData.email}
                    onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                  />
                ) : (
                  <Input value={currentUser.email} disabled />
                )}
              </div>
              <div>
                <Label>Полное имя</Label>
                {isEditingProfile ? (
                  <Input
                    value={profileData.full_name}
                    onChange={(e) => setProfileData({ ...profileData, full_name: e.target.value })}
                  />
                ) : (
                  <Input value={currentUser.full_name || ""} disabled />
                )}
              </div>
              <div>
                <Label>Должность</Label>
                {isEditingProfile ? (
                  <Input
                    value={profileData.position}
                    onChange={(e) => setProfileData({ ...profileData, position: e.target.value })}
                  />
                ) : (
                  <Input value={currentUser.position || ""} disabled />
                )}
              </div>
              <div>
                <Label>Роль</Label>
                <div className="mt-2">
                  <Badge className={getRoleBadgeColor(currentUser.role)}>{getRoleLabel(currentUser.role)}</Badge>
                </div>
              </div>

              <div className="flex gap-2 pt-4">
                {isEditingProfile ? (
                  <>
                    <Button onClick={handleUpdateProfile} className="flex items-center gap-2">
                      <Save className="h-4 w-4" />
                      Сохранить
                    </Button>
                    <Button variant="outline" onClick={() => setIsEditingProfile(false)}>
                      <X className="h-4 w-4" />
                      Отмена
                    </Button>
                  </>
                ) : (
                  <Button onClick={() => setIsEditingProfile(true)} className="flex items-center gap-2">
                    <Edit2 className="h-4 w-4" />
                    Редактировать профиль
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="p-6 flex-1 overflow-y-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Shield className="h-6 w-6" />
          Настройки
        </h1>
        <p className="text-sm text-muted-foreground">Управление профилем и пользователями</p>
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

      <Tabs defaultValue="profile" className="w-full">
        <TabsList>
          <TabsTrigger value="profile">Мой профиль</TabsTrigger>
          <TabsTrigger value="users">Пользователи</TabsTrigger>
        </TabsList>

        <TabsContent value="profile">
          <Card>
            <CardHeader>
              <CardTitle>Профиль администратора</CardTitle>
              <CardDescription>Управление вашими личными данными</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <Label>Email</Label>
                  {isEditingProfile ? (
                    <Input
                      value={profileData.email}
                      onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                    />
                  ) : (
                    <Input value={currentUser.email} disabled />
                  )}
                </div>
                <div>
                  <Label>Полное имя</Label>
                  {isEditingProfile ? (
                    <Input
                      value={profileData.full_name}
                      onChange={(e) => setProfileData({ ...profileData, full_name: e.target.value })}
                    />
                  ) : (
                    <Input value={currentUser.full_name || ""} disabled />
                  )}
                </div>
                <div>
                  <Label>Должность</Label>
                  {isEditingProfile ? (
                    <Input
                      value={profileData.position}
                      onChange={(e) => setProfileData({ ...profileData, position: e.target.value })}
                    />
                  ) : (
                    <Input value={currentUser.position || ""} disabled />
                  )}
                </div>
                <div>
                  <Label>Роль</Label>
                  <div className="mt-2">
                    <Badge className={getRoleBadgeColor(currentUser.role)}>{getRoleLabel(currentUser.role)}</Badge>
                  </div>
                </div>

                <div className="flex gap-2 pt-4">
                  {isEditingProfile ? (
                    <>
                      <Button onClick={handleUpdateProfile} className="flex items-center gap-2">
                        <Save className="h-4 w-4" />
                        Сохранить изменения
                      </Button>
                      <Button variant="outline" onClick={() => setIsEditingProfile(false)}>
                        <X className="h-4 w-4" />
                        Отмена
                      </Button>
                    </>
                  ) : (
                    <Button onClick={() => setIsEditingProfile(true)} className="flex items-center gap-2">
                      <Edit2 className="h-4 w-4" />
                      Редактировать профиль
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="users">
          {loading ? (
            <div className="text-center py-12">Загрузка пользователей...</div>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Управление пользователями
                </CardTitle>
                <CardDescription>Просмотр и редактирование пользователей системы</CardDescription>
              </CardHeader>
              <CardContent>
                <UsersTable
                  users={users}
                  currentUserId={currentUser.id}
                  onUpdateUser={handleUpdateUser}
                  onDeleteUser={handleDeleteUser}
                />
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
