import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';

export const runtime = 'nodejs';
import { db } from '@/lib/db';
import { notes, tags, noteTags } from '@/lib/schema';
import { eq, and } from 'drizzle-orm';

interface Context {
  params: { id: string };
}

// GET /api/notes/[id] - Get specific note
export async function GET(request: NextRequest, { params }: Context) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const [note] = await db
      .select({
        id: notes.id,
        content: notes.content,
        shareId: notes.shareId,
        createdAt: notes.createdAt,
        updatedAt: notes.updatedAt,
        userId: notes.userId,
      })
      .from(notes)
      .where(and(eq(notes.id, params.id), eq(notes.userId, session.user.id)));

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
    console.error('Get note error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PUT /api/notes/[id] - Update note
export async function PUT(request: NextRequest, { params }: Context) {
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

    // Verify note belongs to user
    const [existingNote] = await db
      .select()
      .from(notes)
      .where(and(eq(notes.id, params.id), eq(notes.userId, session.user.id)));

    if (!existingNote) {
      return NextResponse.json(
        { success: false, error: 'Note not found' },
        { status: 404 }
      );
    }

    // Update note content
    const [updatedNote] = await db
      .update(notes)
      .set({
        content,
        updatedAt: new Date(),
      })
      .where(eq(notes.id, params.id))
      .returning();

    // Handle tags update
    if (tagLabels && Array.isArray(tagLabels)) {
      // Remove existing tags
      await db.delete(noteTags).where(eq(noteTags.noteId, params.id));

      if (tagLabels.length > 0) {
        // Insert or get new tags
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

        // Create new note-tag associations
        await db.insert(noteTags).values(
          tagRecords.map(tag => ({
            noteId: params.id,
            tagId: tag.id,
          }))
        );
      }
    }

    return NextResponse.json({
      success: true,
      data: {
        ...updatedNote,
        tags: tagLabels || [],
      },
    });
  } catch (error) {
    console.error('Update note error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE /api/notes/[id] - Delete note
export async function DELETE(request: NextRequest, { params }: Context) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Verify note belongs to user
    const [existingNote] = await db
      .select()
      .from(notes)
      .where(and(eq(notes.id, params.id), eq(notes.userId, session.user.id)));

    if (!existingNote) {
      return NextResponse.json(
        { success: false, error: 'Note not found' },
        { status: 404 }
      );
    }

    // Delete note (cascade will handle note_tags)
    await db.delete(notes).where(eq(notes.id, params.id));

    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    console.error('Delete note error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}