'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';

interface Note {
  id: string;
  content: string;
  shareId: string;
  tags: string[];
}

interface Props {
  noteId: string | null;
}

export function NoteEditor({ noteId }: Props) {
  const [content, setContent] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [note, setNote] = useState<Note | null>(null);
  const router = useRouter();

  useEffect(() => {
    if (noteId && noteId !== 'new') {
      fetchNote();
    }
  }, [noteId]);

  const fetchNote = async () => {
    if (!noteId) return;
    
    try {
      const response = await fetch(`/api/notes/${noteId}`);
      const data = await response.json();
      
      if (data.success) {
        const noteData = data.data;
        setNote(noteData);
        setContent(noteData.content);
        setTags(noteData.tags);
      }
    } catch (error) {
      console.error('Error fetching note:', error);
    }
  };

  const handleSave = async () => {
    if (!content.trim()) {
      alert('Note content cannot be empty');
      return;
    }

    setLoading(true);

    try {
      const isNew = !noteId || noteId === 'new';
      const url = isNew ? '/api/notes' : `/api/notes/${noteId}`;
      const method = isNew ? 'POST' : 'PUT';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content,
          tags,
        }),
      });

      const data = await response.json();

      if (data.success) {
        if (isNew) {
          router.push('/dashboard');
        } else {
          setNote(data.data);
          alert('Note updated successfully!');
        }
      } else {
        alert(data.error || 'Failed to save note');
      }
    } catch (error) {
      console.error('Error saving note:', error);
      alert('An error occurred while saving');
    } finally {
      setLoading(false);
    }
  };

  const addTag = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && tagInput.trim()) {
      e.preventDefault();
      const newTag = tagInput.trim().toLowerCase();
      if (!tags.includes(newTag)) {
        setTags([...tags, newTag]);
      }
      setTagInput('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const copyShareLink = () => {
    if (!note?.shareId) return;
    
    const shareUrl = `${window.location.origin}/share/${note.shareId}`;
    navigator.clipboard.writeText(shareUrl);
    alert('Share link copied to clipboard!');
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">
            {noteId === 'new' || !noteId ? 'Create New Note' : 'Edit Note'}
          </h1>
          
          {note && (
            <Button
              variant="outline"
              onClick={copyShareLink}
            >
              Copy Share Link
            </Button>
          )}
        </div>

        <div className="space-y-6">
          {/* Content Editor */}
          <div>
            <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-2">
              Note Content
            </label>
            <textarea
              id="content"
              rows={12}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Write your idea here..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
          </div>

          {/* Tags */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tags
            </label>
            
            <div className="flex flex-wrap gap-2 mb-2">
              {tags.map(tag => (
                <span
                  key={tag}
                  className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm flex items-center gap-1"
                >
                  {tag}
                  <button
                    onClick={() => removeTag(tag)}
                    className="text-blue-600 hover:text-blue-800 ml-1"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
            
            <input
              type="text"
              placeholder="Add a tag and press Enter"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={addTag}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Actions */}
          <div className="flex gap-4 pt-4">
            <Button
              onClick={handleSave}
              disabled={loading}
              className="bg-blue-600 text-white hover:bg-blue-700"
            >
              {loading ? 'Saving...' : 'Save Note'}
            </Button>
            
            <Button
              variant="outline"
              onClick={() => router.push('/dashboard')}
            >
              Cancel
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}