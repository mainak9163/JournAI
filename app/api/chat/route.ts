
import { auth } from '@/auth'
import { prisma } from '@/prisma/prisma'
import { qaWithAnthropic } from '@/utils/anthropic-integration'
import { qaWithGemini } from '@/utils/gemini-intergation'
import { qaWithOpenAI } from '@/utils/openai-integration'

import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export const POST = async (request: Request) => {
  try {
    // Parse the request payload
    const { question } = await request.json()

    // Get the current session and user
    const session = await auth()
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const user = session.user

    // Fetch the user's journal entries from the database
    const entries = await prisma.journalEntry.findMany({
      where: {
        userId: user.id,
      },
      select: {
        id: true,
        content: true,
      },
    })

    if (!entries.length) {
      return NextResponse.json({ error: 'No journal entries found.' }, { status: 404 })
    }

    // Get model and API key from cookies
    const cookieStore =await cookies()
    const model = cookieStore.get('model')?.value
    const apiKey = cookieStore.get('apiKey')?.value

    if (!model || !apiKey) {
      return NextResponse.json(
        { error: 'Model or API key not provided in cookies.' },
        { status: 400 }
      )
    }

    // Dynamically select the appropriate model
    let qaFunction
    switch (model) {
      case 'openai':
        qaFunction = qaWithOpenAI
        break
      case 'anthropic':
        qaFunction = qaWithAnthropic
        break
      case 'gemini':
        qaFunction = qaWithGemini
        break
      default:
        return NextResponse.json({ error: 'Invalid model selected.' }, { status: 400 })
    }

    // Call the respective `qa` function
    const answer = await qaFunction(question, entries)

    return NextResponse.json({ data: answer })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Something went wrong.' }, { status: 500 })
  }
}
