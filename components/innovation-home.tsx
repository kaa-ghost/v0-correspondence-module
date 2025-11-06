"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { FileText, Send, Eye, MessageSquare, Lightbulb } from "lucide-react"

export function InnovationHome() {
  return (
    <div className="flex-1 overflow-y-auto">
      <div className="max-w-5xl mx-auto p-8">
        {/* Header with CTA Button */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
              <Lightbulb className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-foreground">Инновации</h1>
              <p className="text-sm text-muted-foreground">Система «одного окна» для инновационных предложений</p>
            </div>
          </div>
          <Button size="lg" className="gap-2">
            <Send className="h-4 w-4" />
            Подать инновационное предложение
          </Button>
        </div>

        {/* Main Content Card */}
        <Card className="p-8 mb-6">
          <div className="prose prose-sm max-w-none">
            <p className="text-base leading-relaxed text-foreground mb-6">
              ПАО «Газпром» поддерживает стремление малого и среднего бизнеса к созданию отечественной инновационной
              продукции, технологий, материалов, услуг для газовой отрасли.
            </p>
            <p className="text-base leading-relaxed text-foreground mb-6">
              Для упрощения взаимодействия субъектов малого и среднего предпринимательства со структурными
              подразделениями ПАО «Газпром», его дочерними обществами и организациями, участвующими в принятии решений о
              применении инноваций, действует интернет-портал системы «одного окна».
            </p>

            <h3 className="text-lg font-semibold text-foreground mb-4">Ваши возможности в системе:</h3>
            <ul className="space-y-3 mb-6">
              <li className="flex items-start gap-3">
                <Send className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                <span className="text-foreground">
                  отправлять предложения о внедрении инновационной продукции в производственную деятельность Группы
                  Газпром
                </span>
              </li>
              <li className="flex items-start gap-3">
                <Eye className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                <span className="text-foreground">отслеживать процесс рассмотрения предложений</span>
              </li>
              <li className="flex items-start gap-3">
                <MessageSquare className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                <span className="text-foreground">получать обратную связь по вопросам рассмотрения предложений</span>
              </li>
            </ul>

            <p className="text-sm leading-relaxed text-muted-foreground mb-6">
              Деятельность системы «одного окна» распространяется на инновационные и высокотехнологичные товары, работы,
              услуги и результаты НИОКР - законченные инновационные разработки субъектов малого и среднего
              предпринимательства, предлагаемые ими для использования (внедрения, применения, выполнения, оказания) ПАО
              «Газпром» и его дочерними обществами и организациями, а также на поступающие инновационные предложения
              физических и юридических лиц, не достигшие стадии готовой продукции (технологии).
            </p>

            <p className="text-sm leading-relaxed text-muted-foreground mb-8">
              Система «одного окна» является одним из механизмов корпоративной системы внедрения инновационной продукции
              в ПАО «Газпром». Предложения, прошедшие процедуру рассмотрения в рамках системы «одного окна», подлежат
              рассмотрению на предмет включения в Реестр продукции для внедрения и дальнейшего планирования
              соответствующих мероприятий в установленном порядке.
            </p>

            <div className="flex gap-4">
              <Button variant="outline" className="gap-2 bg-transparent">
                <FileText className="h-4 w-4" />
                Реестр продукции для внедрения в ПАО «Газпром»
              </Button>
              <Button variant="outline" className="gap-2 bg-transparent">
                <FileText className="h-4 w-4" />
                Критерии инновационности (PDF)
              </Button>
            </div>
          </div>
        </Card>

        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-4">
          <Card className="p-6">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-lg bg-blue-500/10 flex items-center justify-center">
                <Send className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-foreground">4</div>
                <div className="text-sm text-muted-foreground">Мои предложения</div>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-lg bg-green-500/10 flex items-center justify-center">
                <Eye className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-foreground">2</div>
                <div className="text-sm text-muted-foreground">На рассмотрении</div>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-lg bg-purple-500/10 flex items-center justify-center">
                <FileText className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-foreground">156</div>
                <div className="text-sm text-muted-foreground">В реестре</div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
