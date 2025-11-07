"use client"

import { FileText, ClipboardList, Lightbulb, Settings, ChevronDown, ChevronRight } from "lucide-react"

type Module = "documents" | "assignments" | "innovations" | "settings"
type View = "list" | "calendar" | "hierarchy"

type Props = {
  user: any
  activeModule: Module
  activeView: View
  onModuleChange: (module: Module, view: View) => void
  expandedSections: string[]
  onToggleSection: (section: string) => void
}

export function Sidebar({ user, activeModule, activeView, onModuleChange, expandedSections, onToggleSection }: Props) {
  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b">
        <h1 className="font-semibold text-lg">Система управления</h1>
        <p className="text-xs text-muted-foreground mt-1">{user?.full_name}</p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto p-2">
        {/* Корреспонденция */}
        <div className="mb-2">
          <button
            onClick={() => onToggleSection("Документы")}
            className="w-full flex items-center justify-between px-3 py-2 rounded-md hover:bg-accent transition-colors"
          >
            <div className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              <span className="text-sm font-medium">Корреспонденция</span>
            </div>
            {expandedSections.includes("Документы") ? (
              <ChevronDown className="h-4 w-4" />
            ) : (
              <ChevronRight className="h-4 w-4" />
            )}
          </button>
          {expandedSections.includes("Документы") && (
            <div className="ml-6 mt-1 space-y-1 pl-4">
              <button
                onClick={() => onModuleChange("documents", "list")}
                className={`w-full text-left px-3 py-1.5 rounded-md text-sm hover:bg-accent transition-colors ${
                  activeModule === "documents" && activeView === "list" ? "bg-accent" : ""
                }`}
              >
                Список документов
              </button>
              <button
                onClick={() => onModuleChange("documents", "calendar")}
                className={`w-full text-left px-3 py-1.5 rounded-md text-sm hover:bg-accent transition-colors ${
                  activeModule === "documents" && activeView === "calendar" ? "bg-accent" : ""
                }`}
              >
                Календарь
              </button>
            </div>
          )}
        </div>

        {/* Поручения */}
        <div className="mb-2">
          <button
            onClick={() => onToggleSection("Поручения")}
            className="w-full flex items-center justify-between px-3 py-2 rounded-md hover:bg-accent transition-colors"
          >
            <div className="flex items-center gap-2">
              <ClipboardList className="h-4 w-4" />
              <span className="text-sm font-medium">Поручения</span>
            </div>
            {expandedSections.includes("Поручения") ? (
              <ChevronDown className="h-4 w-4" />
            ) : (
              <ChevronRight className="h-4 w-4" />
            )}
          </button>
          {expandedSections.includes("Поручения") && (
            <div className="ml-6 mt-1 space-y-1 pl-4">
              <button
                onClick={() => onModuleChange("assignments", "list")}
                className={`w-full text-left px-3 py-1.5 rounded-md text-sm hover:bg-accent transition-colors ${
                  activeModule === "assignments" && activeView === "list" ? "bg-accent" : ""
                }`}
              >
                Мои поручения
              </button>
              <button
                onClick={() => onModuleChange("assignments", "hierarchy")}
                className={`w-full text-left px-3 py-1.5 rounded-md text-sm hover:bg-accent transition-colors ${
                  activeModule === "assignments" && activeView === "hierarchy" ? "bg-accent" : ""
                }`}
              >
                Иерархия
              </button>
              <button
                onClick={() => onModuleChange("assignments", "calendar")}
                className={`w-full text-left px-3 py-1.5 rounded-md text-sm hover:bg-accent transition-colors ${
                  activeModule === "assignments" && activeView === "calendar" ? "bg-accent" : ""
                }`}
              >
                Календарь
              </button>
            </div>
          )}
        </div>

        {/* Инновации */}
        <div className="mb-2">
          <button
            onClick={() => onToggleSection("Инновации")}
            className="w-full flex items-center justify-between px-3 py-2 rounded-md hover:bg-accent transition-colors"
          >
            <div className="flex items-center gap-2">
              <Lightbulb className="h-4 w-4" />
              <span className="text-sm font-medium">Инновации</span>
            </div>
            {expandedSections.includes("Инновации") ? (
              <ChevronDown className="h-4 w-4" />
            ) : (
              <ChevronRight className="h-4 w-4" />
            )}
          </button>
          {expandedSections.includes("Инновации") && (
            <div className="ml-6 mt-1 space-y-1 pl-4">
              <button
                onClick={() => onModuleChange("innovations", "list")}
                className={`w-full text-left px-3 py-1.5 rounded-md text-sm hover:bg-accent transition-colors ${
                  activeModule === "innovations" && activeView === "list" ? "bg-accent" : ""
                }`}
              >
                Главная
              </button>
            </div>
          )}
        </div>

        {/* Настройки */}
        {user?.role === "admin" && (
          <button
            onClick={() => onModuleChange("settings", "list")}
            className={`w-full flex items-center gap-2 px-3 py-2 rounded-md hover:bg-accent transition-colors ${
              activeModule === "settings" ? "bg-accent" : ""
            }`}
          >
            <Settings className="h-4 w-4" />
            <span className="text-sm font-medium">Настройки</span>
          </button>
        )}
      </nav>
    </div>
  )
}
