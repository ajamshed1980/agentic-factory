import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export const runtime = 'nodejs';
import { notes, tags, noteTags } from '@/lib/schema';
import { eq } from 'drizzle-orm';

interface Context {
  params: { shareId: string };
}

// GET /api/shared/[shareId] - Get public note by share ID
export async function GET(request: NextRequest, { params }: Context) {
  try {
    const [note] = await db
      .select({
        id: notes.id,
        content: notes.content,
        createdAt: notes.createdAt,
        updatedAt: notes.updatedAt,
      })
      .from(notes)
      .where(eq(notes.shareId, params.shareId));

    if (!note) {
      return NextResponse.json(
        { success: false, error: 'Note not found' },
        { status: 404 }
      );
    }

    // Get tags for this note
    const noteTagsData = await db
      .select({ label: tags.label })
      .from(tags)
      .innerJoin(noteTags, eq(tags.id, noteTags.tagId))
      .where(eq(noteTags.noteId, note.id));

    return NextResponse.json({
      success: true,
      data: {
        ...note,
        tags: noteTagsData.map(nt => nt.label),
      },
    });
  } catch (error) {
    console.error('Get shared note error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}