"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { MoreVertical, FileText, Calendar, User, ArrowUpDown } from "lucide-react"
import { cn } from "@/lib/utils"

interface Document {
  id: string
  number: string
  date: string
  sender: string
  subject: string
  status: "new" | "in-progress" | "completed" | "archived"
  priority: "high" | "medium" | "low"
}

const mockDocuments: Document[] = [
  {
    id: "1",
    number: "ВХ-2025-001",
    date: "2025-11-06",
    sender: 'ООО "Компания А"',
    subject: "Запрос на предоставление информации о продукции",
    status: "new",
    priority: "high",
  },
  {
    id: "2",
    number: "ВХ-2025-002",
    date: "2025-11-05",
    sender: "Министерство финансов",
    subject: "Уведомление о проведении проверки",
    status: "in-progress",
    priority: "high",
  },
  {
    id: "3",
    number: "ВХ-2025-003",
    date: "2025-11-04",
    sender: 'ЗАО "Партнер"',
    subject: "Договор на поставку оборудования",
    status: "in-progress",
    priority: "medium",
  },
  {
    id: "4",
    number: "ВХ-2025-004",
    date: "2025-11-03",
    sender: "ИП Иванов И.И.",
    subject: "Заявка на участие в тендере",
    status: "completed",
    priority: "low",
  },
]

const statusLabels = {
  new: "Новый",
  "in-progress": "В работе",
  completed: "Завершен",
  archived: "Архив",
}

const priorityColors = {
  high: "bg-destructive text-destructive-foreground",
  medium: "bg-accent text-accent-foreground",
  low: "bg-muted text-muted-foreground",
}

interface DocumentListProps {
  onSelectDocument: (id: string) => void
}

export function DocumentList({ onSelectDocument }: DocumentListProps) {
  const [selectedId, setSelectedId] = useState<string | null>(null)

  const handleSelect = (id: string) => {
    setSelectedId(id)
    onSelectDocument(id)
  }

  return (
    <div className="flex-1 border-r border-border overflow-hidden flex flex-col">
      {/* List Header */}
      <div className="border-b border-border bg-card px-6 py-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-card-foreground">Входящие документы</h2>
          <Button variant="ghost" size="sm" className="gap-2 text-muted-foreground">
            <ArrowUpDown className="h-4 w-4" />
            Сортировка
          </Button>
        </div>

        <div className="flex gap-2">
          <Badge variant="secondary" className="cursor-pointer">
            Все
          </Badge>
          <Badge variant="outline" className="cursor-pointer">
            Новые
          </Badge>
          <Badge variant="outline" className="cursor-pointer">
            В работе
          </Badge>
          <Badge variant="outline" className="cursor-pointer">
            Завершенные
          </Badge>
        </div>
      </div>

      {/* Document List */}
      <div className="flex-1 overflow-y-auto">
        {mockDocuments.map((doc) => (
          <div
            key={doc.id}
            onClick={() => handleSelect(doc.id)}
            className={cn(
              "border-b border-border px-6 py-4 cursor-pointer transition-colors hover:bg-accent/50",
              selectedId === doc.id && "bg-accent/30",
            )}
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-2">
                  <FileText className="h-4 w-4 text-primary flex-shrink-0" />
                  <span className="font-medium text-sm text-foreground">{doc.number}</span>
                  <Badge variant="secondary" className={cn("text-xs", priorityColors[doc.priority])}>
                    {statusLabels[doc.status]}
                  </Badge>
                </div>

                <h3 className="font-medium text-foreground mb-2 line-clamp-2">{doc.subject}</h3>

                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <User className="h-3 w-3" />
                    <span>{doc.sender}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    <span>{new Date(doc.date).toLocaleDateString("ru-RU")}</span>
                  </div>
                </div>
              </div>

              <Button variant="ghost" size="icon" className="flex-shrink-0">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
