import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { JournalCard } from "../components/journal-card"


const sharedJournals = [
  {
    email: "friend@example.com",
    journals: [
      {
        id: 1,
        title: "Shared Memory",
        date: "2024-01-25",
        content: "A wonderful day...",
        sentimentAnalysis: "positive",
      },
    ],
  },
  {
    email: "family@example.com",
    journals: [
      {
        id: 2,
        title: "Family Gathering",
        date: "2024-01-24",
        content: "Today we had...",
        sentimentAnalysis: "positive",
      },
    ],
  },
]

export default function SharedPage() {
  return (
    <div className="space-y-4">
      <h2 className="text-3xl font-bold tracking-tight">Shared Journals</h2>

      {sharedJournals.length === 0 ? (
        <div className="flex h-[400px] items-center justify-center rounded-md border border-dashed">
          <p className="text-sm text-muted-foreground">No journals have been shared with you yet</p>
        </div>
      ) : (
        <Accordion type="single" collapsible className="w-full">
          {sharedJournals.map((share, index) => (
            <AccordionItem key={index} value={`item-${index}`}>
              <AccordionTrigger className="text-lg">{share.email}</AccordionTrigger>
              <AccordionContent>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {share.journals.map((journal) => (
                    <JournalCard key={journal.id} journal={journal} />
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      )}
    </div>
  )
}

