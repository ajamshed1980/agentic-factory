import { notFound } from 'next/navigation';

interface Props {
  params: { shareId: string };
}

async function getSharedNote(shareId: string) {
  try {
    const response = await fetch(`${process.env.NEXTAUTH_URL || 'http://localhost:5000'}/api/shared/${shareId}`, {
      cache: 'no-store'
    });
    
    if (!response.ok) {
      return null;
    }

    const data = await response.json();
    return data.success ? data.data : null;
  } catch (error) {
    console.error('Error fetching shared note:', error);
    return null;
  }
}

export default async function SharedNotePage({ params }: Props) {
  const note = await getSharedNote(params.shareId);

  if (!note) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-md p-8">
            <div className="mb-6">
              <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-gray-900">Shared Note</h1>
                <div className="text-sm text-gray-500">
                  Created: {new Date(note.createdAt).toLocaleDateString()}
                </div>
              </div>
              
              {note.tags && note.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-4">
                  {note.tags.map((tag: string) => (
                    <span
                      key={tag}
                      className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>

            <div className="prose max-w-none">
              <div className="whitespace-pre-wrap text-gray-800 leading-relaxed">
                {note.content}
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-gray-200">
              <div className="text-center">
                <p className="text-gray-600 mb-4">
                  Want to create and organize your own ideas?
                </p>
                <a
                  href="/auth/signup"
                  className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 inline-block"
                >
                  Get Started with IdeaBoard
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}