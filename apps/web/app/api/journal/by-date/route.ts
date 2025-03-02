import { auth } from "@/auth";
import { prisma } from "@repo/db";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const session = await auth();
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const dateStr = searchParams.get("date");

  if (!dateStr) {
    return NextResponse.json({ error: "Date parameter is required" }, { status: 400 });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { id: true },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Parse the date string (expected format: YYYY-MM-DD)
    const [year, month, day] = dateStr.split("-").map((num) => Number.parseInt(num, 10));

    if (Number.isNaN(year) || Number.isNaN(month) || Number.isNaN(day)) {
      return NextResponse.json({ error: "Invalid date format. Use YYYY-MM-DD" }, { status: 400 });
    }

    // Create date range for the IST day in UTC terms
    // IST is UTC+5:30, so:
    // 00:00:00 IST = Previous day 18:30:00 UTC
    const startOfDay = new Date(Date.UTC(year || 2025, month || 1 - 1, day || 1 - 1, 18, 30, 0, 0));

    // 23:59:59.999 IST = Current day 18:29:59.999 UTC
    const endOfDay = new Date(Date.UTC(year || 2025, month || 1 - 1, day, 18, 29, 59, 999));

    // Debug info
    console.log(`Request for IST date: ${dateStr}`);
    console.log(`User ID: ${user.id}`);
    console.log(`UTC date range: ${startOfDay.toISOString()} to ${endOfDay.toISOString()}`);

    // First, let's check if the specific problematic entry exists
    // This is for debugging purposes
    const specificEntry = await prisma.journalEntry.findFirst({
      where: {
        userId: user.id,
        createdAt: new Date("2025-02-27T19:15:06.164Z"),
      },
    });

    console.log(`Specific entry exists: ${!!specificEntry}`);
    if (specificEntry) {
      console.log(`Entry ID: ${specificEntry.id}`);
      console.log(`Entry createdAt: ${specificEntry.createdAt}`);
    }

    // Now let's get the entries with our calculated date range
    const entries = await prisma.journalEntry.findMany({
      where: {
        userId: user.id,
        createdAt: {
          gte: startOfDay,
          lte: endOfDay,
        },
      },
      select: {
        id: true,
        subject: true,
        createdAt: true,
        mood: true,
        color: true,
        status: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    console.log(`Found ${entries.length} entries for the date range`);

    // Format createdAt timestamps to IST for client display
    const entriesWithISTTime = entries.map((entry) => {
      const utcDate = new Date(entry.createdAt);
      // Convert to IST by adding 5 hours and 30 minutes
      const istDate = new Date(utcDate.getTime() + (5 * 60 + 30) * 60 * 1000);

      // Format IST time as a string (for display)
      const istHours = istDate.getHours().toString().padStart(2, "0");
      const istMinutes = istDate.getMinutes().toString().padStart(2, "0");
      const formattedISTTime = `${istHours}:${istMinutes}`;

      return {
        ...entry,
        createdAt: entry.createdAt,
        istTime: istDate.toISOString(),
        formattedTime: formattedISTTime,
      };
    });

    // For debugging, let's try to do a direct query without the timezone logic
    // to see if there are entries on the day in question in UTC time
    const utcDayStart = new Date(Date.UTC(year || 2025, month || 1 - 1, day, 0, 0, 0, 0));
    const utcDayEnd = new Date(Date.UTC(year || 2025, month || 1 - 1, day, 23, 59, 59, 999));

    const utcEntries = await prisma.journalEntry.findMany({
      where: {
        userId: user.id,
        createdAt: {
          gte: utcDayStart,
          lte: utcDayEnd,
        },
      },
      select: {
        id: true,
        createdAt: true,
      },
    });

    console.log(`For comparison - entries in UTC day ${dateStr}: ${utcEntries.length}`);

    // Return all our data including debug info
    return NextResponse.json({
      entries: entriesWithISTTime,
      debug: {
        requestedDate: dateStr,
        istStartOfDay: startOfDay.toISOString(),
        istEndOfDay: endOfDay.toISOString(),
        foundEntriesCount: entries.length,
        specificEntryCheck: !!specificEntry,
        utcDayEntriesCount: utcEntries.length,
      },
    });
  } catch (error) {
    console.error("Failed to fetch entries by date:", error);
    return NextResponse.json(
      {
        error: "Failed to fetch entries",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    );
  }
}
