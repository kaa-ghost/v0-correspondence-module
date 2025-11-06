"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ChevronLeft, ChevronRight, FileText, ClipboardList } from "lucide-react"
import { cn } from "@/lib/utils"

interface CalendarItem {
  id: string
  type: "document" | "assignment"
  title: string
  date: string
  status: string
  priority?: "high" | "medium" | "low"
}

const mockCalendarItems: CalendarItem[] = [
  {
    id: "1",
    type: "document",
    title: "ВХ-2025-001: Запрос на предоставление информации",
    date: "2025-11-06",
    status: "Новый",
    priority: "high",
  },
  {
    id: "2",
    type: "assignment",
    title: "ПР-2025-015: Подготовить отчет по проекту",
    date: "2025-11-08",
    status: "На исполнении",
    priority: "high",
  },
  {
    id: "3",
    type: "document",
    title: "ВХ-2025-002: Уведомление о проверке",
    date: "2025-11-05",
    status: "В работе",
    priority: "high",
  },
  {
    id: "4",
    type: "assignment",
    title: "ПР-2025-016: Согласовать договор",
    date: "2025-11-10",
    status: "На исполнении",
    priority: "medium",
  },
]

interface CalendarViewProps {
  type: "documents" | "assignments"
  onSelectItem?: (id: string) => void
}

export function CalendarView({ type, onSelectItem }: CalendarViewProps) {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState<string | null>(null)

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear()
    const month = date.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const daysInMonth = lastDay.getDate()
    const startingDayOfWeek = firstDay.getDay()

    return { daysInMonth, startingDayOfWeek, year, month }
  }

  const { daysInMonth, startingDayOfWeek, year, month } = getDaysInMonth(currentDate)

  const previousMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1))
  }

  const nextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1))
  }

  const getItemsForDate = (day: number) => {
    const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`
    return mockCalendarItems.filter(
      (item) => item.date === dateStr && (type === "documents" ? item.type === "document" : item.type === "assignment"),
    )
  }

  const monthNames = [
    "Январь",
    "Февраль",
    "Март",
    "Апрель",
    "Май",
    "Июнь",
    "Июль",
    "Август",
    "Сентябрь",
    "Октябрь",
    "Ноябрь",
    "Декабрь",
  ]

  const dayNames = ["Вс", "Пн", "Вт", "Ср", "Чт", "Пт", "Сб"]

  const handleDateClick = (day: number) => {
    const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`
    setSelectedDate(dateStr)
  }

  const selectedDateItems = selectedDate
    ? mockCalendarItems.filter(
        (item) =>
          item.date === selectedDate && (type === "documents" ? item.type === "document" : item.type === "assignment"),
      )
    : []

  return (
    <div className="flex-1 overflow-hidden flex">
      {/* Calendar Grid */}
      <div className="flex-1 flex flex-col p-6">
        {/* Calendar Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-foreground">
            {monthNames[month]} {year}
          </h2>
          <div className="flex gap-2">
            <Button variant="outline" size="icon" onClick={previousMonth}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon" onClick={nextMonth}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Calendar Grid */}
        <div className="flex-1 border border-border rounded-lg overflow-hidden bg-card">
          {/* Day Names */}
          <div className="grid grid-cols-7 border-b border-border bg-muted/50">
            {dayNames.map((day) => (
              <div key={day} className="p-2 text-center text-sm font-medium text-muted-foreground">
                {day}
              </div>
            ))}
          </div>

          {/* Calendar Days */}
          <div className="grid grid-cols-7 flex-1" style={{ gridAutoRows: "1fr" }}>
            {Array.from({ length: startingDayOfWeek === 0 ? 6 : startingDayOfWeek - 1 }).map((_, index) => (
              <div key={`empty-${index}`} className="border-r border-b border-border bg-muted/20" />
            ))}

            {Array.from({ length: daysInMonth }).map((_, index) => {
              const day = index + 1
              const items = getItemsForDate(day)
              const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`
              const isSelected = selectedDate === dateStr
              const isToday =
                new Date().getDate() === day && new Date().getMonth() === month && new Date().getFullYear() === year

              return (
                <div
                  key={day}
                  onClick={() => handleDateClick(day)}
                  className={cn(
                    "border-r border-b border-border p-2 cursor-pointer hover:bg-accent/50 transition-colors",
                    isSelected && "bg-accent/30",
                  )}
                >
                  <div
                    className={cn(
                      "text-sm font-medium mb-1",
                      isToday &&
                        "inline-flex items-center justify-center w-6 h-6 rounded-full bg-primary text-primary-foreground",
                    )}
                  >
                    {day}
                  </div>
                  <div className="space-y-1">
                    {items.slice(0, 3).map((item) => (
                      <div
                        key={item.id}
                        onClick={(e) => {
                          e.stopPropagation()
                          onSelectItem?.(item.id)
                        }}
                        className={cn(
                          "text-xs p-1 rounded truncate cursor-pointer hover:opacity-80",
                          item.priority === "high" && "bg-destructive/10 text-destructive",
                          item.priority === "medium" && "bg-accent text-accent-foreground",
                          item.priority === "low" && "bg-muted text-muted-foreground",
                        )}
                      >
                        {item.type === "document" ? (
                          <FileText className="h-3 w-3 inline mr-1" />
                        ) : (
                          <ClipboardList className="h-3 w-3 inline mr-1" />
                        )}
                        {item.title.split(":")[0]}
                      </div>
                    ))}
                    {items.length > 3 && <div className="text-xs text-muted-foreground">+{items.length - 3} еще</div>}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Selected Date Details */}
      {selectedDate && selectedDateItems.length > 0 && (
        <div className="w-80 border-l border-border bg-card p-6 overflow-y-auto">
          <h3 className="text-lg font-semibold mb-4 text-foreground">
            {new Date(selectedDate).toLocaleDateString("ru-RU", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </h3>

          <div className="space-y-3">
            {selectedDateItems.map((item) => (
              <div
                key={item.id}
                onClick={() => onSelectItem?.(item.id)}
                className="p-3 border border-border rounded-lg hover:bg-accent/50 cursor-pointer transition-colors"
              >
                <div className="flex items-start gap-2 mb-2">
                  {item.type === "document" ? (
                    <FileText className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                  ) : (
                    <ClipboardList className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground line-clamp-2">{item.title}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge
                    variant="secondary"
                    className={cn(
                      "text-xs",
                      item.priority === "high" && "bg-destructive/10 text-destructive",
                      item.priority === "medium" && "bg-accent text-accent-foreground",
                      item.priority === "low" && "bg-muted text-muted-foreground",
                    )}
                  >
                    {item.status}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
