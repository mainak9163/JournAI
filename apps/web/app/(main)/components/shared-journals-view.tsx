import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/tailwind/ui/accordion";
import { User } from "lucide-react";
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

const SharedJournalsView = () => {
  const [groupedJournals, setGroupedJournals] = useState<GroupedJournals[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSharedJournals = async () => {
      try {
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
      <div className="flex justify-center items-center min-h-[200px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-destructive p-4 bg-destructive/10 rounded-md">
        Error loading shared journals: {error}
      </div>
    );
  }

  if (groupedJournals.length === 0) {
    return (
      <div className="text-center text-muted-foreground p-4 bg-muted/50 rounded-md">
        No journals have been shared with you yet.
      </div>
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
