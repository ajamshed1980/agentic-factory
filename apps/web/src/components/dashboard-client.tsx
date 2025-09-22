'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';

interface Note {
  id: string;
  content: string;
  shareId: string;
  createdAt: string;
  updatedAt: string;
  tags: string[];
}

export function DashboardClient() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNotes();
  }, [searchQuery, selectedTag]);

  const fetchNotes = async () => {
    try {
      const params = new URLSearchParams();
      if (searchQuery) params.append('q', searchQuery);
      if (selectedTag) params.append('tag', selectedTag);
      
      const response = await fetch(`/api/notes?${params}`);
      const data = await response.json();
      
      if (data.success) {
        setNotes(data.data);
      }
    } catch (error) {
      console.error('Error fetching notes:', error);
    } finally {
      setLoading(false);
    }
  };

  const deleteNote = async (id: string) => {
    if (!confirm('Are you sure you want to delete this note?')) return;
    
    try {
      const response = await fetch(`/api/notes/${id}`, {
        method: 'DELETE',
      });
      
      if (response.ok) {
        setNotes(notes.filter(note => note.id !== id));
      }
    } catch (error) {
      console.error('Error deleting note:', error);
    }
  };

  const copyShareLink = (shareId: string) => {
    const shareUrl = `${window.location.origin}/share/${shareId}`;
    navigator.clipboard.writeText(shareUrl);
    alert('Share link copied to clipboard!');
  };

  const allTags = Array.from(new Set(notes.flatMap(note => note.tags)));

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Search and Filter */}
      <div className="flex gap-4 mb-6">
        <input
          type="text"
          placeholder="Search notes..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <select
          value={selectedTag}
          onChange={(e) => setSelectedTag(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">All Tags</option>
          {allTags.map(tag => (
            <option key={tag} value={tag}>{tag}</option>
          ))}
        </select>
      </div>

      {/* Notes List */}
      {notes.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 mb-4">No notes found</p>
          <a
            href="/note/new"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Create your first note
          </a>
        </div>
      ) : (
        <div className="grid gap-4">
          {notes.map(note => (
            <div key={note.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-semibold text-lg line-clamp-2">
                  {note.content.substring(0, 100)}{note.content.length > 100 ? '...' : ''}
                </h3>
                <div className="flex gap-2 ml-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => copyShareLink(note.shareId)}
                  >
                    Share
                  </Button>
                  <a href={`/note/${note.id}`}>
                    <Button variant="outline" size="sm">
                      Edit
                    </Button>
                  </a>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => deleteNote(note.id)}
                  >
                    Delete
                  </Button>
                </div>
              </div>
              
              {note.tags.length > 0 && (
                <div className="flex flex-wrap gap-1 mb-2">
                  {note.tags.map(tag => (
                    <span
                      key={tag}
                      className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full cursor-pointer hover:bg-blue-200"
                      onClick={() => setSelectedTag(tag)}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
              
              <p className="text-gray-500 text-sm">
                Created: {new Date(note.createdAt).toLocaleDateString()}
                {note.updatedAt !== note.createdAt && (
                  <span> • Updated: {new Date(note.updatedAt).toLocaleDateString()}</span>
                )}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}