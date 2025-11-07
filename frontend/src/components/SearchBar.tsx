import { Search, Command } from "lucide-react"
import { Input } from "./ui/input"

export function SearchBar() {
  return (
    <div className="relative w-full max-w-md">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
      <Input type="search" placeholder="Поиск документов..." className="pl-10 pr-20 bg-secondary/50 border-border" />
      <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1 text-xs text-muted-foreground">
        <Command className="h-3 w-3" />
        <span>K</span>
      </div>
    </div>
  )
}
