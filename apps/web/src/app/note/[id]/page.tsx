import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { NoteEditor } from '@/components/note-editor';

interface Props {
  params: { id: string };
}

export default async function NotePage({ params }: Props) {
  const session = await auth();
  
  if (!session?.user) {
    redirect('/auth/signin');
  }

  return (
    <div className="container mx-auto py-8">
      <div className="mb-6">
        <a 
          href="/dashboard"
          className="text-blue-600 hover:text-blue-800 flex items-center gap-2"
        >
          ← Back to Dashboard
        </a>
      </div>
      
      <NoteEditor noteId={params.id === 'new' ? null : params.id} />
    </div>
  );
}