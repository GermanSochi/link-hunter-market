"use client";

import { Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function SearchBar() {
  const router = useRouter();
  const [query, setQuery] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const q = query.trim();
    if (q) router.push(`/products?q=${encodeURIComponent(q)}`);
  };

  return (
    <form onSubmit={handleSearch} className="flex-1">
      <div className="flex h-10 rounded-lg overflow-hidden border-2 border-[#005BFF] bg-white">
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Искать AI-инструменты, скрипты, шаблоны..."
          className="flex-1 min-w-0 px-4 text-sm text-gray-900 placeholder:text-gray-400 outline-none bg-transparent"
        />
        <button
          type="submit"
          aria-label="Найти"
          className="px-5 bg-[#005BFF] text-white hover:bg-[#004DE0] transition-colors duration-150 flex items-center gap-2 shrink-0 font-medium text-sm"
        >
          <Search className="h-4 w-4" />
          <span className="hidden sm:inline">Найти</span>
        </button>
      </div>
    </form>
  );
}
