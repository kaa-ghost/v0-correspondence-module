"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { api } from "@/lib/api"
import { Upload, X } from "lucide-react"

interface User {
  id: number
  email: string
  full_name: string
  position?: string
}

interface AddDocumentFormProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: () => void
}

export function AddDocumentForm({ open, onOpenChange, onSuccess }: AddDocumentFormProps) {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [formData, setFormData] = useState({
    source: "",
    doc_date: new Date().toISOString().split("T")[0],
    doc_time: new Date().toTimeString().slice(0, 5),
    number: "",
    sender_name: "",
    received_by_user_id: "",
    status: "new",
    title: "",
    description: "",
  })

  useEffect(() => {
    if (open) {
      loadUsers()
    }
  }, [open])

  const loadUsers = async () => {
    try {
      const token = localStorage.getItem("token")
      const response = await api.get("/users", token || undefined)
      setUsers(response)
    } catch (error) {
      console.error("Failed to load users:", error)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const token = localStorage.getItem("token")
      const formDataToSend = new FormData()
      formDataToSend.append("source", formData.source)
      formDataToSend.append("doc_date", new Date(formData.doc_date).toISOString())
      formDataToSend.append("doc_time", new Date(`2000-01-01T${formData.doc_time}`).toISOString())
      formDataToSend.append("number", formData.number)
      formDataToSend.append("sender_name", formData.sender_name)
      formDataToSend.append("received_by_user_id", formData.received_by_user_id)
      formDataToSend.append("status", formData.status)
      formDataToSend.append("title", formData.title || "")
      formDataToSend.append("description", formData.description || "")

      if (selectedFile) {
        formDataToSend.append("file", selectedFile)
      }

      await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"}/documents`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formDataToSend,
      })

      setFormData({
        source: "",
        doc_date: new Date().toISOString().split("T")[0],
        doc_time: new Date().toTimeString().slice(0, 5),
        number: "",
        sender_name: "",
        received_by_user_id: "",
        status: "new",
        title: "",
        description: "",
      })
      setSelectedFile(null)

      onSuccess()
      onOpenChange(false)
    } catch (error) {
      console.error("Failed to create document:", error)
      alert("Ошибка при создании документа")
    } finally {
      setLoading(false)
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0])
    }
  }

  const handleRemoveFile = () => {
    setSelectedFile(null)
    const fileInput = document.getElementById("file-upload") as HTMLInputElement
    if (fileInput) {
      fileInput.value = ""
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Добавить входящую корреспонденцию</DialogTitle>
          <DialogDescription>Заполните все обязательные поля для регистрации документа</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="source">
                Источник <span className="text-destructive">*</span>
              </Label>
              <Input
                id="source"
                required
                value={formData.source}
                onChange={(e) => setFormData({ ...formData, source: e.target.value })}
                placeholder="Например: Почта России, Email, Курьер"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="number">
                Номер документа <span className="text-destructive">*</span>
              </Label>
              <Input
                id="number"
                required
                value={formData.number}
                onChange={(e) => setFormData({ ...formData, number: e.target.value })}
                placeholder="ВХ-2025-001"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="doc_date">
                Дата <span className="text-destructive">*</span>
              </Label>
              <Input
                id="doc_date"
                type="date"
                required
                value={formData.doc_date}
                onChange={(e) => setFormData({ ...formData, doc_date: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="doc_time">
                Время <span className="text-destructive">*</span>
              </Label>
              <Input
                id="doc_time"
                type="time"
                required
                value={formData.doc_time}
                onChange={(e) => setFormData({ ...formData, doc_time: e.target.value })}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="sender_name">
              ФИО отправителя <span className="text-destructive">*</span>
            </Label>
            <Input
              id="sender_name"
              required
              value={formData.sender_name}
              onChange={(e) => setFormData({ ...formData, sender_name: e.target.value })}
              placeholder="Иванов Иван Иванович"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="received_by">
              Кто принял <span className="text-destructive">*</span>
            </Label>
            <Select
              value={formData.received_by_user_id}
              onValueChange={(value) => setFormData({ ...formData, received_by_user_id: value })}
              required
            >
              <SelectTrigger id="received_by">
                <SelectValue placeholder="Выберите пользователя" />
              </SelectTrigger>
              <SelectContent>
                {users.map((user) => (
                  <SelectItem key={user.id} value={user.id.toString()}>
                    {user.full_name || user.email} {user.position && `- ${user.position}`}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="status">
              Статус <span className="text-destructive">*</span>
            </Label>
            <Select
              value={formData.status}
              onValueChange={(value) => setFormData({ ...formData, status: value })}
              required
            >
              <SelectTrigger id="status">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="new">Новое</SelectItem>
                <SelectItem value="in-progress">В работе</SelectItem>
                <SelectItem value="processed">Обработано</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="title">Тема документа</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="Краткая тема документа"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Описание</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Подробное описание документа"
              rows={4}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="file-upload">Прикрепить файл</Label>
            <div className="flex items-center gap-2">
              {!selectedFile ? (
                <div className="flex-1">
                  <Input
                    id="file-upload"
                    type="file"
                    onChange={handleFileChange}
                    accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.txt,.xls,.xlsx"
                    className="cursor-pointer"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Поддерживаемые форматы: PDF, DOC, DOCX, JPG, PNG, TXT, XLS, XLSX (макс. 10 МБ)
                  </p>
                </div>
              ) : (
                <div className="flex-1 flex items-center justify-between p-3 border rounded-md bg-muted">
                  <div className="flex items-center gap-2">
                    <Upload className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">{selectedFile.name}</p>
                      <p className="text-xs text-muted-foreground">{(selectedFile.size / 1024 / 1024).toFixed(2)} МБ</p>
                    </div>
                  </div>
                  <Button type="button" variant="ghost" size="icon" onClick={handleRemoveFile} className="h-8 w-8">
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Отмена
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Сохранение..." : "Сохранить"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
