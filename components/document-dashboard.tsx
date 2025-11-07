"use client"

import { useState } from "react"
import { Sidebar } from "@/components/sidebar"
import { DocumentList } from "@/components/document-list"
import { DocumentDetails } from "@/components/document-details"
import { AssignmentList } from "@/components/assignment-list"
import { AssignmentDetails } from "@/components/assignment-details"
import { AssignmentTree } from "@/components/assignment-tree"
import { CalendarView } from "@/components/calendar-view"
import { SearchBar } from "@/components/search-bar"
import { ThemeToggle } from "@/components/theme-toggle"
import { Button } from "@/components/ui/button"
import { Plus, Bell, User, LogOut } from "lucide-react"
import type { User as UserType } from "@/lib/api"
import { SettingsPage } from "@/components/settings-page"

interface DocumentDashboardProps {
  currentUser: UserType | null
  onLogout: () => void
}

export function DocumentDashboard({ currentUser, onLogout }: DocumentDashboardProps) {
  const [selectedDocument, setSelectedDocument] = useState<string | null>(null)
  const [selectedAssignment, setSelectedAssignment] = useState<string | null>(null)
  const [currentView, setCurrentView] = useState<"documents" | "assignments" | "settings">("documents")
  const [assignmentSubView, setAssignmentSubView] = useState<"list" | "tree" | "calendar">("list")
  const [documentSubView, setDocumentSubView] = useState<"list" | "calendar">("list")

  const handleViewChange = (view: "documents" | "assignments" | "settings", subView?: string) => {
    setCurrentView(view)
    if (view === "assignments" && subView) {
      setAssignmentSubView(subView as "list" | "tree" | "calendar")
    }
    if (view === "documents" && subView) {
      setDocumentSubView(subView as "list" | "calendar")
    }
  }

  const getButtonText = () => {
    if (currentView === "documents") return "Новый документ"
    if (currentView === "assignments") return "Новое поручение"
    return "Создать"
  }

  return (
    <div className="flex h-screen bg-background">
      <Sidebar onViewChange={handleViewChange} />

      <div className="flex flex-1 flex-col">
        {/* Header */}
        <header className="flex items-center justify-between border-b border-border bg-card px-6 py-4">
          <div className="flex items-center gap-4 flex-1">
            <SearchBar />
          </div>

          <div className="flex items-center gap-3">
            <Button variant="default" size="sm" className="gap-2">
              <Plus className="h-4 w-4" />
              {getButtonText()}
            </Button>
            <ThemeToggle />
            <Button variant="ghost" size="icon">
              <Bell className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" title={currentUser?.email || "Пользователь"}>
              <User className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" onClick={onLogout} title="Выйти">
              <LogOut className="h-5 w-5" />
            </Button>
          </div>
        </header>

        {/* Main Content */}
        <div className="flex flex-1 overflow-hidden">
          {currentView === "settings" ? (
            currentUser ? (
              <SettingsPage currentUser={currentUser} />
            ) : (
              <div className="flex-1 flex items-center justify-center">
                <p className="text-muted-foreground">Пользователь не авторизован</p>
              </div>
            )
          ) : currentView === "documents" ? (
            <>
              {documentSubView === "calendar" ? (
                <CalendarView type="documents" onSelectItem={setSelectedDocument} />
              ) : (
                <>
                  <DocumentList onSelectDocument={setSelectedDocument} />
                  {selectedDocument && <DocumentDetails documentId={selectedDocument} />}
                </>
              )}
            </>
          ) : (
            <>
              {assignmentSubView === "calendar" ? (
                <CalendarView type="assignments" onSelectItem={setSelectedAssignment} />
              ) : assignmentSubView === "list" ? (
                <>
                  <AssignmentList onSelectAssignment={setSelectedAssignment} />
                  {selectedAssignment && <AssignmentDetails assignmentId={selectedAssignment} />}
                </>
              ) : (
                <>
                  <AssignmentTree onSelectAssignment={setSelectedAssignment} />
                  {selectedAssignment && <AssignmentDetails assignmentId={selectedAssignment} />}
                </>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}
