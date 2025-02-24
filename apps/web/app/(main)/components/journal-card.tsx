"use client";

import { Badge } from "@/components/tailwind/ui/badge";
import { Button } from "@/components/tailwind/ui/button";
import { Card, CardFooter, CardHeader, CardTitle } from "@/components/tailwind/ui/card";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/tailwind/ui/dialog";
import { Input } from "@/components/tailwind/ui/input";
import { Label } from "@/components/tailwind/ui/label";
import { ScrollArea } from "@/components/tailwind/ui/scroll-area";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/tailwind/ui/tooltip";
import { motion } from "framer-motion";
import { BarChart2, CalendarIcon, PencilIcon, Share2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import PersonalityAnalysis from "./personality-analysis";

//@ts-expect-error journal with analysis type needs to be added TODO
export function JournalCard({ journal, shared = false }) {
  const [analysisOpen, setAnalysisOpen] = useState(false);
  const [shareDialogOpen, setShareDialogOpen] = useState(false);
  const [recipientEmail, setRecipientEmail] = useState("");
  const [isSharing, setIsSharing] = useState(false);
  const router = useRouter();

  const handleAnalysisClick = () => {
    if (!journal.analysis) {
      let errorMessage = "";
      if (shared) errorMessage = "Analysis not available.";
      else errorMessage = "Analysis not available. Go to analysis page to create one.";

      toast.error(errorMessage, {
        action: {
          label: "Go to Analysis",
          onClick: () => router.push(`/analysis/${journal.id}`),
        },
      });
      return;
    }
    setAnalysisOpen(true);
    // router.push(`/analysis/${journal.analysis.id}`);
  };

  const handleShareJournal = async () => {
    if (!recipientEmail) {
      toast.error("Please enter a valid email address");
      return;
    }

    setIsSharing(true);

    try {
      const response = await fetch("/api/share", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          journalId: journal.id,
          recipientEmail,
        }),
      });

      if (response.ok) {
        toast.success(`Journal successfully shared with ${recipientEmail}`);
        setShareDialogOpen(false);
        setRecipientEmail("");
      } else {
        const error = await response.json();
        toast.error(error.message || "Failed to share journal");
      }
    } catch (error) {
      toast.error("Error sharing journal. Please try again.");
      console.error("Share error:", error);
    } finally {
      setIsSharing(false);
    }
  };

  const getMoodColor = () => {
    const alpha = 0.2; // For badge background
    const hexToRgba = (hex: string) => {
      const r = Number.parseInt(hex.slice(1, 3), 16);
      const g = Number.parseInt(hex.slice(3, 5), 16);
      const b = Number.parseInt(hex.slice(5, 7), 16);
      return `rgba(${r}, ${g}, ${b}, ${alpha})`;
    };
    return {
      background: hexToRgba(journal.color),
      border: journal.color,
      text: journal.color,
    };
  };

  const moodColors = getMoodColor();

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      whileHover={{ y: -5 }}
      transition={{ duration: 0.2 }}
    >
      <Card className="h-full flex flex-col overflow-hidden">
        <div className="h-1 w-full" style={{ backgroundColor: journal.color }} />
        <CardHeader className="py-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Badge
                variant="outline"
                style={{
                  backgroundColor: moodColors.background,
                  borderColor: moodColors.border,
                  color: moodColors.text,
                }}
              >
                {journal.mood}
              </Badge>

              {!shared && (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setShareDialogOpen(true)}>
                        <Share2 className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Share Journal</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}
            </div>
            <CardTitle className="line-clamp-1 leading-normal">{journal.subject}</CardTitle>
          </div>
        </CardHeader>

        <CardFooter className="flex flex-col space-y-3 mt-auto">
          <div className="flex items-center text-sm text-muted-foreground w-full">
            <CalendarIcon className="w-4 h-4 mr-2" />
            {new Date(journal.createdAt).toLocaleDateString()}
          </div>

          <div className="flex gap-2 w-full">
            <Button variant="outline" className="flex-1" onClick={() => router.push(`/editor?entryId=${journal.id}`)}>
              <PencilIcon className="w-4 h-4 mr-2" />
              Edit
            </Button>
            <Button variant="outline" className="flex-1" onClick={handleAnalysisClick}>
              <BarChart2 className="w-4 h-4 mr-2" />
              Analysis
            </Button>
          </div>
        </CardFooter>
      </Card>

      {/* Analysis Dialog */}
      <Dialog open={analysisOpen} onOpenChange={setAnalysisOpen}>
        <DialogContent className="max-w-3xl h-[80vh] overflow-y-auto">
          <ScrollArea className="mt-3">
            <PersonalityAnalysis analysis={journal.analysis} />
          </ScrollArea>
        </DialogContent>
      </Dialog>

      {/* Share Dialog */}
      <Dialog open={shareDialogOpen} onOpenChange={setShareDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Share Journal</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="email">Recipient Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter recipient's email"
                value={recipientEmail}
                onChange={(e) => setRecipientEmail(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" disabled={isSharing} onClick={handleShareJournal}>
              {isSharing ? (
                <>
                  <span className="mr-2">Sharing...</span>
                  <svg
                    className="animate-spin h-4 w-4"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <title>Loading spinner</title>
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                </>
              ) : (
                "Share"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
}
