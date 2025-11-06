"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Clock, CheckCircle2, XCircle, Eye, MessageSquare, Calendar } from "lucide-react"

const proposals = [
  {
    id: "1",
    title: "Система мониторинга трубопроводов на базе IoT",
    number: "ИП-2024-001",
    date: "15.03.2024",
    status: "review",
    category: "Технология",
    description: "Инновационная система для мониторинга состояния трубопроводов в режиме реального времени",
    comments: 3,
  },
  {
    id: "2",
    title: "Композитные материалы для газовой отрасли",
    number: "ИП-2024-002",
    date: "10.03.2024",
    status: "approved",
    category: "Материалы",
    description: "Разработка композитных материалов с улучшенными характеристиками",
    comments: 5,
  },
  {
    id: "3",
    title: "Автоматизированная система учета газа",
    number: "ИП-2024-003",
    date: "05.03.2024",
    status: "rejected",
    category: "Программное обеспечение",
    description: "ПО для автоматизации учета и контроля расхода газа",
    comments: 2,
  },
  {
    id: "4",
    title: "Энергоэффективные компрессорные установки",
    number: "ИП-2024-004",
    date: "01.03.2024",
    status: "review",
    category: "Оборудование",
    description: "Компрессорные установки нового поколения с повышенной эффективностью",
    comments: 1,
  },
]

const statusConfig = {
  review: { label: "На рассмотрении", icon: Clock, color: "bg-blue-500/10 text-blue-700 dark:text-blue-400" },
  approved: {
    label: "Одобрено",
    icon: CheckCircle2,
    color: "bg-green-500/10 text-green-700 dark:text-green-400",
  },
  rejected: { label: "Отклонено", icon: XCircle, color: "bg-red-500/10 text-red-700 dark:text-red-400" },
}

export function InnovationProposals() {
  const [selectedProposal, setSelectedProposal] = useState<string | null>(null)

  return (
    <div className="flex-1 overflow-y-auto p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-foreground">Мои предложения</h2>
            <p className="text-sm text-muted-foreground">Отслеживайте статус ваших инновационных предложений</p>
          </div>
          <Button className="gap-2">Новое предложение</Button>
        </div>

        <div className="space-y-4">
          {proposals.map((proposal) => {
            const status = statusConfig[proposal.status as keyof typeof statusConfig]
            const StatusIcon = status.icon

            return (
              <Card
                key={proposal.id}
                className="p-6 hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => setSelectedProposal(proposal.id)}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold text-foreground">{proposal.title}</h3>
                      <Badge variant="outline" className="text-xs">
                        {proposal.number}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">{proposal.description}</p>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {proposal.date}
                      </div>
                      <Badge variant="secondary" className="text-xs">
                        {proposal.category}
                      </Badge>
                      <div className="flex items-center gap-1">
                        <MessageSquare className="h-3 w-3" />
                        {proposal.comments} комментариев
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <Badge className={status.color}>
                      <StatusIcon className="h-3 w-3 mr-1" />
                      {status.label}
                    </Badge>
                    <Button variant="ghost" size="sm" className="gap-2">
                      <Eye className="h-4 w-4" />
                      Подробнее
                    </Button>
                  </div>
                </div>
              </Card>
            )
          })}
        </div>
      </div>
    </div>
  )
}
