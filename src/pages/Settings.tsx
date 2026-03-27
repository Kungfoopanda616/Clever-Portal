import { useRef } from "react";
import { motion } from "framer-motion";
import {
  Settings as SettingsIcon, Monitor, Search, Ghost,
  RefreshCw, ImageIcon, Shuffle, Globe, Palette, Check, Loader2
} from "lucide-react";
import { useSettings, AppTheme, ProxyMode } from "@/contexts/SettingsContext";
import { useBackgrounds } from "@/hooks/useApi";
import { useToast } from "@/hooks/use-toast";

const CLOAK_PRESETS = [
  { name: "Google Classroom", title: "Classes", icon: "https://ssl.gstatic.com/classroom/favicon.png" },
  { name: "Google Drive", title: "Google Drive", icon: "https://ssl.gstatic.com/images/branding/product/1x/drive_2020q4_32dp.png" },
  { name: "Clever", title: "Clever | Portal", icon: "https://assets.clever.com/favicons/clever-favicon-32x32.png" },
  { name: "Khan Academy", title: "Dashboard | Khan Academy", icon: "https://cdn.kastatic.org/images/favicon.ico" },
];

const RANDOM_CLOAK_POOL = [
  { title: "Assignment Tracker – Google Classroom", icon: "https://ssl.gstatic.com/classroom/favicon.png" },
  { title: "Math · Khan Academy", icon: "https://cdn.kastatic.org/images/favicon.ico" },
  { title: "My Drive – Google Drive", icon: "https://ssl.gstatic.com/images/branding/product/1x/drive_2020q4_32dp.png" },
  { title: "Clever | Portal", icon: "https://assets.clever.com/favicons/clever-favicon-32x32.png" },
  { title: "Docs – Google Docs", icon: "https://ssl.gstatic.com/docs/documents/images/kix-favicon7.ico" },
  { title: "Slides – Google Slides", icon: "https://ssl.gstatic.com/docs/presentations/images/favicon5.ico" },
  { title: "Sheets – Google Sheets", icon: "https://ssl.gstatic.com/docs/spreadsheets/favicon3.ico" },
  { title: "IXL | Math Practice", icon: "https://www.ixl.com/favicon.ico" },
  { title: "Quizlet – Study Tools", icon: "https://quizlet.com/favicon.ico" },
  { title: "Kahoot! – Game Pin", icon: "https://kahoot.com/favicon.ico" },
  { title: "Duolingo – Learn a Language", icon: "https://www.duolingo.com/favicon.ico" },
  { title: "Newsela | Article", icon: "https://newsela.com/favicon.ico" },
];

const THEMES: { id: AppTheme; label: string; primary: string; secondary: string }[] = [
  { id: "default", label: "Nebula", primary: "#8b5cf6", secondary: "#06b6d4" },
  { id: "midnight", label: "Midnight", primary: "#3b82f6", secondary: "#818cf8" },
  { id: "forest", label: "Forest", primary: "#22c55e", secondary: "#10b981" },
  { id: "sunset", label: "Sunset", primary: "#f97316", secondary: "#ef4444" },
  { id: "ice", label: "Ice", primary: "#06b6d4", secondary: "#14b8a6" },
  { id: "mono", label: "Mono", primary: "#a3a3a3", secondary: "#737373" },
];

const PROXY_MODES: { id: ProxyMode; label: string; desc: string }[] = [
  { id: "direct", label: "Embedded (Direct)", desc: "Loads inside the page. Some sites block this." },
  { id: "newtab", label: "New Tab", desc: "Opens in a new browser tab. Always works." },
  { id: "googletranslate", label: "Google Translate", desc: "Routes through Google Translate. Bypasses many filters." },
];

export default function Settings() {
  const {
    tabTitle, tabIcon, searchEngine, proxyMode, theme, selectedBgUrl,
    setTabTitle, setTabIcon, setSearchEngine, setProxyMode, setTheme, setSelectedBgUrl, resetCloak
  } = useSettings();
  const { data: backgrounds, loading: bgsLoading } = useBackgrounds();
  const { toast } = useToast();
  const titleRef = useRef<HTMLInputElement>(null);
  const iconRef = useRef<HTMLInputElement>(null);

  const handleCustomCloak = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const t = formData.get("title") as string;
    const i = formData.get("icon") as string;
    if (t) setTabTitle(t);
    if (i) setTabIcon(i);
    toast({ title: "Custom cloaking applied" });
  };

  const generateRandom = () => {
    const pick = RANDOM_CLOAK_POOL[Math.floor(Math.random() * RANDOM_CLOAK_POOL.length)];
    if (titleRef.current) titleRef.current.value = pick.title;
    if (iconRef.current) iconRef.current.value = pick.icon;
    setTabTitle(pick.title);
    setTabIcon(pick.icon);
    toast({ title: "Random cloak applied!", description: pick.title });
  };

  const applyPreset = (preset: typeof CLOAK_PRESETS[0]) => {
    setTabTitle(preset.title);
    setTabIcon(preset.icon);
    toast({ title: "Preset applied", description: preset.name });
  };

  const selectBg = (url: string | null, name: string) => {
    setSelectedBgUrl(url);
    toast({ title: url ? `Background: ${name}` : "Background cleared" });
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
      <div className="mb-10">
        <h1 className="text-4xl font-display font-bold flex items-center gap-3 mb-2">
          <div className="p-2 rounded-xl bg-secondary/20 text-secondary">
            <SettingsIcon className="w-8 h-8" />
          </div>
          Settings
        </h1>
        <p className="text-muted-foreground text-lg">Customize your Epstien experience.</p>
      </div>

      <div className="grid gap-8">

        {/* Tab Cloaking */}
        <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          className="bg-card rounded-3xl p-6 sm:p-8 border border-white/5 shadow-xl">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 rounded-lg bg-primary/10 text-primary"><Ghost className="w-6 h-6" /></div>
            <h2 className="text-2xl font-display font-semibold">Tab Cloaking</h2>
          </div>
          <p className="text-muted-foreground mb-6">Disguise your browser tab to look like an educational site.</p>
          <div className="grid sm:grid-cols-2 gap-8">
            <div>
              <h3 className="text-sm font-medium uppercase tracking-wider text-muted-foreground mb-4">Quick Presets</h3>
              <div className="grid grid-cols-2 gap-3">
                {CLOAK_PRESETS.map(preset => (
                  <button key={preset.name} onClick={() => applyPreset(preset)}
                    className="flex flex-col items-center gap-2 p-4 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 hover:border-white/20 transition-all text-sm font-medium">
                    <img src={preset.icon} alt={preset.name} className="w-6 h-6" />
                    <span className="text-center text-xs">{preset.name}</span>
                  </button>
                ))}
              </div>
              <button onClick={() => { resetCloak(); toast({ title: "Cloaking reset" }); }}
                className="mt-4 w-full flex items-center justify-center gap-2 p-3 rounded-xl bg-destructive/10 text-destructive hover:bg-destructive hover:text-white transition-colors text-sm font-medium">
                <RefreshCw className="w-4 h-4" /> Reset to Default
              </button>
            </div>
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-medium uppercase tracking-wider text-muted-foreground">Custom Cloak</h3>
                <button type="button" onClick={generateRandom}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-secondary/20 text-secondary hover:bg-secondary/30 transition-all text-xs font-semibold">
                  <Shuffle className="w-3.5 h-3.5" /> Random
                </button>
              </div>
              <form onSubmit={handleCustomCloak} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Tab Title</label>
                  <input ref={titleRef} name="title" defaultValue={tabTitle} placeholder="e.g. Dashboard"
                    className="w-full px-4 py-3 rounded-xl bg-background border border-border focus:border-primary outline-none transition-all" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Favicon URL</label>
                  <input ref={iconRef} name="icon" defaultValue={tabIcon} placeholder="https://example.com/icon.png"
                    className="w-full px-4 py-3 rounded-xl bg-background border border-border focus:border-primary outline-none transition-all" />
                </div>
                <button type="submit" className="w-full px-4 py-3 rounded-xl font-semibold bg-gradient-to-r from-primary to-primary/80 text-primary-foreground shadow-lg shadow-primary/25 hover:shadow-xl active:scale-[0.98] transition-all">
                  Apply Custom Cloak
                </button>
              </form>
            </div>
          </div>
        </motion.section>

        {/* Background */}
        <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.04 }}
          className="bg-card rounded-3xl p-6 sm:p-8 border border-white/5 shadow-xl">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-lg bg-violet-500/10 text-violet-400"><ImageIcon className="w-6 h-6" /></div>
            <h2 className="text-2xl font-display font-semibold">Background</h2>
          </div>
          <p className="text-muted-foreground mb-6">Choose a background for the whole app. Default is plain (matches your theme).</p>

          {bgsLoading ? (
            <div className="flex items-center justify-center py-8 text-muted-foreground gap-2">
              <Loader2 className="w-5 h-5 animate-spin" /> Loading backgrounds...
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {/* None / Default option */}
              <button
                onClick={() => selectBg(null, "Default")}
                className={`relative rounded-2xl overflow-hidden aspect-video border-2 transition-all group ${!selectedBgUrl ? "border-primary shadow-lg shadow-primary/30" : "border-white/10 hover:border-white/30"}`}
              >
                <div className="absolute inset-0 bg-background flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-8 h-8 rounded-full border-2 border-dashed border-white/20 mx-auto mb-1 flex items-center justify-center">
                      <span className="text-white/30 text-xs">—</span>
                    </div>
                    <span className="text-xs font-medium text-muted-foreground">None</span>
                  </div>
                </div>
                {!selectedBgUrl && (
                  <div className="absolute top-1.5 right-1.5 w-5 h-5 rounded-full bg-primary flex items-center justify-center shadow-lg">
                    <Check className="w-3 h-3 text-white" />
                  </div>
                )}
              </button>

              {/* Library backgrounds */}
              {backgrounds.map(bg => (
                <button
                  key={bg.id}
                  onClick={() => selectBg(bg.url, bg.name)}
                  className={`relative rounded-2xl overflow-hidden aspect-video border-2 transition-all group ${selectedBgUrl === bg.url ? "border-primary shadow-lg shadow-primary/30" : "border-white/10 hover:border-white/30"}`}
                >
                  <img
                    src={bg.url}
                    alt={bg.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                    onError={e => { (e.target as HTMLImageElement).style.opacity = "0.3"; }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <span className="absolute bottom-1.5 left-2 text-[10px] font-medium text-white/80 truncate max-w-[80%]">{bg.name}</span>
                  {selectedBgUrl === bg.url && (
                    <div className="absolute top-1.5 right-1.5 w-5 h-5 rounded-full bg-primary flex items-center justify-center shadow-lg">
                      <Check className="w-3 h-3 text-white" />
                    </div>
                  )}
                </button>
              ))}
            </div>
          )}
        </motion.section>

        {/* Proxy Mode */}
        <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.06 }}
          className="bg-card rounded-3xl p-6 sm:p-8 border border-white/5 shadow-xl">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400"><Globe className="w-6 h-6" /></div>
            <h2 className="text-2xl font-display font-semibold">Proxy Mode</h2>
          </div>
          <p className="text-muted-foreground mb-6">Choose how sites open. Switch to New Tab if Embedded fails.</p>
          <div className="grid gap-3">
            {PROXY_MODES.map(mode => (
              <button key={mode.id} onClick={() => { setProxyMode(mode.id); toast({ title: `Proxy: ${mode.label}` }); }}
                className={`flex items-start gap-4 p-4 rounded-xl border-2 text-left transition-all ${proxyMode === mode.id ? "border-primary bg-primary/5" : "border-white/10 hover:border-white/20 bg-white/[0.02]"}`}>
                <div className={`mt-0.5 w-4 h-4 rounded-full border-2 shrink-0 transition-colors ${proxyMode === mode.id ? "border-primary bg-primary" : "border-muted-foreground"}`} />
                <div>
                  <div className="font-semibold">{mode.label}</div>
                  <div className="text-sm text-muted-foreground mt-0.5">{mode.desc}</div>
                </div>
              </button>
            ))}
          </div>
        </motion.section>

        {/* Theme */}
        <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08 }}
          className="bg-card rounded-3xl p-6 sm:p-8 border border-white/5 shadow-xl">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 rounded-lg bg-pink-500/10 text-pink-400"><Palette className="w-6 h-6" /></div>
            <h2 className="text-2xl font-display font-semibold">Color Theme</h2>
          </div>
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
            {THEMES.map(t => (
              <button key={t.id} onClick={() => { setTheme(t.id); toast({ title: `Theme: ${t.label}` }); }}
                className={`relative flex flex-col items-center gap-2 p-3 rounded-2xl border-2 transition-all ${theme === t.id ? "border-white/40 bg-white/10" : "border-white/5 hover:border-white/20 bg-white/[0.02]"}`}>
                <div className="flex gap-1">
                  <div className="w-5 h-5 rounded-full shadow-lg" style={{ background: t.primary }} />
                  <div className="w-5 h-5 rounded-full shadow-lg" style={{ background: t.secondary }} />
                </div>
                <span className="text-xs font-medium">{t.label}</span>
                {theme === t.id && (
                  <div className="absolute top-1 right-1 w-4 h-4 rounded-full bg-white/20 flex items-center justify-center">
                    <Check className="w-2.5 h-2.5" />
                  </div>
                )}
              </button>
            ))}
          </div>
        </motion.section>

        {/* Search Engine */}
        <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.10 }}
          className="bg-card rounded-3xl p-6 sm:p-8 border border-white/5 shadow-xl">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 rounded-lg bg-accent/10 text-accent"><Search className="w-6 h-6" /></div>
            <h2 className="text-2xl font-display font-semibold">Search Engine</h2>
          </div>
          <div className="grid sm:grid-cols-3 gap-4">
            {[
              { id: "google", label: "Google", bg: "bg-white", letter: "G", color: "text-blue-600" },
              { id: "bing", label: "Bing", bg: "bg-[#00809d]", letter: "b", color: "text-white" },
              { id: "duckduckgo", label: "DuckDuckGo", bg: "bg-[#de5833]", letter: "D", color: "text-white" },
            ].map(eng => (
              <label key={eng.id} className={`cursor-pointer flex items-center justify-between p-4 rounded-xl border-2 transition-all ${searchEngine === eng.id ? "border-primary bg-primary/5" : "border-white/10 hover:border-white/20"}`}>
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-full ${eng.bg} flex items-center justify-center`}>
                    <span className={`${eng.color} font-bold font-sans`}>{eng.letter}</span>
                  </div>
                  <span className="font-medium">{eng.label}</span>
                </div>
                <input type="radio" name="engine" value={eng.id} checked={searchEngine === eng.id}
                  onChange={() => setSearchEngine(eng.id)} className="w-5 h-5 accent-primary" />
              </label>
            ))}
          </div>
        </motion.section>

        {/* About */}
        <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.12 }}
          className="bg-card rounded-3xl p-6 sm:p-8 border border-white/5 shadow-xl">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-500"><Monitor className="w-6 h-6" /></div>
            <h2 className="text-2xl font-display font-semibold">About Epstien</h2>
          </div>
          <div className="space-y-4 text-muted-foreground leading-relaxed">
            <p>Epstien is a high-performance proxy browser built for speed and stealth. Embed sites, cloak your tab, and bypass content filters.</p>
            <p className="text-foreground font-medium">EFN — Elite Firewall Network &nbsp;·&nbsp; Version 1.0.0</p>
            <p className="text-muted-foreground/60 text-sm">Owner: Slim/Emery B</p>
            <div className="pt-2 border-t border-white/5">
              <p className="text-sm font-semibold text-amber-400 mb-1">If Linewize blocks your URL:</p>
              <p className="text-sm">Use the Publish button to deploy this app. Once deployed it gets a <code className="text-primary bg-primary/10 px-1 rounded">.replit.app</code> domain. If that gets blocked, re-deploy for a fresh URL or open it through phone hotspot. You own the code — you can always redeploy.</p>
            </div>
          </div>
        </motion.section>

      </div>
    </div>
  );
}
