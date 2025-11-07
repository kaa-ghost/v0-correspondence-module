import { AuthForm } from "../components/AuthForm"
import type { User } from "../lib/api"

interface AuthPageProps {
  onLogin: (user: User, token: string) => void
}

export function AuthPage({ onLogin }: AuthPageProps) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <AuthForm onLogin={onLogin} />
    </div>
  )
}
