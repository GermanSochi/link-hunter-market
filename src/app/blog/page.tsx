import { Suspense } from "react";
import BlogList from "./BlogList";
import { Loader2 } from "lucide-react";

export const metadata = { title: "Блоги — AI-маркет" };

export default function BlogPage() {
  return (
    <main className="bg-[#f7f8fc] dark:bg-slate-950 min-h-screen">
      <div className="max-w-3xl mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Блоги</h1>
          <p className="text-sm text-gray-500 dark:text-slate-400 mt-1">Мысли, гайды и находки сообщества</p>
        </div>
        <Suspense fallback={
          <div className="flex items-center justify-center py-16">
            <Loader2 className="h-6 w-6 animate-spin text-[#005BFF]" />
          </div>
        }>
          <BlogList />
        </Suspense>
      </div>
    </main>
  );
}
