"use client";

import { Alert, AlertDescription, AlertTitle } from "@/components/tailwind/ui/alert";
import { Button } from "@/components/tailwind/ui/button";
import { Checkbox } from "@/components/tailwind/ui/checkbox";
import { DialogTrigger } from "@/components/tailwind/ui/dialog";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/tailwind/ui/dialog";
import { Progress } from "@/components/tailwind/ui/progress";
import { Skeleton } from "@/components/tailwind/ui/skeleton";
import Cookies from "js-cookie";
import { HelpCircle, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import APIKeyGuide from "../components/key-guide";
import { SentimentJournalCard } from "../components/sentiment-journal-card";

interface Journal {
  id: string;
  subject: string;
  createdAt: string;
  content: string;
  mood: string;
  color: string;
  analysis: unknown;
}

// SentimentJournalCardSkeleton component
const SentimentJournalCardSkeleton = () => (
  <div className="relative">
    <Skeleton className="absolute right-4 top-4 h-4 w-4 rounded" />
    <div className="overflow-hidden rounded-lg border">
      <Skeleton className="h-1 w-full" />
      <div className="p-6">
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <Skeleton className="h-5 w-20 rounded-full" />
          </div>
          <Skeleton className="h-6 w-3/4" />
        </div>
        <div className="mt-4 space-y-2">
          <Skeleton className="h-24 w-full" />
        </div>
        <div className="mt-4 flex justify-between items-center">
          <Skeleton className="h-5 w-24" />
          <Skeleton className="h-6 w-6 rounded-full" />
        </div>
      </div>
    </div>
  </div>
);

export default function SentimentPage() {
  const [journals, setJournals] = useState<Journal[]>([]);
  const [selectedJournals, setSelectedJournals] = useState<string[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentAnalyzing, setCurrentAnalyzing] = useState(0);
  const [totalToAnalyze, setTotalToAnalyze] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hasCookies, setHasCookies] = useState(false);
  const [isInitialCheck, setIsInitialCheck] = useState(true);
  const [isFetchingJournals, setIsFetchingJournals] = useState(false);

  // Check cookies for model and apiKey
  useEffect(() => {
    const checkCookies = () => {
      const model = Cookies.get("model");
      const apiKey = Cookies.get("apiKey");

      if (!model || !apiKey) {
        setError("Please set up your API key and model in Settings first");
        setHasCookies(false);
      } else {
        setHasCookies(true);
      }

      setIsInitialCheck(false);
      setLoading(false);
    };

    checkCookies();
  }, []);

  // Fetch journals if cookies are present
  useEffect(() => {
    if (hasCookies && !isInitialCheck) {
      fetchJournals();
    }
  }, [hasCookies, isInitialCheck]);

  const fetchJournals = async () => {
    try {
      setIsFetchingJournals(true);
      const response = await fetch("/api/journal");

      if (!response.ok) {
        throw new Error("Failed to fetch journals");
      }

      const data = await response.json();
      const sortedJournals = data.journals.sort(
        (a: Journal, b: Journal) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      );

      setJournals(sortedJournals);
      setError(null);
    } catch (err) {
      setError("Error fetching journals. Please try again later.");
      console.error(err);
    } finally {
      setIsFetchingJournals(false);
    }
  };

  const handleAnalyze = async () => {
    if (selectedJournals.length === 0) return;

    setIsAnalyzing(true);
    setCurrentAnalyzing(0);
    setTotalToAnalyze(selectedJournals.length);
    setProgress(0);

    for (let i = 0; i < selectedJournals.length; i++) {
      const journalId = selectedJournals[i];
      const journal = journals.find((j) => j.id === journalId);

      try {
        const method = journal?.analysis ? "PATCH" : "POST";
        const response = await fetch(`/api/analyze/${journalId}`, {
          method,
        });

        if (!response.ok) {
          throw new Error(`Failed to analyze journal ${journalId}`);
        }

        setCurrentAnalyzing(i + 1);
        setProgress(Math.round(((i + 1) / selectedJournals.length) * 100));
      } catch (err) {
        console.error(`Error analyzing journal ${journalId}:`, err);
        // Continue with next journal even if one fails
      }
    }

    // Refetch journals to get updated analysis
    await fetchJournals();

    // Reset state
    setIsAnalyzing(false);
    setSelectedJournals([]);
  };

  const toggleJournalSelection = (id: string, checked: boolean) => {
    setSelectedJournals((prev) => (checked ? [...prev, id] : prev.filter((journalId) => journalId !== id)));
  };

  // Skeletons for loading state
  const skeletons = Array.from({ length: 6 }, (_, i) => i);

  if (loading && isInitialCheck) {
    return (
      <div className="flex h-[400px] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!hasCookies) {
    return (
      <div className="flex h-[400px] flex-col items-center justify-center space-y-4 px-3">
        <Alert className="max-w-lg">
          <AlertTitle className="flex items-center gap-2">
            Setup Required
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" size="icon" className="h-8 w-8">
                  <HelpCircle className="h-4 w-4" />
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
                <APIKeyGuide />
              </DialogContent>
            </Dialog>
          </AlertTitle>
          <AlertDescription>
            Please go to Settings page and configure your API key and model to use sentiment analysis.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  if (error && hasCookies && !isFetchingJournals) {
    return (
      <div className="space-y-4 px-3">
        <h2 className="text-3xl font-bold tracking-tight">Sentiment Analysis</h2>
        <Alert variant="destructive">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
        <Button onClick={fetchJournals}>Try Again</Button>
      </div>
    );
  }

  return (
    <div className="space-y-6 px-3">
      <div className="flex flex-col gap-y-2 sm:flex-row items-center justify-between">
        <div className="flex items-center gap-2">
          <h2 className="text-3xl font-bold tracking-tight">Sentiment Analysis</h2>
        </div>
        <Button
          className="w-full sm:w-fit"
          onClick={handleAnalyze}
          disabled={selectedJournals.length === 0 || isAnalyzing || isFetchingJournals}
        >
          {isAnalyzing ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Analyzing...
            </>
          ) : (
            <>Analyze Selected ({selectedJournals.length})</>
          )}
        </Button>
      </div>

      {isFetchingJournals ? (
        // Show skeletons while fetching journals
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {skeletons.map((id) => (
            <SentimentJournalCardSkeleton key={`skeleton-${id}`} />
          ))}
        </div>
      ) : journals.length === 0 ? (
        <div className="flex h-[400px] items-center justify-center rounded-md border border-dashed">
          <p className="text-sm text-muted-foreground">No journals available for sentiment analysis</p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {journals.map((journal) => (
            <div key={journal.id} className="relative">
              <Checkbox
                className="absolute right-4 top-4 z-10"
                checked={selectedJournals.includes(journal.id)}
                onCheckedChange={(checked) => toggleJournalSelection(journal.id, checked as boolean)}
                disabled={isAnalyzing}
              />
              <SentimentJournalCard
                journal={{
                  ...journal,
                  title: journal.subject,
                  date: new Date(journal.createdAt).toLocaleDateString(),
                }}
              />
            </div>
          ))}
        </div>
      )}

      <Dialog open={isAnalyzing} onOpenChange={(open) => open || setIsAnalyzing(false)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Analyzing Journals</DialogTitle>
            <DialogDescription>
              Processing {currentAnalyzing} of {totalToAnalyze} journals...
            </DialogDescription>
          </DialogHeader>
          <Progress value={progress} className="w-full" />
          <p className="text-center text-sm text-muted-foreground">{progress}% Complete</p>
        </DialogContent>
      </Dialog>
    </div>
  );
}
