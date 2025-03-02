"use client";

import { Card, CardFooter, CardHeader } from "@/components/tailwind/ui/card";
import { Input } from "@/components/tailwind/ui/input";
import { Skeleton } from "@/components/tailwind/ui/skeleton";
import { AnimatePresence, motion } from "framer-motion";
import { Search } from "lucide-react";
import { useEffect, useState } from "react";
import { JournalCard } from "../components/journal-card";
import { NewJournalCard } from "../components/new-journal-card";

// Skeleton for journal cards using shadcn components
const JournalCardSkeleton = () => (
  <motion.div
    layout
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    whileHover={{ y: -5 }}
    transition={{ duration: 0.2 }}
  >
    <Card className="h-full flex flex-col overflow-hidden">
      <div className="h-1 w-full bg-primary/20" />
      <CardHeader className="py-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Skeleton className="h-6 w-16 rounded-full" />
            <Skeleton className="h-8 w-8 rounded-full" />
          </div>
          <Skeleton className="h-7 w-3/4" />
        </div>
      </CardHeader>

      <CardFooter className="flex flex-col space-y-3 mt-auto">
        <div className="flex items-center w-full">
          <Skeleton className="h-4 w-4 mr-2 rounded-full" />
          <Skeleton className="h-4 w-24" />
        </div>

        <div className="flex gap-2 w-full">
          <Skeleton className="h-10 flex-1" />
          <Skeleton className="h-10 flex-1" />
        </div>
      </CardFooter>
    </Card>
  </motion.div>
);

export default function JournalsPage() {
  const [journals, setJournals] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchJournals();
  }, []);

  const fetchJournals = async () => {
    setIsLoading(true);
    setError("");

    try {
      const response = await fetch("/api/journal");
      if (!response.ok) {
        throw new Error("Failed to fetch journals");
      }
      const data = await response.json();
      setJournals(data.journals || []);
    } catch (error) {
      console.error("Failed to fetch journals:", error);
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("An unknown error occurred");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const filteredJournals = journals?.filter((journal) =>
    //@ts-expect-error TODO: Fix type for journal
    journal.subject
      ?.toLowerCase()
      .includes(searchTerm.toLowerCase()),
  );

  // Generate skeleton array for loading state - matching grid layout
  const skeletons = Array.from({ length: 6 }, (_, i) => i);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row items-center justify-between mb-8">
        <div className="mb-4 md:mb-0">
          <h1 className="text-4xl font-bold mb-2">Your Journals</h1>
          {!isLoading && (
            <p className="text-muted-foreground text-center md:text-left">
              {journals.length} {journals.length === 1 ? "entry" : "entries"} in your collection
            </p>
          )}
          {isLoading && <Skeleton className="h-5 w-36" />}
        </div>
        <div className="relative w-full max-w-sm">
          <Input
            placeholder="Search journals..."
            className="pr-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            disabled={isLoading}
          />
          <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        </div>
      </div>

      {error && !isLoading && (
        <div className="flex flex-col items-center justify-center py-12">
          <p className="text-red-500 mb-4">Failed to load journals: {error}</p>
          <button
            type="button"
            onClick={fetchJournals}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
          >
            Try Again
          </button>
        </div>
      )}

      <motion.div layout className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {/* Always show NewJournalCard, even during loading for consistent layout */}
        {isLoading ? <Skeleton className="h-64" /> : <NewJournalCard />}

        <AnimatePresence mode="popLayout">
          {isLoading ? (
            // Show skeletons while loading
            skeletons.map((id) => <JournalCardSkeleton key={`skeleton-${id}`} />)
          ) : journals.length === 0 && !searchTerm ? (
            // Show empty state when no journals and not searching
            <motion.div
              layout
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="col-span-full flex flex-col items-center justify-center py-12 text-center"
            >
              <p className="text-xl font-medium mb-2">You don&apos;t have any journals yet</p>
              <p className="text-muted-foreground mb-6">
                Create your first journal by clicking the &quot;New Journal&quot; card
              </p>
            </motion.div>
          ) : filteredJournals.length === 0 && searchTerm ? (
            // Show no search results state
            <motion.div
              layout
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="col-span-full flex flex-col items-center justify-center py-12 text-center"
            >
              <p className="text-xl font-medium mb-2">No journals match your search</p>
              <p className="text-muted-foreground">Try a different search term or clear your search</p>
            </motion.div>
          ) : (
            // Show filtered journals
            //@ts-expect-error TODO: Fix type for journal
            filteredJournals.map((journal) => <JournalCard key={journal.id} journal={journal} />)
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
