"use client"

import { useState, useEffect } from "react"
import { FileText, ClipboardList, Lightbulb, Settings, LogOut, ChevronDown, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { api } from "@/lib/api"

type User = {
  id: number
  email: string
  full_name: string
  role: string
  position: string
}

type Module = "documents" | "assignments" | "innovations" | "settings"
type View = "list" | "calendar" | "hierarchy"

export default function HomePage() {
  const [isLoading, setIsLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [user, setUser] = useState<User | null>(null)

  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    documents: false,
    assignments: false,
    innovations: false,
  })

  const [activeModule, setActiveModule] = useState<Module>("documents")
  const [activeView, setActiveView] = useState<View>("list")

  useEffect(() => {
    console.log("[v0] App mounted, checking authentication")
    checkAuth()
  }, [])

  const checkAuth = async () => {
    const token = localStorage.getItem("token")
    if (!token) {
      setIsLoading(false)
      return
    }

    console.log("[v0] Token found, validating session")
    try {
      const response = await api.validateSession(token)
      console.log("[v0] Session valid, user:", response.user)
      setUser(response.user)
      setIsAuthenticated(true)
    } catch (error) {
      console.error("[v0] Session validation failed:", error)
      localStorage.removeItem("token")
      localStorage.removeItem("user")
    }
    setIsLoading(false)
  }

  const handleLogout = () => {
    console.log("[v0] Logging out")
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    setIsAuthenticated(false)
    setUser(null)
  }

  const toggleSection = (section: string) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }))
  }

  console.log("[v0] Render state - isLoading:", isLoading, "isAuthenticated:", isAuthenticated)

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent"></div>
          <p className="mt-2 text-sm text-muted-foreground">Загрузка...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="w-full max-w-md p-6">
          <h1 className="text-2xl font-semibold mb-6 text-center">Войдите в систему</h1>
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground text-center">
              Для входа используйте:
              <br />
              admin@test.com / admin123
              <br />
              или
              <br />
              user@test.com / user123
            </p>
            <Button
              className="w-full"
              onClick={() => {
                // Demo login
                const demoUser = {
                  id: 1,
                  email: "admin@test.com",
                  full_name: "Администратор",
                  role: "admin",
                  position: "Системный администратор",
                }
                localStorage.setItem("token", "demo-token")
                localStorage.setItem("user", JSON.stringify(demoUser))
                setUser(demoUser)
                setIsAuthenticated(true)
              }}
            >
              Войти как администратор
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <div className="w-64 border-r bg-card flex flex-col">
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
              onClick={() => toggleSection("documents")}
              className="w-full flex items-center justify-between px-3 py-2 rounded-md hover:bg-accent transition-colors"
            >
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                <span className="text-sm font-medium">Корреспонденция</span>
              </div>
              {expandedSections.documents ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
            </button>
            {expandedSections.documents && (
              <div className="ml-6 mt-1 space-y-1">
                <button
                  onClick={() => {
                    setActiveModule("documents")
                    setActiveView("list")
                  }}
                  className={`w-full text-left px-3 py-1.5 rounded-md text-sm hover:bg-accent transition-colors ${
                    activeModule === "documents" && activeView === "list" ? "bg-accent" : ""
                  }`}
                >
                  Список документов
                </button>
                <button
                  onClick={() => {
                    setActiveModule("documents")
                    setActiveView("calendar")
                  }}
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
              onClick={() => toggleSection("assignments")}
              className="w-full flex items-center justify-between px-3 py-2 rounded-md hover:bg-accent transition-colors"
            >
              <div className="flex items-center gap-2">
                <ClipboardList className="h-4 w-4" />
                <span className="text-sm font-medium">Поручения</span>
              </div>
              {expandedSections.assignments ? (
                <ChevronDown className="h-4 w-4" />
              ) : (
                <ChevronRight className="h-4 w-4" />
              )}
            </button>
            {expandedSections.assignments && (
              <div className="ml-6 mt-1 space-y-1">
                <button
                  onClick={() => {
                    setActiveModule("assignments")
                    setActiveView("list")
                  }}
                  className={`w-full text-left px-3 py-1.5 rounded-md text-sm hover:bg-accent transition-colors ${
                    activeModule === "assignments" && activeView === "list" ? "bg-accent" : ""
                  }`}
                >
                  Мои поручения
                </button>
                <button
                  onClick={() => {
                    setActiveModule("assignments")
                    setActiveView("hierarchy")
                  }}
                  className={`w-full text-left px-3 py-1.5 rounded-md text-sm hover:bg-accent transition-colors ${
                    activeModule === "assignments" && activeView === "hierarchy" ? "bg-accent" : ""
                  }`}
                >
                  Иерархия
                </button>
                <button
                  onClick={() => {
                    setActiveModule("assignments")
                    setActiveView("calendar")
                  }}
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
              onClick={() => toggleSection("innovations")}
              className="w-full flex items-center justify-between px-3 py-2 rounded-md hover:bg-accent transition-colors"
            >
              <div className="flex items-center gap-2">
                <Lightbulb className="h-4 w-4" />
                <span className="text-sm font-medium">Инновации</span>
              </div>
              {expandedSections.innovations ? (
                <ChevronDown className="h-4 w-4" />
              ) : (
                <ChevronRight className="h-4 w-4" />
              )}
            </button>
            {expandedSections.innovations && (
              <div className="ml-6 mt-1 space-y-1">
                <button
                  onClick={() => {
                    setActiveModule("innovations")
                    setActiveView("list")
                  }}
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
              onClick={() => {
                setActiveModule("settings")
                setActiveView("list")
              }}
              className={`w-full flex items-center gap-2 px-3 py-2 rounded-md hover:bg-accent transition-colors ${
                activeModule === "settings" ? "bg-accent" : ""
              }`}
            >
              <Settings className="h-4 w-4" />
              <span className="text-sm font-medium">Настройки</span>
            </button>
          )}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t">
          <Button variant="ghost" className="w-full justify-start" onClick={handleLogout}>
            <LogOut className="h-4 w-4 mr-2" />
            Выйти
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-hidden">
        <div className="h-full flex flex-col">
          <header className="border-b px-6 py-4">
            <h2 className="text-xl font-semibold">
              {activeModule === "documents" && "Корреспонденция"}
              {activeModule === "assignments" && "Поручения"}
              {activeModule === "innovations" && "Инновации"}
              {activeModule === "settings" && "Настройки"}
            </h2>
          </header>
          <main className="flex-1 overflow-y-auto p-6">
            <div className="max-w-5xl mx-auto">
              <p className="text-muted-foreground">
                Содержимое раздела {activeModule} ({activeView})
              </p>
            </div>
          </main>
        </div>
      </div>
    </div>
  )
}
