"use client"

import { useState } from "react"
import { Sidebar } from "@/components/sidebar"
import { DocumentList } from "@/components/document-list"
import { DocumentDetails } from "@/components/document-details"
import { AssignmentList } from "@/components/assignment-list"
import { AssignmentDetails } from "@/components/assignment-details"
import { AssignmentTree } from "@/components/assignment-tree"
import { CalendarView } from "@/components/calendar-view"
import { InnovationHome } from "@/components/innovation-home"
import { InnovationProposals } from "@/components/innovation-proposals"
import { InnovationRegistry } from "@/components/innovation-registry"
import { SearchBar } from "@/components/search-bar"
import { ThemeToggle } from "@/components/theme-toggle"
import { Button } from "@/components/ui/button"
import { Plus, Bell, User } from "lucide-react"

export function DocumentDashboard() {
  const [selectedDocument, setSelectedDocument] = useState<string | null>(null)
  const [selectedAssignment, setSelectedAssignment] = useState<string | null>(null)
  const [currentView, setCurrentView] = useState<"documents" | "assignments" | "innovations">("documents")
  const [assignmentSubView, setAssignmentSubView] = useState<"list" | "tree" | "calendar">("list")
  const [documentSubView, setDocumentSubView] = useState<"list" | "calendar">("list")
  const [innovationSubView, setInnovationSubView] = useState<"home" | "proposals" | "registry" | "search">("home")

  const handleViewChange = (view: "documents" | "assignments" | "innovations", subView?: string) => {
    setCurrentView(view)
    if (view === "assignments" && subView) {
      setAssignmentSubView(subView as "list" | "tree" | "calendar")
    }
    if (view === "documents" && subView) {
      setDocumentSubView(subView as "list" | "calendar")
    }
    if (view === "innovations" && subView) {
      setInnovationSubView(subView as "home" | "proposals" | "registry" | "search")
    }
  }

  const getButtonText = () => {
    if (currentView === "documents") return "Новый документ"
    if (currentView === "assignments") return "Новое поручение"
    return "Новое предложение"
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
            <Button variant="ghost" size="icon">
              <User className="h-5 w-5" />
            </Button>
          </div>
        </header>

        {/* Main Content */}
        <div className="flex flex-1 overflow-hidden">
          {currentView === "innovations" ? (
            <>
              {innovationSubView === "home" && <InnovationHome />}
              {innovationSubView === "proposals" && <InnovationProposals />}
              {innovationSubView === "registry" && <InnovationRegistry />}
              {innovationSubView === "search" && <InnovationProposals />}
            </>
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
