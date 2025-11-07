export function CalendarView({
  type,
  onSelectItem,
}: { type: "documents" | "assignments"; onSelectItem: (id: string) => void }) {
  return (
    <div className="flex-1 p-6">
      <h2 className="text-2xl font-bold mb-4">Календарь {type === "documents" ? "документов" : "поручений"}</h2>
      <p className="text-muted-foreground">Календарное представление в разработке...</p>
    </div>
  )
}
