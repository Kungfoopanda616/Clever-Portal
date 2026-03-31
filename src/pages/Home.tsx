import { useState } from "react";
import { motion } from "framer-motion";
import { Zap, Search, CornerDownLeft, Link2 } from "lucide-react";
import Header from "@/components/layout/Header";

// This MUST be "export default"
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

    // Ultraviolet Xor Encoding Logic
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
    <div className="min-h-screen bg-[#0d0d0d] text-white relative flex flex-col">
      <Header />
      <div className="absolute inset-0 top-32 flex justify-center overflow-hidden pointer-events-none">
         <div className="w-[1000px] h-[600px] bg-[#ff5722]/10 blur-[160px] rounded-full opacity-40" />
      </div>

      <main className="flex-grow flex flex-col items-center justify-center p-6 relative z-10">
        <div className="max-w-3xl w-full text-center space-y-16">
          <div className="space-y-6 text-[#ff5722]">
             <h1 className="text-[120px] font-bold leading-[100px] tracking-tighter">Epstien</h1>
          </div>

          <form onSubmit={handleSearch} className="relative group">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-6 h-6 text-gray-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search via proxy..."
              className="w-full bg-[#1a1a1a]/60 p-7 pl-16 pr-20 text-xl rounded-full border border-white/5 outline-none focus:border-[#ff5722]/40 transition-all"
            />
            <button type="submit" className="absolute right-6 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center rounded-full bg-[#0d0d0d] border border-white/5 text-gray-400">
               <CornerDownLeft className="w-5 h-5" />
            </button>
          </form>
        </div>
      </main>

      <footer className="w-full p-8 text-center text-xs text-gray-600 font-semibold tracking-widest uppercase">
        Owner: Slim/Emery B
      </footer>
    </div>
  );
}
