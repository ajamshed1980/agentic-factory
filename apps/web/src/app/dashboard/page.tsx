import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { DashboardClient } from '@/components/dashboard-client';

export default async function DashboardPage() {
  const session = await auth();
  
  if (!session?.user) {
    redirect('/auth/signin');
  }

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">My Ideas</h1>
        <div className="flex gap-4">
          <a
            href="/note/new"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Create Note
          </a>
          <form action="/api/auth/signout" method="post">
            <button 
              type="submit"
              className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
            >
              Sign Out
            </button>
          </form>
        </div>
      </div>
      
      <DashboardClient />
    </div>
  );
}