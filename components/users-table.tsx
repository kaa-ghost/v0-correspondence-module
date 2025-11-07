"use client"

import { useState, useEffect } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { api } from "@/lib/api"

type User = {
  id: number
  email: string
  full_name: string
  position: string
  role: "admin" | "user"
  is_active: boolean
}

export function UsersTable() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [editingId, setEditingId] = useState<number | null>(null)
  const [searchTerm, setSearchTerm] = useState("")

  useEffect(() => {
    loadUsers()
  }, [])

  const loadUsers = async () => {
    try {
      setLoading(true)
      const token = localStorage.getItem("token")
      const data = await api.get("/users", token || undefined)
      setUsers(data)
      setError("")
    } catch (err: any) {
      setError(err.message || "Не удалось загрузить пользователей")
    } finally {
      setLoading(false)
    }
  }

  const handleUpdate = async (userId: number, field: string, value: any) => {
    try {
      const token = localStorage.getItem("token")
      const user = users.find((u) => u.id === userId)
      if (!user) return

      const updated = await api.put(`/users/${userId}`, { ...user, [field]: value }, token || undefined)

      setUsers(users.map((u) => (u.id === userId ? updated : u)))
      setEditingId(null)
    } catch (err: any) {
      setError(err.message || "Не удалось обновить пользователя")
    }
  }

  const filteredUsers = users.filter(
    (user) =>
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.position.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const getRoleBadgeVariant = (role: string) => {
    return role === "admin" ? "default" : "secondary"
  }

  const getRoleLabel = (role: string) => {
    return role === "admin" ? "Администратор" : "Пользователь"
  }

  if (loading) {
    return <div className="text-center py-8">Загрузка...</div>
  }

  return (
    <div className="space-y-4">
      <Input
        placeholder="Поиск по имени, email или должности..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="max-w-md"
      />

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Имя</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Должность</TableHead>
              <TableHead>Роль</TableHead>
              <TableHead>Статус</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredUsers.map((user) => (
              <TableRow key={user.id}>
                <TableCell>
                  {editingId === user.id ? (
                    <Input
                      defaultValue={user.full_name}
                      onBlur={(e) => handleUpdate(user.id, "full_name", e.target.value)}
                      autoFocus
                    />
                  ) : (
                    <button onClick={() => setEditingId(user.id)} className="text-left hover:underline">
                      {user.full_name}
                    </button>
                  )}
                </TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>
                  {editingId === user.id ? (
                    <Input
                      defaultValue={user.position}
                      onBlur={(e) => handleUpdate(user.id, "position", e.target.value)}
                    />
                  ) : (
                    <button onClick={() => setEditingId(user.id)} className="text-left hover:underline">
                      {user.position || "—"}
                    </button>
                  )}
                </TableCell>
                <TableCell>
                  <Select value={user.role} onValueChange={(value) => handleUpdate(user.id, "role", value)}>
                    <SelectTrigger className="w-[150px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="admin">Администратор</SelectItem>
                      <SelectItem value="user">Пользователь</SelectItem>
                    </SelectContent>
                  </Select>
                </TableCell>
                <TableCell>
                  <Badge variant={user.is_active ? "default" : "secondary"}>
                    {user.is_active ? "Активен" : "Неактивен"}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
