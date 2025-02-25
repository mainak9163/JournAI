import { auth } from "@/auth";
import { analyzeEntryWithAnthropic } from "@/utils/anthropic-integration";
import { getUserIdByEmail } from "@/utils/fetch-user";
import { analyzeEntryWithGemini } from "@/utils/gemini-integration";
import { prisma } from "@repo/db";

import { analyzeEntryWithOpenAI } from "@/utils/openai-integration";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

interface AnalysisData {
  entryId: string;
  userId: string;
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

async function analyzeJournal(entryId: string, userId: string, content: string): Promise<AnalysisData> {
  const cookieStore = await cookies();
  const model = cookieStore.get("model")?.value || "openai";

  let analysis: Partial<AnalysisData> = {};

  if (model === "openai") {
    analysis = await analyzeEntryWithOpenAI(content);
  } else if (model === "anthropic") {
    analysis = await analyzeEntryWithAnthropic(content);
  } else {
    analysis = await analyzeEntryWithGemini(content);
  }

  return {
    entryId,
    userId,
    openness: analysis.openness ?? 50,
    conscientiousness: analysis.conscientiousness ?? 50,
    extraversion: analysis.extraversion ?? 50,
    agreeableness: analysis.agreeableness ?? 50,
    neuroticism: analysis.neuroticism ?? 50,
    mbtiType: analysis.mbtiType || "Unknown",
    mbtiDescription: analysis.mbtiDescription || "No description available.",
    strengths: analysis.strengths || [],
    growthAreas: analysis.growthAreas || [],
    careerSuggestions: analysis.careerSuggestions || [],
  };
}

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await auth();

    if (session?.user) {
      if (session.user.email) {
        //storing the id of the user after fetching from database
        session.user.id = await getUserIdByEmail(session.user.email);
      }
    }

    if (!session?.user || !session.user.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const journal = await prisma.journalEntry.findUnique({
      where: { id: (await params).id, userId: session.user.id },
      select: { content: true },
    });

    if (!journal) return NextResponse.json({ error: "Journal not found" }, { status: 404 });

    // Check if analysis already exists
    const existingAnalysis = await prisma.entryAnalysis.findUnique({
      where: { entryId: (await params).id },
    });

    if (existingAnalysis) {
      return NextResponse.json({ error: "Analysis already exists. Use PATCH to update." }, { status: 400 });
    }

    const analysisData = await analyzeJournal((await params).id, session.user.id, journal.content);

    const savedAnalysis = await prisma.entryAnalysis.create({ data: analysisData });

    return NextResponse.json({ analysis: savedAnalysis }, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await auth();
    if (session?.user) {
      if (session.user.email) {
        //storing the id of the user after fetching from database
        session.user.id = await getUserIdByEmail(session.user.email);
      }
    }
    if (!session?.user || !session.user.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const journal = await prisma.journalEntry.findUnique({
      where: { id: (await params).id, userId: session.user.id },
      select: { content: true },
    });

    if (!journal) return NextResponse.json({ error: "Journal not found" }, { status: 404 });

    // Check if analysis exists
    const existingAnalysis = await prisma.entryAnalysis.findUnique({
      where: { entryId: (await params).id },
    });

    if (!existingAnalysis) {
      return NextResponse.json({ error: "No previous analysis found. Use POST to create." }, { status: 400 });
    }

    const analysisData = await analyzeJournal((await params).id, session.user.id, journal.content);

    const updatedAnalysis = await prisma.entryAnalysis.update({
      where: { entryId: (await params).id },
      data: analysisData,
    });

    return NextResponse.json({ analysis: updatedAnalysis }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await auth();
    if (session?.user) {
      if (session.user.email) {
        //storing the id of the user after fetching from database
        session.user.id = await getUserIdByEmail(session.user.email);
      }
    }

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const analysis = await prisma.entryAnalysis.findUnique({
      where: { entryId: (await params).id, userId: session.user.id },
    });

    if (!analysis) {
      return NextResponse.json({ error: "Analysis not found for this journal entry" }, { status: 404 });
    }

    return NextResponse.json({ analysis }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
