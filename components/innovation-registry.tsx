"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, Download, Eye, Building2 } from "lucide-react"

const registryItems = [
  {
    id: "1",
    name: "Система диагностики трубопроводов ДИАГ-01",
    company: "ООО «ИнноТех»",
    category: "Диагностическое оборудование",
    year: "2024",
    status: "active",
  },
  {
    id: "2",
    name: "Композитные трубы КТ-500",
    company: "АО «КомпозитПром»",
    category: "Материалы",
    year: "2023",
    status: "active",
  },
  {
    id: "3",
    name: "ПО для мониторинга газораспределительных станций",
    company: "ООО «ГазСофт»",
    category: "Программное обеспечение",
    year: "2024",
    status: "active",
  },
  {
    id: "4",
    name: "Энергоэффективный компрессор ЭК-1000",
    company: "ЗАО «ЭнергоМаш»",
    category: "Оборудование",
    year: "2023",
    status: "active",
  },
  {
    id: "5",
    name: "Система автоматизированного учета газа САУГ-2.0",
    company: "ООО «АвтоГаз»",
    category: "Измерительное оборудование",
    year: "2024",
    status: "active",
  },
]

export function InnovationRegistry() {
  const [searchQuery, setSearchQuery] = useState("")

  const filteredItems = registryItems.filter(
    (item) =>
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.category.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  return (
    <div className="flex-1 overflow-y-auto p-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-foreground mb-2">Реестр продукции для внедрения</h2>
          <p className="text-sm text-muted-foreground">
            Инновационная продукция, одобренная для внедрения в ПАО «Газпром»
          </p>
        </div>

        {/* Search and Filter */}
        <div className="flex items-center gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Поиск по названию, компании или категории..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button variant="outline" className="gap-2 bg-transparent">
            <Download className="h-4 w-4" />
            Экспорт
          </Button>
        </div>

        {/* Registry Table */}
        <Card>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b border-border">
                <tr className="text-left">
                  <th className="px-6 py-4 text-sm font-medium text-muted-foreground">Наименование</th>
                  <th className="px-6 py-4 text-sm font-medium text-muted-foreground">Компания</th>
                  <th className="px-6 py-4 text-sm font-medium text-muted-foreground">Категория</th>
                  <th className="px-6 py-4 text-sm font-medium text-muted-foreground">Год</th>
                  <th className="px-6 py-4 text-sm font-medium text-muted-foreground">Статус</th>
                  <th className="px-6 py-4 text-sm font-medium text-muted-foreground"></th>
                </tr>
              </thead>
              <tbody>
                {filteredItems.map((item) => (
                  <tr key={item.id} className="border-b border-border hover:bg-muted/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-medium text-foreground">{item.name}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Building2 className="h-4 w-4" />
                        {item.company}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <Badge variant="secondary" className="text-xs">
                        {item.category}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 text-sm text-muted-foreground">{item.year}</td>
                    <td className="px-6 py-4">
                      <Badge className="bg-green-500/10 text-green-700 dark:text-green-400">Активно</Badge>
                    </td>
                    <td className="px-6 py-4">
                      <Button variant="ghost" size="sm" className="gap-2">
                        <Eye className="h-4 w-4" />
                        Подробнее
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        {filteredItems.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Ничего не найдено</p>
          </div>
        )}
      </div>
    </div>
  )
}
