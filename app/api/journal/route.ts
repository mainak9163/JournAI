
import { auth } from '@/auth';
import { prisma } from '@/prisma/prisma';
import { getUserIdByEmail } from '@/utils/fetch-user';
import { NextResponse } from 'next/server';


const GEMINI_API_KEY = process.env.GEMINI_KEY;

async function analyzeMoodAndColor(content: string) {
  const response = await fetch(`https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent?key=${GEMINI_API_KEY}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts: [{ text: `Analyze the following journal entry and determine its mood in one word. Also, return a color hex code that best represents the mood:\n\n${content}\n\nResponse format: {"mood": "word", "color": "#RRGGBB"}` }] }],
    }),
  });

  const data = await response.json();
  try {
    return JSON.parse(data.candidates[0].content.parts[0].text);
  } catch (error) {
      console.error(error)
    return { mood: 'neutral', color: '#808080' }; // Fallback
  }
}

// **POST - Create a journal**
export async function POST(req: Request) {
  try {
    const session = await auth();
    if (session?.user) {
      if (session.user.email) {
        //storing the id of the user after fetching from database
        session.user.id = await getUserIdByEmail(session.user.email);
      }
    }

    if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { subject, content } = await req.json();
    if (!subject || !content) return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
      
    if (!session.user.id) return NextResponse.json({ error: 'User ID is missing' }, { status: 400 });

    const { mood, color } = await analyzeMoodAndColor(content);

    const journal = await prisma.journalEntry.create({
      data: {
        userId: session.user.id,
        subject,
        content,
        status: 'PUBLISHED',
        mood,
        color
      },
    });

    return NextResponse.json({ journal }, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// **GET - Fetch all journals for the user**
export async function GET() {
  try {
    const session = await auth();
    if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    if (session?.user) {
      if (session.user.email) {
        //storing the id of the user after fetching from database
        session.user.id = await getUserIdByEmail(session.user.email);
      }
    }
    
    const journals = await prisma.journalEntry.findMany({
      where: { userId: session.user.id },
      select: { id: true, subject: true, createdAt: true, status: true },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ journals }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
