import {
  HoverCard,
  HoverCardTrigger,
  HoverCardContent,
} from "@/components/ui/hover-card"
import { Info } from "lucide-react"

interface TextHoverCardProps {
  text: string
  limit?: number
}

export function TextHoverCard({ text, limit = 30 }: TextHoverCardProps) {
  const isLong = text.length > limit
  const display = isLong ? text.slice(0, limit) + "…" : text

  if (!isLong) {
    return <span>{text}</span>
  }

  return (
    <HoverCard>
      <HoverCardTrigger asChild>
        <div className="flex items-center gap-1 cursor-pointer">
          <Info className="h-4 w-4 text-muted-foreground" />
          <span>{display}</span>
        </div>
      </HoverCardTrigger>
      <HoverCardContent side="top" align="start" className="max-w-xs p-3">
        <p className="break-words">{text}</p>
      </HoverCardContent>
    </HoverCard>
  )
}