import { DocumentDashboard } from "../components/DocumentDashboard"
import type { User } from "../lib/api"

interface DashboardPageProps {
  user: User
  onLogout: () => void
}

export function DashboardPage({ user, onLogout }: DashboardPageProps) {
  return <DocumentDashboard currentUser={user} onLogout={onLogout} />
}
