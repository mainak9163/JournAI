import { Skeleton } from "@/components/tailwind/ui/skeleton";

export default function SentimentPageLoading() {
  // Create an array of skeleton cards
  const skeletonCards = Array.from({ length: 6 }, (_, i) => i);

  return (
    <div className="space-y-6 px-3">
      <div className="flex flex-col gap-y-2 sm:flex-row items-center justify-between">
        <div className="flex items-center gap-2">
          <Skeleton className="h-9 w-64" />
        </div>
        <Skeleton className="h-10 w-40 sm:w-48" />
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {skeletonCards.map((id) => (
          <div key={id} className="relative">
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
        ))}
      </div>
    </div>
  );
}
