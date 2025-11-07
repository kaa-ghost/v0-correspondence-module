"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { StatusHistory } from "@/components/status-history"
import {
  Calendar,
  User,
  Clock,
  AlertCircle,
  CheckCircle2,
  FileText,
  Paperclip,
  Video,
  GitBranch,
  RotateCcw,
  X,
  Edit,
  Send,
} from "lucide-react"
import { cn } from "@/lib/utils"

interface AssignmentDetailsProps {
  assignmentId: string
}

export function AssignmentDetails({ assignmentId }: AssignmentDetailsProps) {
  const [comment, setComment] = useState("")

  // Mock data
  const assignment = {
    id: assignmentId,
    number: "ПР-2024-001",
    title: "Подготовить отчет о финансовых результатах",
    description:
      "Необходимо подготовить квартальный отчет с анализом финансовых показателей за 4 квартал 2023 года. Отчет должен включать сравнительный анализ с предыдущими периодами и прогноз на следующий квартал.",
    status: "overdue",
    priority: "high",
    executor: "Иванов Иван Иванович",
    author: "Петров Петр Петрович",
    deadline: "2024-01-15",
    createdDate: "2024-01-10",
    hasChildren: true,
    attachments: [
      { name: "Шаблон_отчета.docx", size: "245 KB" },
      { name: "Данные_Q4_2023.xlsx", size: "1.2 MB" },
    ],
    children: [
      {
        id: "1-1",
        number: "ПР-2024-001-1",
        title: "Собрать данные по продажам",
        executor: "Сидорова А.А.",
        status: "completed",
        deadline: "2024-01-12",
      },
      {
        id: "1-2",
        number: "ПР-2024-001-2",
        title: "Провести анализ расходов",
        executor: "Козлов В.В.",
        status: "active",
        deadline: "2024-01-14",
      },
    ],
    history: [
      { date: "2024-01-10 10:30", user: "Петров П.П.", action: "Создано поручение" },
      { date: "2024-01-10 11:15", user: "Иванов И.И.", action: "Принято в работу" },
      { date: "2024-01-12 14:20", user: "Иванов И.И.", action: "Запрошено продление срока" },
    ],
  }

  const statusConfig = {
    active: { label: "На исполнении", color: "bg-blue-500/10 text-blue-500", icon: Clock },
    overdue: { label: "Просрочено", color: "bg-red-500/10 text-red-500", icon: AlertCircle },
    completed: { label: "Завершено", color: "bg-green-500/10 text-green-500", icon: CheckCircle2 },
  }

  const StatusIcon = statusConfig[assignment.status as keyof typeof statusConfig].icon

  return (
    <div className="w-[480px] border-l border-border bg-card flex flex-col">
      {/* Header */}
      <div className="border-b border-border px-6 py-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-sm font-mono text-muted-foreground">{assignment.number}</span>
              <Badge
                className={cn("text-xs gap-1", statusConfig[assignment.status as keyof typeof statusConfig].color)}
              >
                <StatusIcon className="h-3 w-3" />
                {statusConfig[assignment.status as keyof typeof statusConfig].label}
              </Badge>
            </div>
            <h2 className="text-lg font-semibold text-foreground leading-tight">{assignment.title}</h2>
          </div>
          <Button variant="ghost" size="icon" className="shrink-0">
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          <Button size="sm" className="flex-1 gap-2">
            <CheckCircle2 className="h-4 w-4" />
            Завершить
          </Button>
          <Button variant="outline" size="sm" className="gap-2 bg-transparent">
            <Edit className="h-4 w-4" />
            Изменить
          </Button>
          <Button variant="outline" size="sm" className="gap-2 bg-transparent">
            <Video className="h-4 w-4" />
            ВКС
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        <Tabs defaultValue="details" className="w-full">
          <TabsList className="w-full justify-start border-b rounded-none px-6">
            <TabsTrigger value="details">Детали</TabsTrigger>
            <TabsTrigger value="children">Дочерние ({assignment.children.length})</TabsTrigger>
            <TabsTrigger value="history">История статусов</TabsTrigger>
          </TabsList>

          <TabsContent value="details" className="px-6 py-4 space-y-6">
            {/* Description */}
            <div>
              <h3 className="text-sm font-medium text-foreground mb-2">Описание</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{assignment.description}</p>
            </div>

            {/* Info Grid */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-xs text-muted-foreground mb-1">Автор</div>
                <div className="flex items-center gap-2 text-sm text-foreground">
                  <User className="h-4 w-4" />
                  {assignment.author}
                </div>
              </div>
              <div>
                <div className="text-xs text-muted-foreground mb-1">Исполнитель</div>
                <div className="flex items-center gap-2 text-sm text-foreground">
                  <User className="h-4 w-4" />
                  {assignment.executor}
                </div>
              </div>
              <div>
                <div className="text-xs text-muted-foreground mb-1">Создано</div>
                <div className="flex items-center gap-2 text-sm text-foreground">
                  <Calendar className="h-4 w-4" />
                  {assignment.createdDate}
                </div>
              </div>
              <div>
                <div className="text-xs text-muted-foreground mb-1">Срок исполнения</div>
                <div className="flex items-center gap-2 text-sm text-red-500">
                  <Clock className="h-4 w-4" />
                  {assignment.deadline}
                </div>
              </div>
            </div>

            {/* Attachments */}
            <div>
              <h3 className="text-sm font-medium text-foreground mb-3">Вложения</h3>
              <div className="space-y-2">
                {assignment.attachments.map((file, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-3 p-3 rounded-lg border border-border bg-background hover:bg-accent/50 transition-colors"
                  >
                    <FileText className="h-5 w-5 text-muted-foreground" />
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium text-foreground truncate">{file.name}</div>
                      <div className="text-xs text-muted-foreground">{file.size}</div>
                    </div>
                    <Button variant="ghost" size="sm">
                      Открыть
                    </Button>
                  </div>
                ))}
              </div>
              <Button variant="outline" size="sm" className="w-full mt-3 gap-2 bg-transparent">
                <Paperclip className="h-4 w-4" />
                Прикрепить файл
              </Button>
            </div>

            {/* Comments */}
            <div>
              <h3 className="text-sm font-medium text-foreground mb-3">Комментарии</h3>
              <div className="space-y-3">
                <Textarea
                  placeholder="Добавить комментарий..."
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  className="min-h-[100px] bg-background"
                />
                <Button size="sm" className="gap-2">
                  <Send className="h-4 w-4" />
                  Отправить
                </Button>
              </div>
            </div>

            {/* Actions */}
            <div className="pt-4 border-t border-border space-y-2">
              <Button variant="outline" size="sm" className="w-full gap-2 justify-start bg-transparent">
                <Clock className="h-4 w-4" />
                Запросить изменение срока
              </Button>
              <Button variant="outline" size="sm" className="w-full gap-2 justify-start bg-transparent">
                <RotateCcw className="h-4 w-4" />
                Вернуть на доработку
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="w-full gap-2 justify-start text-red-500 hover:text-red-600 bg-transparent"
              >
                <X className="h-4 w-4" />
                Отменить поручение
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="children" className="px-6 py-4">
            <div className="space-y-3">
              {assignment.children.map((child) => (
                <div key={child.id} className="p-4 rounded-lg border border-border bg-background">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <div className="text-xs font-mono text-muted-foreground mb-1">{child.number}</div>
                      <h4 className="text-sm font-medium text-foreground">{child.title}</h4>
                    </div>
                    <Badge
                      className={cn(
                        "text-xs",
                        child.status === "completed"
                          ? "bg-green-500/10 text-green-500"
                          : "bg-blue-500/10 text-blue-500",
                      )}
                    >
                      {child.status === "completed" ? "Завершено" : "В работе"}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <User className="h-3 w-3" />
                      {child.executor}
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {child.deadline}
                    </div>
                  </div>
                </div>
              ))}
              <Button variant="outline" size="sm" className="w-full gap-2 bg-transparent">
                <GitBranch className="h-4 w-4" />
                Создать дочернее поручение
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="history" className="px-6 py-4">
            <StatusHistory entityType="assignment" entityId={Number.parseInt(assignmentId)} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
