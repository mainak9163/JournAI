"use client";

import { Badge } from "@/components/tailwind/ui/badge";
import { Button } from "@/components/tailwind/ui/button";
import { Card, CardFooter, CardHeader, CardTitle } from "@/components/tailwind/ui/card";
import { motion } from "framer-motion";
import { BarChart2, CalendarIcon, PencilIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export function JournalCard({ journal }) {
  const router = useRouter();

  const handleAnalysisClick = () => {
    if (!journal.analysis) {
      toast.error("Analysis not available. Go to analysis page to create one.", {
        action: {
          label: "Go to Analysis",
          onClick: () => router.push(`/analysis/${journal.id}`),
        },
      });
      return;
    }
    router.push(`/analysis/${journal.analysis.id}`);
  };

  const getMoodColor = () => {
    const alpha = 0.2; // For badge background
    const hexToRgba = (hex) => {
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
            <CardTitle className="line-clamp-1 leading-normal">{journal.subject}</CardTitle>
          </div>
        </CardHeader>

        <CardFooter className="flex flex-col space-y-3 mt-auto">
          <div className="flex items-center text-sm text-muted-foreground w-full">
            <CalendarIcon className="w-4 h-4 mr-2" />
            {new Date(journal.createdAt).toLocaleDateString()}
          </div>

          <div className="flex gap-2 w-full">
            <Button variant="outline" className="flex-1" onClick={() => router.push(`/editor/${journal.id}`)}>
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
    </motion.div>
  );
}
