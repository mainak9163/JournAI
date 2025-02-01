"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Progress } from "@/components/ui/progress"
import { JournalCard } from "../components/journal-card"


const journalsWithoutSentiment = [
  {
    id: 1,
    title: "Untitled Entry",
    date: "2024-01-25",
    content: "Need to analyze this...",
    sentimentAnalysis: null,
  },
  // Add more journals...
]

export default function SentimentPage() {
  const [selectedJournals, setSelectedJournals] = useState<number[]>([])
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [progress, setProgress] = useState(0)

  const handleAnalyze = () => {
    setIsAnalyzing(true)
    // Simulate progress
    let currentProgress = 0
    const interval = setInterval(() => {
      currentProgress += 10
      setProgress(currentProgress)
      if (currentProgress >= 100) {
        clearInterval(interval)
        setIsAnalyzing(false)
        setProgress(0)
      }
    }, 500)
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Sentiment Analysis</h2>
        <Button onClick={handleAnalyze} disabled={selectedJournals.length === 0}>
          Analyze Selected
        </Button>
      </div>

      {journalsWithoutSentiment.length === 0 ? (
        <div className="flex h-[400px] items-center justify-center rounded-md border border-dashed">
          <p className="text-sm text-muted-foreground">No journals need sentiment analysis</p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {journalsWithoutSentiment.map((journal) => (
            <div key={journal.id} className="relative">
              <Checkbox
                className="absolute right-4 top-4 z-10"
                checked={selectedJournals.includes(journal.id)}
                onCheckedChange={(checked:boolean) => {
                  setSelectedJournals(
                    checked ? [...selectedJournals, journal.id] : selectedJournals.filter((id) => id !== journal.id),
                  )
                }}
              />
              <JournalCard journal={journal} />
            </div>
          ))}
        </div>
      )}

      <Dialog open={isAnalyzing} onOpenChange={setIsAnalyzing}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Analyzing Journals</DialogTitle>
            <DialogDescription>Please wait while we analyze your selected journals...</DialogDescription>
          </DialogHeader>
          <Progress value={progress} className="w-full" />
          <p className="text-center text-sm text-muted-foreground">{progress}% Complete</p>
        </DialogContent>
      </Dialog>
    </div>
  )
}

