"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar, User, Clock, AlertCircle, CheckCircle2, ChevronDown, ChevronRight, Plus } from "lucide-react"
import { cn } from "@/lib/utils"
import { useState } from "react"

interface AssignmentNode {
  id: string
  number: string
  title: string
  status: "active" | "overdue" | "completed" | "pending"
  priority: "high" | "medium" | "low"
  executor: string
  deadline: string
  children?: AssignmentNode[]
}

const mockTreeData: AssignmentNode[] = [
  {
    id: "1",
    number: "ПР-2024-001",
    title: "Подготовить отчет о финансовых результатах",
    status: "overdue",
    priority: "high",
    executor: "Иванов И.И.",
    deadline: "2024-01-15",
    children: [
      {
        id: "1-1",
        number: "ПР-2024-001-1",
        title: "Собрать данные по продажам",
        status: "completed",
        priority: "high",
        executor: "Сидорова А.А.",
        deadline: "2024-01-12",
      },
      {
        id: "1-2",
        number: "ПР-2024-001-2",
        title: "Провести анализ расходов",
        status: "active",
        priority: "medium",
        executor: "Козлов В.В.",
        deadline: "2024-01-14",
        children: [
          {
            id: "1-2-1",
            number: "ПР-2024-001-2-1",
            title: "Запросить данные из бухгалтерии",
            status: "completed",
            priority: "medium",
            executor: "Морозова Е.П.",
            deadline: "2024-01-13",
          },
        ],
      },
      {
        id: "1-3",
        number: "ПР-2024-001-3",
        title: "Подготовить презентацию",
        status: "pending",
        priority: "medium",
        executor: "Новиков С.С.",
        deadline: "2024-01-15",
      },
    ],
  },
  {
    id: "2",
    number: "ПР-2024-003",
    title: "Проверить договоры с поставщиками",
    status: "active",
    priority: "low",
    executor: "Сидоров П.П.",
    deadline: "2024-01-25",
    children: [
      {
        id: "2-1",
        number: "ПР-2024-003-1",
        title: "Проверить договор с ООО Поставщик-1",
        status: "active",
        priority: "low",
        executor: "Волкова Т.И.",
        deadline: "2024-01-20",
      },
      {
        id: "2-2",
        number: "ПР-2024-003-2",
        title: "Проверить договор с ООО Поставщик-2",
        status: "active",
        priority: "low",
        executor: "Зайцев М.Р.",
        deadline: "2024-01-22",
      },
    ],
  },
]

const statusConfig = {
  active: { label: "На исполнении", color: "bg-blue-500/10 text-blue-500 border-blue-500/20", icon: Clock },
  overdue: { label: "Просрочено", color: "bg-red-500/10 text-red-500 border-red-500/20", icon: AlertCircle },
  completed: { label: "Завершено", color: "bg-green-500/10 text-green-500 border-green-500/20", icon: CheckCircle2 },
  pending: { label: "Ожидает", color: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20", icon: Clock },
}

const priorityConfig = {
  high: { label: "Высокий", color: "bg-red-500/10 text-red-500" },
  medium: { label: "Средний", color: "bg-yellow-500/10 text-yellow-500" },
  low: { label: "Низкий", color: "bg-green-500/10 text-green-500" },
}

interface TreeNodeProps {
  node: AssignmentNode
  level: number
  isLast: boolean
  parentLines: boolean[]
  onSelect: (id: string) => void
}

function TreeNode({ node, level, isLast, parentLines, onSelect }: TreeNodeProps) {
  const [isExpanded, setIsExpanded] = useState(true)
  const hasChildren = node.children && node.children.length > 0
  const StatusIcon = statusConfig[node.status].icon

  return (
    <div>
      <div
        className={cn(
          "group relative flex items-start gap-3 px-4 py-3 hover:bg-accent/50 transition-colors cursor-pointer",
          level === 0 && "border-l-2 border-primary",
        )}
        onClick={() => onSelect(node.id)}
      >
        {/* Tree Lines */}
        <div className="flex items-center gap-1 shrink-0" style={{ width: `${level * 24}px` }}>
          {parentLines.map((showLine, index) => (
            <div key={index} className="w-6 h-full relative">
              {showLine && <div className="absolute left-3 top-0 bottom-0 w-px bg-border" />}
            </div>
          ))}
          {level > 0 && (
            <>
              <div
                className="absolute left-3 top-0 h-1/2 w-px bg-border"
                style={{ left: `${(level - 1) * 24 + 12}px` }}
              />
              <div
                className="absolute top-1/2 h-px bg-border"
                style={{ left: `${(level - 1) * 24 + 12}px`, width: "12px" }}
              />
            </>
          )}
        </div>

        {/* Expand/Collapse Button */}
        <button
          onClick={(e) => {
            e.stopPropagation()
            setIsExpanded(!isExpanded)
          }}
          className="shrink-0 w-5 h-5 flex items-center justify-center rounded hover:bg-accent transition-colors"
        >
          {hasChildren ? (
            isExpanded ? (
              <ChevronDown className="h-4 w-4 text-muted-foreground" />
            ) : (
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
            )
          ) : (
            <div className="w-1.5 h-1.5 rounded-full bg-muted-foreground/30" />
          )}
        </button>

        {/* Assignment Card */}
        <div
          className={cn(
            "flex-1 min-w-0 p-3 rounded-lg border transition-all",
            level === 0
              ? "bg-card border-primary/30 shadow-sm"
              : "bg-background border-border group-hover:border-primary/30",
          )}
        >
          <div className="flex items-start justify-between gap-3 mb-2">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span
                  className={cn(
                    "text-xs font-mono",
                    level === 0 ? "text-primary font-semibold" : "text-muted-foreground",
                  )}
                >
                  {node.number}
                </span>
                <Badge className={cn("text-xs", priorityConfig[node.priority].color)}>
                  {priorityConfig[node.priority].label}
                </Badge>
              </div>
              <h3 className={cn("text-sm font-medium text-foreground line-clamp-2", level === 0 && "text-base")}>
                {node.title}
              </h3>
            </div>
            <Badge className={cn("text-xs gap-1 shrink-0", statusConfig[node.status].color)}>
              <StatusIcon className="h-3 w-3" />
              {statusConfig[node.status].label}
            </Badge>
          </div>

          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <div className="flex items-center gap-1.5">
              <User className="h-3.5 w-3.5" />
              <span>{node.executor}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Calendar className="h-3.5 w-3.5" />
              <span>{node.deadline}</span>
            </div>
            {hasChildren && (
              <div className="flex items-center gap-1.5 text-primary">
                <span className="font-medium">{node.children?.length} дочерних</span>
              </div>
            )}
          </div>
        </div>

        {/* Add Child Button */}
        {level === 0 && (
          <Button
            variant="outline"
            size="icon"
            className="shrink-0 opacity-0 group-hover:opacity-100 transition-opacity bg-background"
            onClick={(e) => {
              e.stopPropagation()
              // Handle add child
            }}
          >
            <Plus className="h-4 w-4" />
          </Button>
        )}
      </div>

      {/* Children */}
      {hasChildren && isExpanded && (
        <div>
          {node.children?.map((child, index) => (
            <TreeNode
              key={child.id}
              node={child}
              level={level + 1}
              isLast={index === node.children!.length - 1}
              parentLines={[...parentLines, !isLast]}
              onSelect={onSelect}
            />
          ))}
        </div>
      )}
    </div>
  )
}

interface AssignmentTreeProps {
  onSelectAssignment: (id: string) => void
}

export function AssignmentTree({ onSelectAssignment }: AssignmentTreeProps) {
  return (
    <div className="flex-1 flex flex-col border-r border-border bg-card">
      {/* Header */}
      <div className="border-b border-border px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-foreground">Иерархия поручений</h2>
            <p className="text-sm text-muted-foreground mt-1">
              Древовидное представление основных и дочерних поручений
            </p>
          </div>
          <Button size="sm" className="gap-2">
            <Plus className="h-4 w-4" />
            Создать поручение
          </Button>
        </div>
      </div>

      {/* Tree View */}
      <div className="flex-1 overflow-y-auto py-4">
        {mockTreeData.map((node, index) => (
          <TreeNode
            key={node.id}
            node={node}
            level={0}
            isLast={index === mockTreeData.length - 1}
            parentLines={[]}
            onSelect={onSelectAssignment}
          />
        ))}
      </div>
    </div>
  )
}
