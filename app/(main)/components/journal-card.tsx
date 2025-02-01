import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { format } from "date-fns"

interface Journal {
  id: number
  title: string
  date: string
  content: string
  sentimentAnalysis: string | null
}

export function JournalCard({ journal }: { journal: Journal }) {
  return (
    <Card>
      <CardHeader className="space-y-1">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">{journal.title}</CardTitle>
          {journal.sentimentAnalysis && <Badge>{journal.sentimentAnalysis}</Badge>}
        </div>
        <p className="text-sm text-muted-foreground">{format(new Date(journal.date), "PPP")}</p>
      </CardHeader>
      <CardContent>
        <p className="line-clamp-3 text-sm text-muted-foreground">{journal.content}</p>
      </CardContent>
    </Card>
  )
}

