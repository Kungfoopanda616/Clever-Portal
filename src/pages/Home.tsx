import { useState } from "react";
import { Search, CornerDownLeft } from "lucide-react";
import Header from "@/components/layout/Header";

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    let targetUrl = searchQuery;
    if (!searchQuery.includes('.') || searchQuery.includes(' ')) {
      targetUrl = `https://www.google.com/search?q=${encodeURIComponent(searchQuery)}`;
    } else if (!searchQuery.startsWith('http')) {
      targetUrl = `https://${searchQuery}`;
    }

    // Ultraviolet Xor Encoding
    const encodedUrl = btoa(
      targetUrl
        .split("")
        .map((char, ind) =>
          ind % 2 ? String.fromCharCode(char.charCodeAt(0) ^ 2) : char
        )
        .join("")
    );

    window.location.href = `/uv/service/${encodedUrl}`;
  };

  return (
    <div className="min-h-screen bg-[#0d0d0d] text-white flex flex-col">
      <Header />
      <main className="flex-grow flex flex-col items-center justify-center p-6">
        <h1 className="text-[120px] font-bold text-[#ff5722] mb-12">Epstien</h1>
        <form onSubmit={handleSearch} className="relative w-full max-w-2xl">
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search via proxy..."
            className="w-full bg-[#1a1a1a] p-6 pl-16 pr-20 text-xl rounded-full border border-white/10 outline-none focus:border-[#ff5722]"
          />
          <button type="submit" className="absolute right-6 top-1/2 -translate-y-1/2">
            <CornerDownLeft className="text-gray-400" />
          </button>
        </form>
      </main>
    </div>
  );
}
