"use client";

import { Input } from "@/components/tailwind/ui/input";
import { AnimatePresence, motion } from "framer-motion";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { JournalCard } from "../components/journal-card";
import { NewJournalCard } from "../components/new-journal-card";

export default function JournalsPage() {
  const [journals, setJournals] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchJournals();
  }, []);

  const fetchJournals = async () => {
    try {
      const response = await fetch("/api/journal");
      const data = await response.json();
      setJournals(data.journals);
    } catch (error) {
      console.error("Failed to fetch journals:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredJournals = journals?.filter((journal) =>
    //@ts-expect-error journal type needs to be made TODO
    journal.subject
      .toLowerCase()
      .includes(searchTerm.toLowerCase()),
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row items-center justify-between mb-8">
        <div className="mb-4 md:mb-0">
          <h1 className="text-4xl font-bold mb-2">Your Journals</h1>
          <p className="text-muted-foreground text-center md:text-justify">
            {journals.length} entries in your collection
          </p>
        </div>
        <Input
          placeholder="Search journals..."
          className="max-w-sm"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="flex flex-col items-center gap-2">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-sm text-muted-foreground">Loading your journals...</p>
          </div>
        </div>
      ) : (
        <motion.div layout className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          <NewJournalCard />
          <AnimatePresence mode="popLayout">
            {filteredJournals.map((journal) => (
              //@ts-expect-error journal type needs to be made TODO
              <JournalCard key={journal.id} journal={journal} />
            ))}
          </AnimatePresence>
        </motion.div>
      )}
    </div>
  );
}
