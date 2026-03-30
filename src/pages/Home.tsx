import { useState } from "react";
import { motion } from "framer-motion";
import { Zap, Search, CornerDownLeft, Link2 } from "lucide-react";
import Header from "@/components/layout/Header";

// This is the line Vercel is looking for
export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");

  // Since you're hosting Ultraviolet on the same site
  const PROXY_URL = "/uv/service/"; 

  const quickLinks = [
    { label: "Reddit", url: "https://www.reddit.com" },
    { label: "Gemini AI", url: "https://gemini.google.com" },
    { label: "Youtube", url: "https://www.youtube.com" },
  ];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    let targetUrl = "";
    const isUrl = searchQuery.includes('.') && !searchQuery.includes(' ');

    if (isUrl) {
      targetUrl = searchQuery.startsWith('http') ? searchQuery : `https://${searchQuery}`;
    } else {
      targetUrl = `https://www.google.com/search?q=${encodeURIComponent(searchQuery)}`;
    }

    // Encodes for Ultraviolet
    window.location.href = `${PROXY_URL}${btoa(targetUrl)}`;
  };

  return (
    <div className="min-h-screen bg-[#0d0d0d] text-white relative flex flex-col">
      <Header />
      
      {/* Background Glow */}
      <div className="absolute inset-0 top-32 flex justify-center overflow-hidden pointer-events-none">
         <div className="w-[1000px] h-[600px] bg-[#ff5722]/10 blur-[160px] rounded-full opacity-40" />
      </div>

      <main className="flex-grow flex flex-col items-center justify-center p-6 pb-20 pt-16 relative z-10">
        <div className="max-w-3xl w-full text-center space-y-16">
          
          {/* Logo Section */}
          <div className="space-y-6">
             <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-16 h-16 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-center text-[#ff5722] mx-auto shadow-inner"
             >
                <div className="relative">
                   <Zap className="w-8 h-8 relative z-10 fill-[#ff5722]" />
                   <div className="absolute inset-0 w-8 h-8 bg-[#ff5722] blur-lg opacity-60" />
                </div>
             </motion.div>

             <motion.h1
               initial={{ opacity: 0, y: 10 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ delay: 0.1 }}
               className="text-[120px] font-bold text-[#ff5722] leading-[100px] tracking-tighter drop-shadow-2xl"
             >
               Epstien
             </motion.h1>
          </div>

          {/* Search Bar */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="w-full"
          >
             <form onSubmit={handleSearch} className="relative group">
                <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-6 h-6 text-gray-500 group-focus-within:text-[#ff5722] transition-colors" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search via proxy..."
                  className="w-full bg-[#1a1a1a]/60 backdrop-blur-md p-7 pl-16 pr-20 text-xl rounded-full border border-white/5 outline-none focus:border-[#ff5722]/40 focus:ring-4 focus:ring-[#ff5722]/5 transition-all placeholder:text-gray-600 shadow-2xl"
                />
                <button type="submit" className="absolute right-6 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center rounded-full bg-[#0d0d0d] border border-white/5 text-gray-400 hover:text-white transition-colors shadow-sm">
                   <CornerDownLeft className="w-5 h-5" />
                </button>
             </form>
          </motion.div>

          {/* Quick Links Section */}
          <motion.div
             initial={{ opacity: 0, y: 15 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ delay: 0.4 }}
             className="space-y-6 pt-4"
          >
             <div className="flex items-center gap-3 text-red-600 font-bold text-xs tracking-[0.2em] uppercase opacity-80 justify-center">
                <Zap className="w-4 h-4 fill-red-600" />
                Quick Links
             </div>

             <div className="flex flex-wrap items-center gap-4 justify-center">
                {quickLinks.map((link, i) => (
                  <a key={i} href={link.url} target="_blank" rel="noopener noreferrer">
                     <button className="flex items-center gap-3 px-8 py-4 bg-white/[0.03] hover:bg-white/[0.08] text-white font-bold rounded-2xl border border-white/5 hover:border-white/10 hover:-translate-y-1 transition-all">
                        <Link2 className="w-5 h-5 text-gray-500" />
                        {link.label}
                     </button>
                  </a>
                ))}
             </div>
          </motion.div>
        </div>
      </main>

      <footer className="w-full p-8 text-center mt-auto">
         <span className="text-xs text-gray-600 font-semibold tracking-widest uppercase">
           Owner: Slim/Emery B
         </span>
      </footer>
    </div>
  );
}
