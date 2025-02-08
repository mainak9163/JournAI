import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { JournalCard } from "../components/journal-card"

const dummyJournals = [
  {
    id: 1,
    title: "A great day",
    date: "2024-01-25",
    content: "Today was amazing...",
    sentimentAnalysis: "positive",
  },
  {
    id: 2,
    title: "Feeling thoughtful",
    date: "2024-01-24",
    content: "Reflecting on life...",
    sentimentAnalysis: null,
  },
  // Add more dummy journals...
]

export default function JournalsPage() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Your Journals</h2>
        <Input placeholder="Search by title..." className="max-w-sm" />
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {dummyJournals.map((journal) => (
          <JournalCard key={journal.id} journal={journal} />
        ))}
      </div>
      <div className="flex justify-center">
        <Button variant="outline">Load more</Button>
      </div>
    </div>
  )
}

