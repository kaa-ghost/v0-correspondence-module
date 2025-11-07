"use client"

import { useState } from "react"
import { LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sidebar } from "@/components/sidebar"
import { SettingsPage } from "@/components/settings-page"

type Module = "documents" | "assignments" | "innovations" | "settings"
type View = "list" | "calendar" | "hierarchy"

type Props = {
  user: any
  onLogout: () => void
}

export function DocumentDashboard({ user, onLogout }: Props) {
  const [activeModule, setActiveModule] = useState<Module>("documents")
  const [activeView, setActiveView] = useState<View>("list")
  const [expandedSections, setExpandedSections] = useState<string[]>([])

  const handleModuleChange = (module: Module, view: View) => {
    setActiveModule(module)
    setActiveView(view)
  }

  const handleToggleSection = (section: string) => {
    setExpandedSections((prev) => (prev.includes(section) ? prev.filter((s) => s !== section) : [...prev, section]))
  }

  const getModuleTitle = () => {
    switch (activeModule) {
      case "documents":
        return "Корреспонденция"
      case "assignments":
        return "Поручения"
      case "innovations":
        return "Инновации"
      case "settings":
        return "Настройки"
      default:
        return ""
    }
  }

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <div className="w-64 border-r bg-card">
        <Sidebar
          user={user}
          activeModule={activeModule}
          activeView={activeView}
          onModuleChange={handleModuleChange}
          expandedSections={expandedSections}
          onToggleSection={handleToggleSection}
        />
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-hidden">
        <div className="h-full flex flex-col">
          <header className="border-b px-6 py-4 flex items-center justify-between">
            <h2 className="text-xl font-semibold">{getModuleTitle()}</h2>
            <Button variant="ghost" size="sm" onClick={onLogout}>
              <LogOut className="h-4 w-4 mr-2" />
              Выйти
            </Button>
          </header>
          <main className="flex-1 overflow-y-auto p-6">
            {activeModule === "settings" ? (
              <SettingsPage user={user} />
            ) : (
              <div className="max-w-5xl mx-auto">
                <p className="text-muted-foreground">
                  Содержимое раздела {getModuleTitle()} ({activeView})
                </p>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  )
}
