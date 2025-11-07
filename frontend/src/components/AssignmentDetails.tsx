export function AssignmentDetails({ assignmentId }: { assignmentId: string }) {
  return (
    <div className="w-96 border-l p-6">
      <h3 className="font-semibold mb-4">Детали поручения</h3>
      <p className="text-muted-foreground">ID: {assignmentId}</p>
    </div>
  )
}
