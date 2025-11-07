"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { CheckCircle2, XCircle, Edit2, Save, X, Trash2, Search } from "lucide-react"

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

interface UsersTableProps {
  users: User[]
  currentUserId: number
  onUpdateUser: (userId: number, updates: Partial<User>) => Promise<void>
  onDeleteUser: (userId: number) => Promise<void>
}

export function UsersTable({ users, currentUserId, onUpdateUser, onDeleteUser }: UsersTableProps) {
  const [editingId, setEditingId] = useState<number | null>(null)
  const [editData, setEditData] = useState<Partial<User>>({})
  const [searchQuery, setSearchQuery] = useState("")

  const filteredUsers = users.filter((user) => {
    if (!searchQuery) return true
    const query = searchQuery.toLowerCase()
    return (
      user.email.toLowerCase().includes(query) ||
      user.full_name?.toLowerCase().includes(query) ||
      user.position?.toLowerCase().includes(query) ||
      user.role.toLowerCase().includes(query)
    )
  })

  const handleEdit = (user: User) => {
    setEditingId(user.id)
    setEditData({
      full_name: user.full_name,
      position: user.position,
      role: user.role,
    })
  }

  const handleSave = async (userId: number) => {
    await onUpdateUser(userId, editData)
    setEditingId(null)
    setEditData({})
  }

  const handleCancel = () => {
    setEditingId(null)
    setEditData({})
  }

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case "admin":
        return "bg-red-500 text-white hover:bg-red-600"
      case "user":
        return "bg-blue-500 text-white hover:bg-blue-600"
      case "viewer":
        return "bg-gray-500 text-white hover:bg-gray-600"
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

  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Поиск по имени, email, должности или роли..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-9"
        />
      </div>

      <div className="border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Имя пользователя</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Должность</TableHead>
              <TableHead>Роль</TableHead>
              <TableHead>Статус</TableHead>
              <TableHead className="text-right">Действия</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredUsers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                  Пользователи не найдены
                </TableCell>
              </TableRow>
            ) : (
              filteredUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>
                    {editingId === user.id ? (
                      <Input
                        value={editData.full_name || ""}
                        onChange={(e) => setEditData({ ...editData, full_name: e.target.value })}
                        placeholder="Имя пользователя"
                        className="h-8"
                      />
                    ) : (
                      <div>
                        <div className="font-medium">{user.full_name || "—"}</div>
                        {user.id === currentUserId && (
                          <Badge variant="outline" className="text-xs mt-1">
                            Вы
                          </Badge>
                        )}
                      </div>
                    )}
                  </TableCell>
                  <TableCell>
                    <span className="text-sm text-muted-foreground">{user.email}</span>
                  </TableCell>
                  <TableCell>
                    {editingId === user.id ? (
                      <Input
                        value={editData.position || ""}
                        onChange={(e) => setEditData({ ...editData, position: e.target.value })}
                        placeholder="Должность"
                        className="h-8"
                      />
                    ) : (
                      <span>{user.position || "—"}</span>
                    )}
                  </TableCell>
                  <TableCell>
                    {editingId === user.id ? (
                      <select
                        value={editData.role || user.role}
                        onChange={(e) => setEditData({ ...editData, role: e.target.value as any })}
                        className="border rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                        disabled={user.id === currentUserId}
                      >
                        <option value="user">Пользователь</option>
                        <option value="admin">Администратор</option>
                        <option value="viewer">Наблюдатель</option>
                      </select>
                    ) : (
                      <Badge className={getRoleBadgeColor(user.role)}>{getRoleLabel(user.role)}</Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    {user.is_active ? (
                      <div className="flex items-center gap-2 text-green-600">
                        <CheckCircle2 className="h-4 w-4" />
                        <span className="text-sm">Активен</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 text-red-600">
                        <XCircle className="h-4 w-4" />
                        <span className="text-sm">Неактивен</span>
                      </div>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    {editingId === user.id ? (
                      <div className="flex items-center justify-end gap-2">
                        <Button size="sm" onClick={() => handleSave(user.id)} className="h-8">
                          <Save className="h-3 w-3 mr-1" />
                          Сохранить
                        </Button>
                        <Button size="sm" variant="outline" onClick={handleCancel} className="h-8 bg-transparent">
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    ) : (
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleEdit(user)}
                          disabled={user.id === currentUserId}
                          className="h-8"
                        >
                          <Edit2 className="h-3 w-3 mr-1" />
                          Изменить
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => onDeleteUser(user.id)}
                          disabled={user.id === currentUserId}
                          className="h-8"
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    )}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <div className="text-sm text-muted-foreground">Всего пользователей: {filteredUsers.length}</div>
    </div>
  )
}
