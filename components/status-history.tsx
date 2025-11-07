"use client"

import { useEffect, useState } from "react"
import { format } from "date-fns"
import { ru } from "date-fns/locale"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Clock, User, FileText, AlertCircle } from "lucide-react"
import { api } from "@/lib/api"

interface StatusHistoryItem {
  id: number
  entity_type: string
  entity_id: number
  old_status: string | null
  new_status: string
  changed_by_user_id: number
  changed_by_name: string
  changed_by_email: string
  changed_at: string
  comment: string | null
  entity_version: number
}

interface StatusHistoryProps {
  entityType: "document" | "assignment"
  entityId: number
}

const statusLabels: Record<string, string> = {
  new: "Новое",
  "in-progress": "В работе",
  processed: "Обработано",
  draft: "Черновик",
  active: "Активно",
  in_progress: "В процессе",
  completed: "Завершено",
  overdue: "Просрочено",
  cancelled: "Отменено",
}

const statusColors: Record<string, string> = {
  new: "bg-blue-500/10 text-blue-500",
  "in-progress": "bg-yellow-500/10 text-yellow-500",
  processed: "bg-green-500/10 text-green-500",
  draft: "bg-gray-500/10 text-gray-500",
  active: "bg-blue-500/10 text-blue-500",
  in_progress: "bg-yellow-500/10 text-yellow-500",
  completed: "bg-green-500/10 text-green-500",
  overdue: "bg-red-500/10 text-red-500",
  cancelled: "bg-gray-500/10 text-gray-500",
}

export function StatusHistory({ entityType, entityId }: StatusHistoryProps) {
  const [history, setHistory] = useState<StatusHistoryItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadHistory()
  }, [entityType, entityId])

  const loadHistory = async () => {
    try {
      setLoading(true)
      setError(null)

      const token = localStorage.getItem("token")
      if (!token) {
        throw new Error("Not authenticated")
      }

      const endpoint = entityType === "document" ? `/documents/${entityId}/history` : `/assignments/${entityId}/history`

      const data = await api.get(endpoint, token)
      setHistory(data)
    } catch (err) {
      console.error("Failed to load history:", err)
      setError("Не удалось загрузить историю изменений")

      // Demo data fallback
      setHistory([
        {
          id: 1,
          entity_type: entityType,
          entity_id: entityId,
          old_status: null,
          new_status: entityType === "document" ? "new" : "active",
          changed_by_user_id: 1,
          changed_by_name: "Администратор",
          changed_by_email: "admin@test.com",
          changed_at: new Date().toISOString(),
          comment: entityType === "document" ? "Документ создан" : "Поручение создано",
          entity_version: 1,
        },
      ])
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-sm text-muted-foreground">Загрузка истории...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center gap-2 p-4 text-sm text-muted-foreground">
        <AlertCircle className="h-4 w-4" />
        {error}
      </div>
    )
  }

  if (history.length === 0) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-sm text-muted-foreground">История изменений пуста</div>
      </div>
    )
  }

  return (
    <ScrollArea className="h-[400px]">
      <div className="space-y-4 p-1">
        {history.map((item, index) => (
          <Card key={item.id} className="p-4 bg-background border-border">
            <div className="flex gap-3">
              <div className="flex flex-col items-center">
                <div className="p-2 bg-primary/10 rounded-full">
                  {entityType === "document" ? (
                    <FileText className="h-4 w-4 text-primary" />
                  ) : (
                    <Clock className="h-4 w-4 text-primary" />
                  )}
                </div>
                {index < history.length - 1 && <div className="w-px h-full bg-border mt-2 flex-1" />}
              </div>

              <div className="flex-1 space-y-2">
                <div className="flex items-center gap-2 flex-wrap">
                  {item.old_status && (
                    <>
                      <Badge className={statusColors[item.old_status] || "bg-gray-500/10 text-gray-500"}>
                        {statusLabels[item.old_status] || item.old_status}
                      </Badge>
                      <span className="text-muted-foreground">→</span>
                    </>
                  )}
                  <Badge className={statusColors[item.new_status] || "bg-gray-500/10 text-gray-500"}>
                    {statusLabels[item.new_status] || item.new_status}
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    v{item.entity_version}
                  </Badge>
                </div>

                {item.comment && <p className="text-sm text-foreground">{item.comment}</p>}

                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <User className="h-3 w-3" />
                    <span>{item.changed_by_name}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    <span>{format(new Date(item.changed_at), "dd MMMM yyyy, HH:mm", { locale: ru })}</span>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </ScrollArea>
  )
}
