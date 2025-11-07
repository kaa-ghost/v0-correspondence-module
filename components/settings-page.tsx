"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Users, Shield, Trash2, CheckCircle2, XCircle, AlertCircle, Search, Edit2, Save, X } from "lucide-react"
import { api } from "@/lib/api"

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
  const [filteredUsers, setFilteredUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [editingUser, setEditingUser] = useState<User | null>(null)
  const [searchQuery, setSearchQuery] = useState("")

  const [isEditingProfile, setIsEditingProfile] = useState(false)
  const [profileData, setProfileData] = useState({
    full_name: currentUser.full_name || "",
    email: currentUser.email,
  })

  useEffect(() => {
    if (currentUser.role === "admin") {
      loadUsers()
    } else {
      setLoading(false)
    }
  }, [currentUser.role])

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredUsers(users)
    } else {
      const query = searchQuery.toLowerCase()
      setFilteredUsers(
        users.filter(
          (user) =>
            user.email.toLowerCase().includes(query) ||
            user.full_name?.toLowerCase().includes(query) ||
            user.role.toLowerCase().includes(query),
        ),
      )
    }
  }, [searchQuery, users])

  const loadUsers = async () => {
    try {
      setLoading(true)
      const response = await api.get("/users/")
      setUsers(response.data)
      setFilteredUsers(response.data)
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
      setSuccess("Пользователь успешно обновлен")
      setEditingUser(null)
      loadUsers()
      setTimeout(() => setSuccess(null), 3000)
    } catch (err: any) {
      setError(err.response?.data?.detail || "Не удалось обновить пользователя")
    }
  }

  const handleDeleteUser = async (userId: number) => {
    if (!confirm("Вы уверены, что хотите удалить этого пользователя?")) return

    try {
      await api.delete(`/users/${userId}`)
      setSuccess("Пользователь успешно удален")
      loadUsers()
      setTimeout(() => setSuccess(null), 3000)
    } catch (err: any) {
      setError(err.response?.data?.detail || "Не удалось удалить пользователя")
    }
  }

  const handleUpdateProfile = async () => {
    try {
      await api.put(`/users/${currentUser.id}`, profileData)
      setSuccess("Профиль успешно обновлен")
      setIsEditingProfile(false)
      setTimeout(() => setSuccess(null), 3000)
    } catch (err: any) {
      setError(err.response?.data?.detail || "Не удалось обновить профиль")
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
          <TabsTrigger value="users">Управление пользователями</TabsTrigger>
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
                  Пользователи системы ({filteredUsers.length})
                </CardTitle>
                <CardDescription>Управление ролями и правами доступа</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="mb-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Поиск по email, имени или роли..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-9"
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  {filteredUsers.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">Пользователи не найдены</div>
                  ) : (
                    filteredUsers.map((user) => (
                      <div
                        key={user.id}
                        className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                      >
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <span className="font-medium">{user.full_name || user.email}</span>
                            <Badge className={getRoleBadgeColor(user.role)}>{getRoleLabel(user.role)}</Badge>
                            {user.is_active ? (
                              <CheckCircle2 className="h-4 w-4 text-green-500" title="Активен" />
                            ) : (
                              <XCircle className="h-4 w-4 text-red-500" title="Деактивирован" />
                            )}
                            {user.id === currentUser.id && (
                              <Badge variant="outline" className="text-xs">
                                Вы
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground">{user.email}</p>
                          <div className="flex items-center gap-4 mt-1">
                            <p className="text-xs text-muted-foreground">
                              Создан: {new Date(user.created_at).toLocaleDateString("ru-RU")}
                            </p>
                            {user.last_login && (
                              <p className="text-xs text-muted-foreground">
                                Последний вход: {new Date(user.last_login).toLocaleString("ru-RU")}
                              </p>
                            )}
                          </div>
                        </div>

                        {editingUser?.id === user.id ? (
                          <div className="flex items-center gap-2">
                            <select
                              value={editingUser.role}
                              onChange={(e) => setEditingUser({ ...editingUser, role: e.target.value as any })}
                              className="border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                            >
                              <option value="user">Пользователь</option>
                              <option value="admin">Администратор</option>
                              <option value="viewer">Наблюдатель</option>
                            </select>
                            <Button
                              size="sm"
                              onClick={() => handleUpdateUser(user.id, { role: editingUser.role })}
                              className="flex items-center gap-1"
                            >
                              <Save className="h-3 w-3" />
                              Сохранить
                            </Button>
                            <Button size="sm" variant="outline" onClick={() => setEditingUser(null)}>
                              <X className="h-3 w-3" />
                            </Button>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => setEditingUser(user)}
                              disabled={user.id === currentUser.id}
                              className="flex items-center gap-1"
                            >
                              <Edit2 className="h-3 w-3" />
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
                              title="Удалить пользователя"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        )}
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
