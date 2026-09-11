import { NextRequest, NextResponse } from 'next/server';
import { generateRagAnswer } from '@/lib/rag/generator';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { message, history } = body;

    if (!message || typeof message !== 'string' || !message.trim()) {
      return NextResponse.json(
        { error: 'Message query is required' },
        { status: 400 }
      );
    }

    const ragResult = await generateRagAnswer(message.trim(), history || []);

    return NextResponse.json({
      success: true,
      query: message.trim(),
      answer: ragResult.answer,
      relevantPages: ragResult.relevantPages,
      suggestedQuestions: ragResult.suggestedQuestions,
    });
  } catch (err) {
    console.error('API /api/chat error:', err);
    return NextResponse.json(
      { error: 'Failed to process RAG query' },
      { status: 500 }
    );
  }
}
