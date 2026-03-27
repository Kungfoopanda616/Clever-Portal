import { useState } from "react";
import { motion } from "framer-motion";
import { LayoutGrid, Search, ExternalLink, Link as LinkIcon } from "lucide-react";
import { useGetLinks } from "@workspace/api-client-react";
import { useIframe } from "@/contexts/IframeContext";

export default function Apps() {
  const { data: links = [], isLoading } = useGetLinks();
  const { openUrl } = useIframe();
  const [search, setSearch] = useState("");

  const sites = links
    .filter(l => l.category === "sites")
    .filter(l => l.name.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => a.position - b.position);

  const getHostname = (url: string) => {
    try { return new URL(url).hostname.replace("www.", ""); } catch { return url; }
  };

  const getFaviconUrl = (url: string) => {
    try {
      const host = new URL(url).origin;
      return `https://www.google.com/s2/favicons?domain=${host}&sz=64`;
    } catch { return null; }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
        <div>
          <h1 className="text-4xl font-display font-bold flex items-center gap-3 mb-2">
            <div className="p-2 rounded-xl bg-secondary/20 text-secondary">
              <LayoutGrid className="w-8 h-8" />
            </div>
            Apps
          </h1>
          <p className="text-muted-foreground text-lg">Quick-launch sites in the built-in browser.</p>
        </div>

        <div className="relative w-full md:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search apps..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-3 rounded-xl bg-card border border-white/10 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all placeholder:text-muted-foreground/50"
          />
        </div>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-8 gap-4">
          {[...Array(12)].map((_, i) => (
            <div key={i} className="bg-card rounded-2xl p-4 h-24 animate-pulse border border-white/5" />
          ))}
        </div>
      ) : sites.length === 0 ? (
        <div className="text-center py-24 bg-card/30 rounded-3xl border border-white/5 border-dashed">
          <LayoutGrid className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-50" />
          <h3 className="text-xl font-display font-semibold mb-2">No apps yet</h3>
          <p className="text-muted-foreground">Add site links in the Admin panel — they'll appear here.</p>
        </div>
      ) : (
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-8 gap-4">
          {sites.map((site, i) => {
            const favicon = site.icon?.startsWith("http") ? site.icon : getFaviconUrl(site.url);
            const emoji = site.icon && !site.icon.startsWith("http") ? site.icon : null;

            return (
              <motion.button
                key={site.id}
                initial={{ opacity: 0, scale: 0.85 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.04 }}
                onClick={() => openUrl(site.url, site.name)}
                className="group flex flex-col items-center gap-2 p-4 rounded-2xl border border-white/5 bg-card hover:border-primary/40 hover:bg-primary/5 transition-all duration-200 hover:-translate-y-1 hover:shadow-lg hover:shadow-primary/15 text-center"
              >
                {/* Icon */}
                <div className="w-14 h-14 rounded-2xl bg-white/5 group-hover:bg-primary/10 flex items-center justify-center transition-colors duration-200 overflow-hidden shadow-inner">
                  {emoji ? (
                    <span className="text-3xl">{emoji}</span>
                  ) : favicon ? (
                    <img
                      src={favicon}
                      alt={site.name}
                      className="w-9 h-9 object-contain"
                      onError={e => {
                        (e.target as HTMLImageElement).style.display = "none";
                        (e.target as HTMLImageElement).nextElementSibling?.classList.remove("hidden");
                      }}
                    />
                  ) : null}
                  <LinkIcon className="w-6 h-6 text-muted-foreground hidden" />
                </div>

                {/* Name */}
                <span className="text-xs font-semibold truncate w-full text-center leading-tight">
                  {site.name}
                </span>

                {/* URL hint */}
                <span className="text-[9px] text-muted-foreground/50 truncate w-full">
                  {getHostname(site.url)}
                </span>

                {/* Hover indicator */}
                <div className="flex items-center gap-1 text-[9px] text-primary opacity-0 group-hover:opacity-100 transition-opacity -mt-1">
                  <ExternalLink className="w-2.5 h-2.5" /> Open
                </div>
              </motion.button>
            );
          })}
        </div>
      )}
    </div>
  );
}
