"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  FileText,
  Inbox,
  Send,
  FileSignature,
  Building2,
  Archive,
  Folder,
  Search,
  Settings,
  ChevronDown,
  ChevronRight,
  ClipboardList,
  ListTodo,
  Clock,
  CheckCircle2,
  AlertCircle,
  GitBranch,
  Calendar,
  Lightbulb,
  FileCheck,
  SendIcon,
} from "lucide-react"
import { cn } from "@/lib/utils"

const documentItems = [
  { icon: Inbox, label: "Входящие", count: 12, view: "documents" as const, subView: "list" as const },
  { icon: Send, label: "Исходящие", count: 8, view: "documents" as const, subView: "list" as const },
  { icon: FileSignature, label: "Договоры", count: 5, view: "documents" as const, subView: "list" as const },
  { icon: Building2, label: "Организационные", count: 3, view: "documents" as const, subView: "list" as const },
  { icon: Archive, label: "Архив", view: "documents" as const, subView: "list" as const },
  { icon: Folder, label: "Мои папки", view: "documents" as const, subView: "list" as const },
  { icon: Calendar, label: "Календарь", view: "documents" as const, subView: "calendar" as const },
  { icon: Search, label: "Поиск", view: "documents" as const, subView: "list" as const },
]

const assignmentItems = [
  { icon: ListTodo, label: "Мои поручения", count: 15, view: "assignments" as const, subView: "list" as const },
  { icon: GitBranch, label: "Иерархия", view: "assignments" as const, subView: "tree" as const },
  { icon: Clock, label: "На исполнении", count: 8, view: "assignments" as const, subView: "list" as const },
  { icon: AlertCircle, label: "Просроченные", count: 3, view: "assignments" as const, subView: "list" as const },
  { icon: CheckCircle2, label: "Завершенные", view: "assignments" as const, subView: "list" as const },
  { icon: ClipboardList, label: "Все поручения", view: "assignments" as const, subView: "list" as const },
  { icon: Calendar, label: "Календарь", view: "assignments" as const, subView: "calendar" as const },
  { icon: Search, label: "Поиск поручений", view: "assignments" as const, subView: "list" as const },
]

const innovationItems = [
  { icon: Lightbulb, label: "Главная", view: "innovations" as const, subView: "home" as const },
  { icon: SendIcon, label: "Мои предложения", count: 4, view: "innovations" as const, subView: "proposals" as const },
  { icon: FileCheck, label: "Реестр продукции", view: "innovations" as const, subView: "registry" as const },
  { icon: Search, label: "Поиск", view: "innovations" as const, subView: "search" as const },
]

interface SidebarProps {
  onViewChange?: (view: "documents" | "assignments" | "innovations" | "settings", subView?: string) => void
}

export function Sidebar({ onViewChange }: SidebarProps) {
  const [activeItem, setActiveItem] = useState("Входящие")
  const [expandedSections, setExpandedSections] = useState<string[]>(["Документы", "Поручения", "Инновации"])

  const toggleSection = (section: string) => {
    setExpandedSections((prev) => (prev.includes(section) ? prev.filter((s) => s !== section) : [...prev, section]))
  }

  const handleItemClick = (
    label: string,
    view: "documents" | "assignments" | "innovations" | "settings",
    subView?: string,
  ) => {
    setActiveItem(label)
    onViewChange?.(view, subView)
  }

  return (
    <aside className="w-64 border-r border-sidebar-border bg-sidebar text-sidebar-foreground flex flex-col">
      {/* Logo */}
      <div className="px-6 py-5 border-b border-sidebar-border">
        <div className="flex items-center gap-2">
          <FileText className="h-6 w-6 text-sidebar-primary" />
          <span className="font-semibold text-lg">Б5ЭДО</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4">
        {/* Documents Section */}
        <div className="px-3 mb-4">
          <button
            onClick={() => toggleSection("Документы")}
            className="flex items-center gap-2 w-full px-3 py-2 text-sm text-sidebar-foreground/70 hover:text-sidebar-foreground transition-colors"
          >
            {expandedSections.includes("Документы") ? (
              <ChevronDown className="h-4 w-4" />
            ) : (
              <ChevronRight className="h-4 w-4" />
            )}
            <span className="font-medium">Документы</span>
          </button>

          {expandedSections.includes("Документы") && (
            <div className="mt-1 space-y-1">
              {documentItems.map((item) => (
                <Button
                  key={item.label}
                  variant="ghost"
                  className={cn(
                    "w-full justify-start gap-3 px-3 py-2 h-auto text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                    activeItem === item.label && "bg-sidebar-accent text-sidebar-accent-foreground",
                  )}
                  onClick={() => handleItemClick(item.label, item.view, item.subView)}
                >
                  <item.icon className="h-4 w-4" />
                  <span className="flex-1 text-left text-sm">{item.label}</span>
                  {item.count && (
                    <span className="text-xs bg-sidebar-primary text-sidebar-primary-foreground px-2 py-0.5 rounded-full">
                      {item.count}
                    </span>
                  )}
                </Button>
              ))}
            </div>
          )}
        </div>

        {/* Assignments Section */}
        <div className="px-3 mb-4">
          <button
            onClick={() => toggleSection("Поручения")}
            className="flex items-center gap-2 w-full px-3 py-2 text-sm text-sidebar-foreground/70 hover:text-sidebar-foreground transition-colors"
          >
            {expandedSections.includes("Поручения") ? (
              <ChevronDown className="h-4 w-4" />
            ) : (
              <ChevronRight className="h-4 w-4" />
            )}
            <span className="font-medium">Поручения</span>
          </button>

          {expandedSections.includes("Поручения") && (
            <div className="mt-1 space-y-1">
              {assignmentItems.map((item) => (
                <Button
                  key={item.label}
                  variant="ghost"
                  className={cn(
                    "w-full justify-start gap-3 px-3 py-2 h-auto text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                    activeItem === item.label && "bg-sidebar-accent text-sidebar-accent-foreground",
                  )}
                  onClick={() => handleItemClick(item.label, item.view, item.subView)}
                >
                  <item.icon className="h-4 w-4" />
                  <span className="flex-1 text-left text-sm">{item.label}</span>
                  {item.count && (
                    <span className="text-xs bg-sidebar-primary text-sidebar-primary-foreground px-2 py-0.5 rounded-full">
                      {item.count}
                    </span>
                  )}
                </Button>
              ))}
            </div>
          )}
        </div>

        <div className="px-3 mb-4">
          <button
            onClick={() => toggleSection("Инновации")}
            className="flex items-center gap-2 w-full px-3 py-2 text-sm text-sidebar-foreground/70 hover:text-sidebar-foreground transition-colors"
          >
            {expandedSections.includes("Инновации") ? (
              <ChevronDown className="h-4 w-4" />
            ) : (
              <ChevronRight className="h-4 w-4" />
            )}
            <span className="font-medium">Инновации</span>
          </button>

          {expandedSections.includes("Инновации") && (
            <div className="mt-1 space-y-1">
              {innovationItems.map((item) => (
                <Button
                  key={item.label}
                  variant="ghost"
                  className={cn(
                    "w-full justify-start gap-3 px-3 py-2 h-auto text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                    activeItem === item.label && "bg-sidebar-accent text-sidebar-accent-foreground",
                  )}
                  onClick={() => handleItemClick(item.label, item.view, item.subView)}
                >
                  <item.icon className="h-4 w-4" />
                  <span className="flex-1 text-left text-sm">{item.label}</span>
                  {item.count && (
                    <span className="text-xs bg-sidebar-primary text-sidebar-primary-foreground px-2 py-0.5 rounded-full">
                      {item.count}
                    </span>
                  )}
                </Button>
              ))}
            </div>
          )}
        </div>
      </nav>

      {/* Settings */}
      <div className="border-t border-sidebar-border p-3">
        <Button
          variant="ghost"
          className={cn(
            "w-full justify-start gap-3 text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
            activeItem === "Настройки" && "bg-sidebar-accent text-sidebar-accent-foreground",
          )}
          onClick={() => handleItemClick("Настройки", "settings")}
        >
          <Settings className="h-4 w-4" />
          <span className="text-sm">Настройки</span>
        </Button>
      </div>
    </aside>
  )
}
