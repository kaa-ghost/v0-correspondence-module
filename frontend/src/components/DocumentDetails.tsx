export function DocumentDetails({ documentId }: { documentId: string }) {
  return (
    <div className="w-96 border-l p-6">
      <h3 className="font-semibold mb-4">Детали документа</h3>
      <p className="text-muted-foreground">ID: {documentId}</p>
    </div>
  )
}
