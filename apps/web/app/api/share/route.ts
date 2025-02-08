import { auth } from "@/auth";
import { getUserIdByEmail } from "@/utils/fetch-user";
import { prisma } from "@repo/db";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const session = await auth();

    if (session?.user) {
      if (session.user.email) {
        //storing the id of the user after fetching from database
        session.user.id = await getUserIdByEmail(session.user.email);
      }
    }
    if (!session?.user || !session.user.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { journalId, recipientEmail } = await req.json();
    if (!journalId || !recipientEmail) return NextResponse.json({ error: "Missing fields" }, { status: 400 });

    // Check if the journal exists and belongs to the current user
    const journal = await prisma.journalEntry.findUnique({
      where: { id: journalId, userId: session.user.id },
    });

    if (!journal) return NextResponse.json({ error: "Journal not found or unauthorized" }, { status: 403 });

    // Check if the recipient exists
    const recipient = await prisma.user.findUnique({ where: { email: recipientEmail } });

    if (!recipient) {
      return NextResponse.json({ error: "Recipient not found" }, { status: 404 });
    }

    // Check if already shared
    const existingShare = await prisma.journalShare.findUnique({
      where: { journalId_sharedWithUserId: { journalId, sharedWithUserId: recipient.id } },
    });

    if (existingShare) return NextResponse.json({ error: "Journal already shared with this user" }, { status: 400 });

    // Create the share record
    const share = await prisma.journalShare.create({
      data: {
        journalId,
        sharedByUserId: session.user.id,
        sharedWithUserId: recipient.id,
      },
    });

    return NextResponse.json({ message: "Journal shared successfully", share }, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
