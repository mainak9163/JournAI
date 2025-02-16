/* eslint-disable @typescript-eslint/no-explicit-any */
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface SentimentJournalCardProps {
  journal: {
    id: string;
    title: string;
    date: string;
    content: string;
    mood?: string;
    color?: string;
    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
    analysis: any | null;
  };
  isSelected?: boolean;
}

export function SentimentJournalCard({ journal, isSelected }: SentimentJournalCardProps) {
  // Parse content if it's in JSON format
  const jsonContent =
    typeof journal.content === "string" && (journal.content.startsWith("{") || journal.content.includes('type":"doc"'))
      ? JSON.parse(journal.content)
      : { content: [{ content: [{ text: journal.content }] }] };

  // Extract text content if it's in JSON format
  const actualContent =
    typeof jsonContent === "object" && jsonContent.content
      ? jsonContent.content
          // biome-ignore lint/suspicious/noExplicitAny: <explanation>
          .flatMap((block: any) => block.content?.flatMap((inline: any) => inline.text || "").join(" ") || "")
          .join(" ")
      : journal.content;

  // Truncate content for preview
  const truncatedContent = actualContent.length > 100 ? `${actualContent.substring(0, 100)}...` : actualContent;

  // Format date
  const formattedDate = new Date(journal.date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  return (
    <Card
      className={cn(
        "h-full transition-all hover:shadow-md cursor-pointer pt-4",
        isSelected && "ring-2 ring-primary shadow-md",
        journal.color && "border-l-4",
      )}
      style={{ borderLeftColor: journal.color }}
    >
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <h3 className="font-medium text-base line-clamp-1">{journal.title}</h3>
          {journal.analysis ? (
            <Badge variant="outline" className="bg-green-50 text-green-700 hover:bg-green-50">
              Analyzed
            </Badge>
          ) : (
            <Badge variant="outline" className="bg-amber-50 text-amber-700 hover:bg-amber-50">
              Needs Analysis
            </Badge>
          )}
        </div>
        <p className="text-xs text-muted-foreground">{formattedDate}</p>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground line-clamp-3">{truncatedContent}</p>
        {journal.mood && (
          <div className="mt-2">
            <Badge variant="secondary" className="text-xs">
              {journal.mood}
            </Badge>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
