import { auth } from "@/auth";
import { prisma } from "@repo/db";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const session = await auth();
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const year = Number.parseInt(searchParams.get("year") || "2025");
  const month = Number.parseInt(searchParams.get("month") || "1");

  try {
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { id: true },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Create date range for IST timezone
    // For IST (UTC+5:30), we need to adjust our UTC dates
    // First day of the month at 00:00:00.000 IST = previous day 18:30:00.000 UTC
    const startDate = new Date(Date.UTC(year, month - 1, 1, -5, -30, 0, 0));
    // Last day of the month at 23:59:59.999 IST = last day 18:29:59.999 UTC of next day
    const endDate = new Date(Date.UTC(year, month, 0, 18, 29, 59, 999));

    // Get all entries for the month
    const entries = await prisma.journalEntry.findMany({
      where: {
        userId: user.id,
        createdAt: {
          gte: startDate,
          lte: endDate,
        },
      },
      select: {
        createdAt: true,
      },
    });

    // Process the entries to get counts by day in IST timezone
    const entryCounts = entries.reduce(
      (acc, entry) => {
        // Convert UTC timestamp to IST (UTC+5:30)
        const utcDate = new Date(entry.createdAt);

        // Calculate IST time by adding 5 hours and 30 minutes to UTC
        const istDate = new Date(utcDate.getTime() + (5 * 60 + 30) * 60 * 1000);

        // Format date to YYYY-MM-DD using IST date components
        const year = istDate.getFullYear();
        const month = String(istDate.getMonth() + 1).padStart(2, "0");
        const day = String(istDate.getDate()).padStart(2, "0");
        const dateKey = `${year}-${month}-${day}`;

        // Increment count for this date
        if (!acc[dateKey]) {
          acc[dateKey] = {
            date: dateKey,
            count: 1,
          };
        } else {
          acc[dateKey].count++;
        }

        return acc;
      },
      {} as Record<string, { date: string; count: number }>,
    );

    return NextResponse.json({
      entryCounts: Object.values(entryCounts),
    });
  } catch (error) {
    console.error("Failed to fetch calendar data:", error);
    return NextResponse.json({ error: "Failed to fetch calendar data" }, { status: 500 });
  }
}
