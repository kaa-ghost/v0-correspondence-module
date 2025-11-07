export function AssignmentTree({ onSelectAssignment }: { onSelectAssignment: (id: string) => void }) {
  return (
    <div className="flex-1 p-6">
      <h2 className="text-2xl font-bold mb-4">Иерархия поручений</h2>
      <p className="text-muted-foreground">Древовидное представление поручений в разработке...</p>
    </div>
  )
}
