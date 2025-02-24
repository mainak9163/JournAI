import { auth } from "@/auth";
import { getUserIdByEmail } from "@/utils/fetch-user";
import { prisma } from "@repo/db";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const session = await auth();

    if (session?.user) {
      if (session.user.email) {
        session.user.id = await getUserIdByEmail(session.user.email);
      }
    }
    if (!session?.user || !session.user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Fetch all journals shared with the current user
    const sharedJournals = await prisma.journalShare.findMany({
      where: {
        sharedWithUserId: session.user.id,
      },
      include: {
        journal: true,
        sharedByUser: {
          select: {
            email: true,
          },
        },
      },
    });

    // Transform the data to match the requested format
    const formattedJournals = sharedJournals.map((share) => ({
      journal: share.journal,
      sharedBy: share.sharedByUser.email,
    }));

    return NextResponse.json(formattedJournals, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
