import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/tailwind/ui/accordion";
import { Alert, AlertDescription, AlertTitle } from "@/components/tailwind/ui/alert";
import { Skeleton } from "@/components/tailwind/ui/skeleton";
import { AlertCircle, User } from "lucide-react";
import { useEffect, useState } from "react";
import { JournalCard } from "./journal-card";

interface Analysis {
  id: string;
  openness: number;
  conscientiousness: number;
  extraversion: number;
  agreeableness: number;
  neuroticism: number;
  mbtiType: string;
  mbtiDescription: string;
  strengths: string[];
  growthAreas: string[];
  careerSuggestions: string[];
}

interface JournalWithPermissions {
  allowEdit: boolean;
  allowViewAnalysis: boolean;
  journal: Journal;
}

interface Journal {
  id: string;
  subject: string;
  content: string;
  mood: string;
  color: string;
  createdAt: string;
  analysis?: Analysis;
}

interface SharedJournal {
  sharedBy: string;
  journal: Journal;
  allowEdit: boolean;
  allowViewAnalysis: boolean;
}

interface GroupedJournals {
  sharedBy: string;
  journals: JournalWithPermissions[];
}

// Skeleton component for journal cards
const JournalCardSkeleton = () => (
  <div className="border rounded-lg overflow-hidden flex flex-col bg-background">
    <div className="p-4 border-b">
      <Skeleton className="h-6 w-3/4 mb-2" />
      <div className="flex justify-between items-center">
        <Skeleton className="h-4 w-20" />
        <Skeleton className="h-4 w-16" />
      </div>
    </div>
    <div className="p-4 flex-1">
      <Skeleton className="h-4 w-full mb-2" />
      <Skeleton className="h-4 w-full mb-2" />
      <Skeleton className="h-4 w-3/4" />
    </div>
    <div className="p-4 border-t flex justify-end gap-2">
      <Skeleton className="h-9 w-9 rounded-md" />
      <Skeleton className="h-9 w-9 rounded-md" />
      <Skeleton className="h-9 w-9 rounded-md" />
    </div>
  </div>
);

// Skeleton for accordion groups
const GroupSkeleton = () => (
  <>
    {Array.from({ length: 3 }).map((_, index) => (
      // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
      <div key={index} className="border border-border bg-card rounded-lg px-4">
        <div className="py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-card-foreground">
              <User className="h-4 w-4" />
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-4 w-16 ml-2" />
            </div>
            <Skeleton className="h-4 w-4 rounded-full" />
          </div>
        </div>

        {/* Show expanded content for the first accordion */}
        {index === 0 && (
          <div className="pb-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
              {Array.from({ length: 3 }).map((_, cardIndex) => (
                // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
                <JournalCardSkeleton key={cardIndex} />
              ))}
            </div>
          </div>
        )}
      </div>
    ))}
  </>
);

const SharedJournalsView = () => {
  const [groupedJournals, setGroupedJournals] = useState<GroupedJournals[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSharedJournals = async () => {
      try {
        // Add a small delay to simulate network latency
        setLoading(true);

        const response = await fetch("/api/shared-journals");
        if (!response.ok) throw new Error("Failed to fetch shared journals");

        const journals: SharedJournal[] = await response.json();

        // Group journals by sharedBy
        const grouped = journals.reduce<GroupedJournals[]>((acc: GroupedJournals[], curr: SharedJournal) => {
          const existingGroup = acc.find((g) => g.sharedBy === curr.sharedBy);
          if (existingGroup) {
            existingGroup.journals.push({
              journal: curr.journal,
              allowEdit: curr.allowEdit,
              allowViewAnalysis: curr.allowViewAnalysis,
            });
          } else {
            acc.push({
              sharedBy: curr.sharedBy,
              journals: [
                { journal: curr.journal, allowEdit: curr.allowEdit, allowViewAnalysis: curr.allowViewAnalysis },
              ],
            });
          }
          return acc;
        }, []);

        setGroupedJournals(grouped);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchSharedJournals();
  }, []);

  if (loading) {
    return (
      <div className="w-full space-y-4">
        <GroupSkeleton />
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>Failed to load shared journals: {error}</AlertDescription>
      </Alert>
    );
  }

  if (groupedJournals.length === 0) {
    return (
      <Alert>
        <AlertTitle>No shared journals</AlertTitle>
        <AlertDescription>No one remembers you yet.</AlertDescription>
      </Alert>
    );
  }

  return (
    <Accordion type="single" collapsible className="w-full space-y-4">
      {groupedJournals.map((group) => (
        <AccordionItem
          value={`item-${group.sharedBy}`}
          key={group.sharedBy}
          className="border border-border bg-card rounded-lg px-4"
        >
          <AccordionTrigger className="hover:no-underline">
            <div className="flex items-center gap-2 text-card-foreground">
              <User className="h-4 w-4" />
              <span>{group.sharedBy}</span>
              <span className="text-muted-foreground ml-2">
                ({group.journals.length} {group.journals.length === 1 ? "journal" : "journals"})
              </span>
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
              {group.journals.map((journ) => (
                <JournalCard
                  key={journ.journal.id}
                  journal={journ.journal}
                  shared={true}
                  allowEdit={journ.allowEdit}
                  allowViewAnalysis={journ.allowViewAnalysis}
                />
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
};

export default SharedJournalsView;
