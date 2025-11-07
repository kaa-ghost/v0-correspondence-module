"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { StatusHistory } from "@/components/status-history"
import { Download, Printer, Share2, Archive, FileText, Calendar, User, Building, Hash } from "lucide-react"

interface DocumentDetailsProps {
  documentId: string
}

export function DocumentDetails({ documentId }: DocumentDetailsProps) {
  return (
    <div className="w-[600px] border-l border-border bg-card overflow-y-auto">
      {/* Header Actions */}
      <div className="sticky top-0 bg-card border-b border-border px-6 py-4 z-10">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-card-foreground">Детали документа</h2>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon">
              <Download className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon">
              <Printer className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon">
              <Share2 className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon">
              <Archive className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Document Content */}
      <div className="p-6 space-y-6">
        {/* Status Badge */}
        <div className="flex items-center gap-2">
          <Badge className="bg-primary text-primary-foreground">Новый документ</Badge>
          <Badge variant="outline" className="bg-destructive/10 text-destructive border-destructive/20">
            Высокий приоритет
          </Badge>
        </div>

        {/* Document Title */}
        <div>
          <h1 className="text-2xl font-semibold text-card-foreground mb-2">
            Запрос на предоставление информации о продукции
          </h1>
          <p className="text-sm text-muted-foreground">Входящий документ от внешней организации</p>
        </div>

        <Separator />

        {/* Document Metadata */}
        <div className="grid grid-cols-2 gap-4">
          <Card className="p-4 bg-secondary/50 border-border">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Hash className="h-4 w-4 text-primary" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Номер документа</p>
                <p className="font-medium text-card-foreground">ВХ-2025-001</p>
              </div>
            </div>
          </Card>

          <Card className="p-4 bg-secondary/50 border-border">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-accent/10 rounded-lg">
                <Calendar className="h-4 w-4 text-accent" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Дата регистрации</p>
                <p className="font-medium text-card-foreground">06.11.2025</p>
              </div>
            </div>
          </Card>

          <Card className="p-4 bg-secondary/50 border-border">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Building className="h-4 w-4 text-primary" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Отправитель</p>
                <p className="font-medium text-card-foreground">ООО "Компания А"</p>
              </div>
            </div>
          </Card>

          <Card className="p-4 bg-secondary/50 border-border">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-accent/10 rounded-lg">
                <User className="h-4 w-4 text-accent" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Ответственный</p>
                <p className="font-medium text-card-foreground">Петров П.П.</p>
              </div>
            </div>
          </Card>
        </div>

        <Separator />

        <Tabs defaultValue="content" className="w-full">
          <TabsList className="w-full justify-start">
            <TabsTrigger value="content">Содержание</TabsTrigger>
            <TabsTrigger value="history">История изменений</TabsTrigger>
          </TabsList>

          <TabsContent value="content" className="space-y-6 mt-6">
            {/* Document Content */}
            <div>
              <h3 className="font-semibold text-card-foreground mb-3">Содержание документа</h3>
              <Card className="p-4 bg-secondary/30 border-border">
                <p className="text-sm text-card-foreground leading-relaxed">
                  Уважаемые коллеги, просим предоставить подробную информацию о вашей продукции, включая технические
                  характеристики, сертификаты соответствия и прайс-лист. Информация необходима для рассмотрения
                  возможности сотрудничества.
                </p>
              </Card>
            </div>

            {/* Attachments */}
            <div>
              <h3 className="font-semibold text-card-foreground mb-3">Вложения</h3>
              <div className="space-y-2">
                <Card className="p-3 bg-secondary/30 border-border hover:bg-secondary/50 transition-colors cursor-pointer">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary/10 rounded">
                      <FileText className="h-4 w-4 text-primary" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-card-foreground">Запрос_информации.pdf</p>
                      <p className="text-xs text-muted-foreground">245 KB</p>
                    </div>
                    <Button variant="ghost" size="sm">
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                </Card>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-4">
              <Button className="flex-1">Взять в работу</Button>
              <Button variant="outline" className="flex-1 bg-transparent">
                Переадресовать
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="history" className="mt-6">
            <StatusHistory entityType="document" entityId={Number.parseInt(documentId)} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
