import { useState } from "react";
import { motion } from "framer-motion";
import { LayoutGrid, Search, ExternalLink } from "lucide-react";
import { useGetLinks } from "@/hooks/use-links";
import { useIframe } from "@/contexts/IframeContext";

export default function Apps() {
  const { data: links = [], isLoading } = useGetLinks();
  const { openUrl } = useIframe();
  const [search, setSearch] = useState("");

  const apps = links
    .filter(l => l.category === "apps")
    .filter(l => l.name.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => a.position - b.position);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
        <div>
          <h1 className="text-4xl font-display font-bold flex items-center gap-3 mb-2">
            <div className="p-2 rounded-xl bg-primary/20 text-primary">
              <LayoutGrid className="w-8 h-8" />
            </div>
            Apps Library
          </h1>
          <p className="text-muted-foreground text-lg">Access your favorite web applications.</p>
        </div>

        <div className="relative w-full md:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search apps..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-3 rounded-xl bg-card border border-white/10 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all placeholder:text-muted-foreground/50"
          />
        </div>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {[...Array(10)].map((_, i) => (
            <div key={i} className="bg-card rounded-2xl p-6 h-48 animate-pulse border border-white/5" />
          ))}
        </div>
      ) : apps.length === 0 ? (
        <div className="text-center py-24 bg-card/30 rounded-3xl border border-white/5 border-dashed">
          <LayoutGrid className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-50" />
          <h3 className="text-xl font-display font-semibold mb-2">No apps found</h3>
          <p className="text-muted-foreground">Try adjusting your search or add apps in the Admin panel.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {apps.map((app, i) => (
            <motion.button
              key={app.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.05 }}
              onClick={() => openUrl(app.url, app.name)}
              className="group relative flex flex-col items-center justify-center p-6 bg-card rounded-2xl border border-white/5 hover:border-primary/50 transition-all duration-300 hover:-translate-y-2 hover:shadow-xl hover:shadow-primary/20 text-center"
            >
              <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent opacity-0 group-hover:opacity-100 rounded-2xl transition-opacity duration-300" />
              
              <div className="w-20 h-20 mb-4 rounded-2xl bg-white/5 flex items-center justify-center text-4xl shadow-inner group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300">
                {app.icon ? (
                  app.icon.startsWith('http') ? (
                    <img src={app.icon} alt={app.name} className="w-12 h-12 object-contain rounded-lg" />
                  ) : (
                    <span>{app.icon}</span>
                  )
                ) : (
                  <span className="font-display font-bold text-primary">{app.name.charAt(0)}</span>
                )}
              </div>
              
              <h3 className="font-display font-bold text-lg leading-tight mb-1 truncate w-full">{app.name}</h3>
              
              <div className="mt-4 flex items-center gap-2 text-xs font-medium text-primary opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
                <ExternalLink className="w-3 h-3" /> Open App
              </div>
            </motion.button>
          ))}
        </div>
      )}
    </div>
  );
}
