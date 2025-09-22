import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';

export const runtime = 'nodejs';
import { db } from '@/lib/db';
import { notes, tags, noteTags } from '@/lib/schema';
import { eq, and, or, like, inArray } from 'drizzle-orm';

// GET /api/notes - List/search notes
export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q') || '';
    const tag = searchParams.get('tag') || '';

    // Build filter conditions
    const conditions = [eq(notes.userId, session.user.id)];
    
    if (query) {
      conditions.push(like(notes.content, `%${query}%`));
    }

    if (tag) {
      conditions.push(eq(tags.label, tag));
    }

    const userNotes = db
      .select({
        id: notes.id,
        content: notes.content,
        shareId: notes.shareId,
        createdAt: notes.createdAt,
        updatedAt: notes.updatedAt,
        tags: tags.label,
      })
      .from(notes)
      .leftJoin(noteTags, eq(notes.id, noteTags.noteId))
      .leftJoin(tags, eq(noteTags.tagId, tags.id))
      .where(and(...conditions));

    const results = await userNotes;

    // Group notes with their tags
    const notesWithTags = results.reduce((acc: any[], curr) => {
      const existingNote = acc.find(n => n.id === curr.id);
      if (existingNote) {
        if (curr.tags && !existingNote.tags.includes(curr.tags)) {
          existingNote.tags.push(curr.tags);
        }
      } else {
        acc.push({
          id: curr.id,
          content: curr.content,
          shareId: curr.shareId,
          createdAt: curr.createdAt,
          updatedAt: curr.updatedAt,
          tags: curr.tags ? [curr.tags] : [],
        });
      }
      return acc;
    }, []);

    return NextResponse.json({
      success: true,
      data: notesWithTags,
    });
  } catch (error) {
    console.error('Get notes error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST /api/notes - Create note
export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { content, tags: tagLabels } = await request.json();

    if (!content) {
      return NextResponse.json(
        { success: false, error: 'Content is required' },
        { status: 400 }
      );
    }

    // Create note
    const [newNote] = await db
      .insert(notes)
      .values({
        userId: session.user.id,
        content,
      })
      .returning();

    // Handle tags if provided
    if (tagLabels && Array.isArray(tagLabels) && tagLabels.length > 0) {
      // Insert or get existing tags
      const tagRecords = await Promise.all(
        tagLabels.map(async (label: string) => {
          const normalizedLabel = label.toLowerCase().trim();
          const [existingTag] = await db
            .select()
            .from(tags)
            .where(eq(tags.label, normalizedLabel));

          if (existingTag) {
            return existingTag;
          }

          const [newTag] = await db
            .insert(tags)
            .values({ label: normalizedLabel })
            .returning();
          return newTag;
        })
      );

      // Create note-tag associations
      await db.insert(noteTags).values(
        tagRecords.map(tag => ({
          noteId: newNote.id,
          tagId: tag.id,
        }))
      );
    }

    return NextResponse.json({
      success: true,
      data: {
        ...newNote,
        tags: tagLabels || [],
      },
    });
  } catch (error) {
    console.error('Create note error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}