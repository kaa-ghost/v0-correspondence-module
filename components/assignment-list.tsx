"use client"

import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar, User, Clock, AlertCircle, CheckCircle2, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"

interface Assignment {
  id: string
  number: string
  title: string
  description: string
  status: "active" | "overdue" | "completed" | "pending"
  priority: "high" | "medium" | "low"
  executor: string
  deadline: string
  createdDate: string
  hasChildren: boolean
  parentId?: string
}

const mockAssignments: Assignment[] = [
  {
    id: "1",
    number: "ПР-2024-001",
    title: "Подготовить отчет о финансовых результатах",
    description: "Необходимо подготовить квартальный отчет с анализом показателей",
    status: "overdue",
    priority: "high",
    executor: "Иванов И.И.",
    deadline: "2024-01-15",
    createdDate: "2024-01-10",
    hasChildren: true,
  },
  {
    id: "2",
    number: "ПР-2024-002",
    title: "Организовать совещание с отделом продаж",
    description: "Провести встречу для обсуждения новой стратегии",
    status: "active",
    priority: "medium",
    executor: "Петрова А.С.",
    deadline: "2024-01-20",
    createdDate: "2024-01-12",
    hasChildren: false,
  },
  {
    id: "3",
    number: "ПР-2024-003",
    title: "Проверить договоры с поставщиками",
    description: "Провести аудит действующих договоров",
    status: "active",
    priority: "low",
    executor: "Сидоров П.П.",
    deadline: "2024-01-25",
    createdDate: "2024-01-13",
    hasChildren: true,
  },
  {
    id: "4",
    number: "ПР-2024-004",
    title: "Обновить регламент документооборота",
    description: "Внести изменения в соответствии с новыми требованиями",
    status: "completed",
    priority: "medium",
    executor: "Козлова М.В.",
    deadline: "2024-01-10",
    createdDate: "2024-01-05",
    hasChildren: false,
  },
]

const statusConfig = {
  active: { label: "На исполнении", color: "bg-blue-500/10 text-blue-500", icon: Clock },
  overdue: { label: "Просрочено", color: "bg-red-500/10 text-red-500", icon: AlertCircle },
  completed: { label: "Завершено", color: "bg-green-500/10 text-green-500", icon: CheckCircle2 },
  pending: { label: "Ожидает", color: "bg-yellow-500/10 text-yellow-500", icon: Clock },
}

const priorityConfig = {
  high: { label: "Высокий", color: "bg-red-500/10 text-red-500" },
  medium: { label: "Средний", color: "bg-yellow-500/10 text-yellow-500" },
  low: { label: "Низкий", color: "bg-green-500/10 text-green-500" },
}

interface AssignmentListProps {
  onSelectAssignment: (id: string) => void
}

export function AssignmentList({ onSelectAssignment }: AssignmentListProps) {
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [sortBy, setSortBy] = useState("deadline")

  const handleSelect = (id: string) => {
    setSelectedId(id)
    onSelectAssignment(id)
  }

  return (
    <div className="flex-1 flex flex-col border-r border-border bg-card">
      {/* Header */}
      <div className="border-b border-border px-6 py-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-foreground">Мои поручения</h2>
          <span className="text-sm text-muted-foreground">{mockAssignments.length} поручений</span>
        </div>

        {/* Filters */}
        <div className="flex gap-2">
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-[180px] bg-background">
              <SelectValue placeholder="Сортировка" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="deadline">По сроку</SelectItem>
              <SelectItem value="priority">По приоритету</SelectItem>
              <SelectItem value="status">По статусу</SelectItem>
              <SelectItem value="created">По дате создания</SelectItem>
            </SelectContent>
          </Select>

          <Select defaultValue="all">
            <SelectTrigger className="w-[180px] bg-background">
              <SelectValue placeholder="Статус" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Все статусы</SelectItem>
              <SelectItem value="active">На исполнении</SelectItem>
              <SelectItem value="overdue">Просроченные</SelectItem>
              <SelectItem value="completed">Завершенные</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Assignment List */}
      <div className="flex-1 overflow-y-auto">
        {mockAssignments.map((assignment) => {
          const StatusIcon = statusConfig[assignment.status].icon
          return (
            <button
              key={assignment.id}
              onClick={() => handleSelect(assignment.id)}
              className={cn(
                "w-full text-left px-6 py-4 border-b border-border hover:bg-accent/50 transition-colors",
                selectedId === assignment.id && "bg-accent",
              )}
            >
              <div className="flex items-start justify-between gap-3 mb-2">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-mono text-muted-foreground">{assignment.number}</span>
                    {assignment.hasChildren && (
                      <Badge variant="outline" className="text-xs px-1.5 py-0">
                        <ChevronRight className="h-3 w-3" />
                      </Badge>
                    )}
                  </div>
                  <h3 className="font-medium text-foreground mb-1 line-clamp-1">{assignment.title}</h3>
                  <p className="text-sm text-muted-foreground line-clamp-2">{assignment.description}</p>
                </div>
                <Badge className={cn("text-xs whitespace-nowrap", priorityConfig[assignment.priority].color)}>
                  {priorityConfig[assignment.priority].label}
                </Badge>
              </div>

              <div className="flex items-center gap-4 text-xs text-muted-foreground mt-3">
                <div className="flex items-center gap-1.5">
                  <User className="h-3.5 w-3.5" />
                  <span>{assignment.executor}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Calendar className="h-3.5 w-3.5" />
                  <span>{assignment.deadline}</span>
                </div>
                <Badge className={cn("text-xs gap-1", statusConfig[assignment.status].color)}>
                  <StatusIcon className="h-3 w-3" />
                  {statusConfig[assignment.status].label}
                </Badge>
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}
