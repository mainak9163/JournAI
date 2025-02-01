
import { auth } from '@/auth';
import { prisma } from '@/prisma/prisma';
import { NextResponse } from 'next/server';

export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    const session = await auth();
    if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const journal = await prisma.journalEntry.findUnique({
      where: { id: params.id, userId: session.user.id },
    });

    if (!journal) return NextResponse.json({ error: 'Journal not found' }, { status: 404 });

    return NextResponse.json({ journal }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  try {
    const session = await auth();
    if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { subject, content, status } = await req.json();

    const updatedJournal = await prisma.journalEntry.update({
      where: { id: params.id, userId: session.user.id },
      data: { subject, content, status },
    });

    return NextResponse.json({ journal: updatedJournal }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    const session = await auth();
    if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    await prisma.journalEntry.delete({
      where: { id: params.id, userId: session.user.id },
    });

    return NextResponse.json({ message: 'Journal deleted' }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
