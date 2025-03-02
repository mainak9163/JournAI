"use client";

import { Badge } from "@/components/tailwind/ui/badge";
import { Button } from "@/components/tailwind/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/tailwind/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/tailwind/ui/carousel";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/tailwind/ui/dialog";
import { Skeleton } from "@/components/tailwind/ui/skeleton";
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { addMonths, eachDayOfInterval, endOfMonth, format, isToday, startOfMonth, subMonths } from "date-fns";
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";
import { JournalCard } from "../components/journal-card";

// Types
interface EntryCount {
  date: string;
  count: number;
}

interface JournalEntry {
  id: string;
  subject: string;
  createdAt: string;
  mood: string;
  color: string;
  status: string;
}

// API Hooks
function useCalendarData(year: number, month: number) {
  return useQuery<EntryCount[]>({
    queryKey: ["calendarData", year, month],
    queryFn: async () => {
      const response = await fetch(`/api/journal/calendar?year=${year}&month=${month}`);
      if (!response.ok) {
        throw new Error("Failed to fetch calendar data");
      }
      const data = await response.json();
      return data.entryCounts;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes cache
  });
}

function useEntriesByDate(date: string | null) {
  return useQuery<JournalEntry[]>({
    queryKey: ["entriesByDate", date],
    queryFn: async () => {
      if (!date) return [];
      const response = await fetch(`/api/journal/by-date?date=${date}`);
      if (!response.ok) {
        throw new Error("Failed to fetch entries");
      }
      const data = await response.json();
      return data.entries;
    },
    enabled: !!date, // Only run query when date is provided
    staleTime: 2 * 60 * 1000, // 2 minutes cache
  });
}

// JournalCardSkeleton component
const JournalCardSkeleton = () => (
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
);

export default function JournalCalendar() {
  // State for current month view and selected date
  const [currentDate, setCurrentDate] = useState(new Date(2025, 0, 1)); // Start with Jan 2025
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Get current year and month
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth() + 1; // JavaScript months are 0-indexed

  // Fetch calendar data
  const { data: calendarData, isLoading: isCalendarLoading } = useCalendarData(currentYear, currentMonth);

  // Fetch entries for selected date
  const { data: selectedDateEntries, isLoading: isEntriesLoading } = useEntriesByDate(selectedDate);

  // Generate calendar days for current month
  const firstDayOfMonth = startOfMonth(currentDate);
  const lastDayOfMonth = endOfMonth(currentDate);
  const daysInMonth = eachDayOfInterval({ start: firstDayOfMonth, end: lastDayOfMonth });

  // Format and construct entry counts map
  const entryCountsByDate = new Map<string, number>();
  if (calendarData) {
    calendarData.forEach((entry: EntryCount) => {
      const date = new Date(entry.date);
      const formattedDate = format(date, "yyyy-MM-dd");
      entryCountsByDate.set(formattedDate, entry.count);
    });
  }

  // Navigate to previous month
  const goToPreviousMonth = () => {
    setCurrentDate(subMonths(currentDate, 1));
  };

  // Navigate to next month
  const goToNextMonth = () => {
    setCurrentDate(addMonths(currentDate, 1));
  };

  // Handle date selection
  const handleDateClick = (date: Date) => {
    const formattedDate = format(date, "yyyy-MM-dd");
    const hasEntries = entryCountsByDate.get(formattedDate) || 0;

    if (hasEntries > 0) {
      setSelectedDate(formattedDate);
      setIsDialogOpen(true);
    }
  };

  // Close dialog
  const handleCloseDialog = () => {
    setIsDialogOpen(false);
  };

  return (
    <div className="space-y-4 px-2">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Journal Calendar</CardTitle>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="icon" onClick={goToPreviousMonth}>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <span className="font-medium">{format(currentDate, "MMMM yyyy")}</span>
              <Button variant="outline" size="icon" onClick={goToNextMonth}>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <CardDescription>View your journal entries by date</CardDescription>
        </CardHeader>
        <CardContent>
          {isCalendarLoading ? (
            <div className="grid grid-cols-7 gap-2">
              {Array.from({ length: 31 }).map((_, i) => (
                // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
                <Skeleton key={i} className="h-12 w-full rounded-md" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-7 gap-2 text-center">
              {/* Day headers */}
              {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                <div key={day} className="font-medium text-sm py-1">
                  {day}
                </div>
              ))}

              {/* Calendar grid with empty cells for proper alignment */}
              {Array.from({
                length: firstDayOfMonth.getDay(),
              }).map((_, index) => (
                <div
                  key={`empty-${
                    // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
                    index
                  }`}
                  className="h-12"
                />
              ))}

              {/* Calendar dates */}
              {daysInMonth.map((date) => {
                const formattedDate = format(date, "yyyy-MM-dd");
                const entryCount = entryCountsByDate.get(formattedDate) || 0;
                const isCurrentDate = isToday(date);

                return (
                  <Button
                    key={date.toISOString()}
                    type="button"
                    className={cn(
                      "h-12 w-full relative flex flex-col items-center justify-center p-0",
                      isCurrentDate && "border-primary",
                      entryCount > 0
                        ? "hover:bg-primary/10 cursor-pointer"
                        : "opacity-50 cursor-not-allowed hover:bg-transparent",
                    )}
                    disabled={entryCount === 0}
                    onClick={() => handleDateClick(date)}
                    variant="outline"
                  >
                    <span className={cn("text-sm", isCurrentDate && "font-bold")}>{date.getDate()}</span>
                    {entryCount > 0 && (
                      <Badge variant="secondary" className="absolute top-1 right-1 text-xs px-1 py-0 h-4 min-w-4">
                        {entryCount}
                      </Badge>
                    )}
                  </Button>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Carousel showing 3 months */}
      <Card>
        <CardHeader>
          <CardTitle>Browse Months</CardTitle>
        </CardHeader>
        <CardContent className="w-[90%] mx-auto">
          <Carousel>
            <CarouselContent>
              {[-1, 0, 1, 2].map((offset) => {
                const monthDate = addMonths(new Date(2025, 0, 1), offset);
                return (
                  <CarouselItem key={offset} className="md:basis-1/3">
                    <Card className="h-full">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">{format(monthDate, "MMMM yyyy")}</CardTitle>
                      </CardHeader>
                      <CardContent className="pb-4">
                        <Button variant="outline" className="w-full" onClick={() => setCurrentDate(monthDate)}>
                          <CalendarIcon className="h-4 w-4 mr-2" />
                          View
                        </Button>
                      </CardContent>
                    </Card>
                  </CarouselItem>
                );
              })}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
        </CardContent>
      </Card>

      {/* Dialog for journal entries */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-hidden flex flex-col">
          <DialogHeader>
            <DialogTitle>
              Journal Entries - {selectedDate ? format(new Date(selectedDate), "MMMM d, yyyy") : ""}
              {!isEntriesLoading && selectedDateEntries && (
                <span className="ml-2 text-sm font-normal text-muted-foreground">
                  ({selectedDateEntries.length} {selectedDateEntries.length === 1 ? "entry" : "entries"})
                </span>
              )}
            </DialogTitle>
          </DialogHeader>
          <div className="flex-1 overflow-y-auto pr-2 -mr-2 pt-2">
            <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
              {isEntriesLoading ? (
                // Loading skeletons
                Array.from({ length: 3 }).map((_, index) => (
                  <JournalCardSkeleton
                    key={`skeleton-${
                      // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
                      index
                    }`}
                  />
                ))
              ) : selectedDateEntries && selectedDateEntries.length > 0 ? (
                // Journal cards
                selectedDateEntries.map((journal: JournalEntry) => <JournalCard key={journal.id} journal={journal} />)
              ) : (
                // No entries (should not happen as disabled dates can't be clicked)
                <div className="col-span-2 py-12 text-center text-muted-foreground">
                  No journal entries found for this date.
                </div>
              )}
            </div>
          </div>
          <div className="pt-4 border-t flex justify-end">
            <Button variant="outline" onClick={handleCloseDialog}>
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
