import { useState } from "react";
import { motion } from "framer-motion";
import { Search, Sparkles, Zap, ArrowRight, Link as LinkIcon } from "lucide-react";
import { useSettings } from "@/contexts/SettingsContext";
import { useIframe } from "@/contexts/IframeContext";
import { useGetLinks } from "@workspace/api-client-react";

export default function Home() {
  const [query, setQuery] = useState("");
  const { searchEngine } = useSettings();
  const { openUrl } = useIframe();
  const { data: links = [] } = useGetLinks();

  const quickSites = links.filter(l => l.category === "sites").sort((a, b) => a.position - b.position).slice(0, 4);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    let targetUrl = query.trim();
    const isUrl = targetUrl.startsWith('http') || (targetUrl.includes('.') && !targetUrl.includes(' '));

    if (isUrl) {
      if (!targetUrl.startsWith('http')) targetUrl = `https://${targetUrl}`;
    } else {
      if (searchEngine === 'bing') {
        targetUrl = `https://www.bing.com/search?q=${encodeURIComponent(targetUrl)}`;
      } else if (searchEngine === 'duckduckgo') {
        targetUrl = `https://duckduckgo.com/?q=${encodeURIComponent(targetUrl)}`;
      } else {
        targetUrl = `https://www.google.com/search?q=${encodeURIComponent(targetUrl)}`;
      }
    }

    openUrl(targetUrl, isUrl ? targetUrl : `${query} - Search`);
  };

  return (
    <div className="relative min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center p-4 overflow-hidden">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className="w-full max-w-2xl flex flex-col items-center gap-8"
      >
        <div className="text-center space-y-4">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, type: "spring" }}
            className="inline-flex items-center justify-center p-3 mb-2 rounded-2xl bg-white/5 border border-white/10 shadow-2xl shadow-primary/20 backdrop-blur-xl"
          >
            <Sparkles className="w-8 h-8 text-primary" />
          </motion.div>
          <h1 className="text-6xl sm:text-8xl font-display font-bold tracking-tighter text-gradient pb-2">Clever</h1>
          <p className="text-lg text-muted-foreground font-medium">EFN</p>
        </div>

        <form onSubmit={handleSubmit} className="w-full relative group">
          <div className="absolute -inset-1 bg-gradient-to-r from-primary to-secondary rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-500" />
          <div className="relative flex items-center bg-card/80 backdrop-blur-xl border border-white/10 rounded-2xl shadow-xl overflow-hidden">
            <div className="pl-6 pr-2 text-muted-foreground">
              <Search className="w-5 h-5" />
            </div>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search the web or enter URL..."
              className="w-full py-5 px-2 bg-transparent text-lg text-foreground placeholder:text-muted-foreground/60 focus:outline-none"
              autoFocus
            />
            <button
              type="submit"
              disabled={!query.trim()}
              className="m-2 p-3 rounded-xl bg-primary/10 text-primary hover:bg-primary hover:text-white disabled:opacity-50 disabled:hover:bg-primary/10 disabled:hover:text-primary transition-all active:scale-95"
            >
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </form>

        {quickSites.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="w-full mt-8"
          >
            <div className="flex items-center gap-2 mb-4 px-2">
              <Zap className="w-4 h-4 text-secondary" />
              <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Quick Links</h3>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {quickSites.map((site, i) => (
                <motion.button
                  key={site.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 + (i * 0.1) }}
                  onClick={() => openUrl(site.url, site.name)}
                  className="flex items-center gap-3 p-4 rounded-2xl bg-card/50 hover:bg-card/80 border border-white/5 hover:border-white/10 transition-all hover:-translate-y-1 hover:shadow-lg hover:shadow-primary/5 group"
                >
                  <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center text-xl group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                    {site.icon || <LinkIcon className="w-5 h-5" />}
                  </div>
                  <span className="font-medium text-sm text-left truncate">{site.name}</span>
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="text-xs text-muted-foreground/40 mt-4 tracking-widest"
        >
          Owner: Slim/Emery B
        </motion.p>
      </motion.div>
    </div>
  );
}
