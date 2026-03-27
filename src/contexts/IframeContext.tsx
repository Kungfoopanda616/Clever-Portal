import React, { createContext, useContext, useState, useRef, useCallback, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ExternalLink, X, RefreshCw, AlertTriangle, ChevronLeft, ChevronRight, Lock, Globe, Home } from "lucide-react";
import { useSettings } from "@/contexts/SettingsContext";

interface IframeContextType {
  openUrl: (url: string, title?: string) => void;
  close: () => void;
}

const IframeContext = createContext<IframeContextType | undefined>(undefined);

function ensureHttp(url: string): string {
  url = url.trim();
  if (!url) return url;
  if (/^https?:\/\//i.test(url)) return url;
  if (url.includes(".") && !url.includes(" ")) return `https://${url}`;
  return `https://www.google.com/search?q=${encodeURIComponent(url)}`;
}

function buildProxyUrl(url: string, mode: string): string {
  if (mode === "googletranslate") {
    return `https://translate.google.com/translate?sl=auto&tl=en&u=${encodeURIComponent(url)}`;
  }
  return url;
}

function getDisplayUrl(url: string): string {
  try {
    const u = new URL(url);
    return u.hostname + (u.pathname !== "/" ? u.pathname : "");
  } catch { return url; }
}

function isHttps(url: string): boolean {
  try { return new URL(url).protocol === "https:"; } catch { return false; }
}

export function IframeProvider({ children }: { children: React.ReactNode }) {
  const { proxyMode } = useSettings();

  // History stack
  const [history, setHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [key, setKey] = useState(0);
  const [iframeError, setIframeError] = useState(false);
  const [addressInput, setAddressInput] = useState("");
  const [isEditingAddress, setIsEditingAddress] = useState(false);
  const addressRef = useRef<HTMLInputElement>(null);

  const activeUrl = historyIndex >= 0 ? history[historyIndex] : null;
  const canGoBack = historyIndex > 0;
  const canGoForward = historyIndex < history.length - 1;

  const navigateTo = useCallback((rawUrl: string, pushToHistory = true) => {
    const url = buildProxyUrl(ensureHttp(rawUrl), proxyMode);
    setAddressInput(getDisplayUrl(url));
    setIframeError(false);
    setKey(k => k + 1);

    if (pushToHistory) {
      setHistory(prev => {
        const truncated = prev.slice(0, historyIndex + 1);
        return [...truncated, url];
      });
      setHistoryIndex(prev => prev + 1);
    } else {
      setHistory(prev => {
        const next = [...prev];
        next[historyIndex] = url;
        return next;
      });
    }
  }, [proxyMode, historyIndex]);

  const openUrl = useCallback((url: string, _title = "Browser") => {
    if (proxyMode === "newtab") {
      window.open(url, "_blank");
      return;
    }
    const finalUrl = buildProxyUrl(ensureHttp(url), proxyMode);
    setAddressInput(getDisplayUrl(finalUrl));
    setIframeError(false);
    setKey(k => k + 1);
    setHistory(prev => {
      const truncated = prev.slice(0, historyIndex + 1);
      return [...truncated, finalUrl];
    });
    setHistoryIndex(prev => prev + 1);
  }, [proxyMode, historyIndex]);

  const close = useCallback(() => {
    setHistory([]);
    setHistoryIndex(-1);
    setAddressInput("");
    setIframeError(false);
  }, []);

  const goBack = () => {
    if (!canGoBack) return;
    const newIndex = historyIndex - 1;
    setHistoryIndex(newIndex);
    setAddressInput(getDisplayUrl(history[newIndex]));
    setIframeError(false);
    setKey(k => k + 1);
  };

  const goForward = () => {
    if (!canGoForward) return;
    const newIndex = historyIndex + 1;
    setHistoryIndex(newIndex);
    setAddressInput(getDisplayUrl(history[newIndex]));
    setIframeError(false);
    setKey(k => k + 1);
  };

  const reload = () => {
    setIframeError(false);
    setKey(k => k + 1);
  };

  const handleAddressSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (addressInput.trim()) navigateTo(addressInput.trim());
    addressRef.current?.blur();
    setIsEditingAddress(false);
  };

  // Sync display when URL changes via history nav
  useEffect(() => {
    if (activeUrl) setAddressInput(getDisplayUrl(activeUrl));
  }, [activeUrl]);

  const secure = activeUrl ? isHttps(activeUrl) : false;

  return (
    <IframeContext.Provider value={{ openUrl, close }}>
      {children}
      <AnimatePresence>
        {activeUrl && (
          <motion.div
            initial={{ opacity: 0, scale: 0.97, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.97, y: 16 }}
            transition={{ type: "spring", damping: 28, stiffness: 320 }}
            className="fixed inset-3 z-50 flex flex-col rounded-2xl overflow-hidden shadow-2xl shadow-black/60 ring-1 ring-white/10 bg-[#1a1b1e]"
          >
            {/* ── Browser Chrome ── */}
            <div className="flex flex-col bg-[#25262b] border-b border-white/5 shrink-0">

              {/* Top bar: traffic lights + title */}
              <div className="flex items-center gap-3 px-4 pt-3 pb-1.5">
                {/* Traffic lights */}
                <div className="flex gap-1.5 shrink-0">
                  <button
                    onClick={close}
                    className="w-3.5 h-3.5 rounded-full bg-[#ff5f57] hover:bg-[#ff3b30] transition-colors flex items-center justify-center group"
                    title="Close"
                  >
                    <X className="w-2 h-2 text-[#7a0000] opacity-0 group-hover:opacity-100" />
                  </button>
                  <button
                    className="w-3.5 h-3.5 rounded-full bg-[#febc2e] hover:bg-[#f5a623] transition-colors"
                    title="Minimize"
                    onClick={close}
                  />
                  <button
                    className="w-3.5 h-3.5 rounded-full bg-[#28c840] hover:bg-[#1fa52c] transition-colors"
                    title="Full screen"
                  />
                </div>

                {/* Page title / active tab pill */}
                <div className="flex-1 flex items-center gap-2 min-w-0 ml-2">
                  <div className="flex items-center gap-2 px-3 py-1 rounded-lg bg-white/5 border border-white/5 max-w-xs min-w-0">
                    {secure
                      ? <Lock className="w-3 h-3 text-emerald-400 shrink-0" />
                      : <Globe className="w-3 h-3 text-muted-foreground shrink-0" />}
                    <span className="text-xs text-muted-foreground truncate font-medium">
                      {getDisplayUrl(activeUrl)}
                    </span>
                  </div>
                </div>

                {/* Right controls */}
                <div className="flex items-center gap-1 shrink-0">
                  <button
                    onClick={() => window.open(activeUrl, "_blank")}
                    className="p-1.5 rounded-lg hover:bg-white/10 text-muted-foreground hover:text-foreground transition-colors"
                    title="Open in new tab"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Navigation bar: back/forward/reload + address bar */}
              <div className="flex items-center gap-2 px-4 pb-3">
                {/* Nav buttons */}
                <div className="flex items-center gap-1 shrink-0">
                  <button
                    onClick={goBack}
                    disabled={!canGoBack}
                    className="p-1.5 rounded-lg hover:bg-white/10 text-muted-foreground hover:text-foreground transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                    title="Back"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    onClick={goForward}
                    disabled={!canGoForward}
                    className="p-1.5 rounded-lg hover:bg-white/10 text-muted-foreground hover:text-foreground transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                    title="Forward"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                  <button
                    onClick={reload}
                    className="p-1.5 rounded-lg hover:bg-white/10 text-muted-foreground hover:text-foreground transition-colors"
                    title="Reload"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => navigateTo("https://www.google.com")}
                    className="p-1.5 rounded-lg hover:bg-white/10 text-muted-foreground hover:text-foreground transition-colors"
                    title="Home"
                  >
                    <Home className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Address bar */}
                <form onSubmit={handleAddressSubmit} className="flex-1 min-w-0">
                  <div className={`flex items-center gap-2 px-3 py-2 rounded-xl bg-[#1a1b1e] border transition-all ${isEditingAddress ? "border-primary ring-1 ring-primary/30" : "border-white/10 hover:border-white/20"}`}>
                    {!isEditingAddress && (
                      secure
                        ? <Lock className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                        : <Globe className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                    )}
                    <input
                      ref={addressRef}
                      type="text"
                      value={isEditingAddress ? addressInput : getDisplayUrl(activeUrl)}
                      onChange={e => setAddressInput(e.target.value)}
                      onFocus={() => {
                        setIsEditingAddress(true);
                        setAddressInput(activeUrl ?? "");
                        setTimeout(() => addressRef.current?.select(), 0);
                      }}
                      onBlur={() => {
                        setIsEditingAddress(false);
                        setAddressInput(getDisplayUrl(activeUrl ?? ""));
                      }}
                      className="flex-1 bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground min-w-0"
                      placeholder="Search or enter URL..."
                    />
                  </div>
                </form>
              </div>
            </div>

            {/* ── Page content ── */}
            <div className="flex-1 bg-white relative">
              {iframeError ? (
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-5 bg-[#1a1b1e] text-center p-8">
                  <AlertTriangle className="w-14 h-14 text-amber-400" />
                  <div>
                    <h3 className="text-xl font-display font-bold mb-2">Site blocked embedding</h3>
                    <p className="text-muted-foreground max-w-sm text-sm">
                      This site won't allow embedding. Switch to <strong>Google Translate</strong> proxy in Settings, or open it directly in a new tab.
                    </p>
                  </div>
                  <div className="flex gap-3">
                    <button
                      onClick={() => window.open(activeUrl, "_blank")}
                      className="px-5 py-2.5 rounded-xl bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition-colors flex items-center gap-2 text-sm"
                    >
                      <ExternalLink className="w-4 h-4" /> New Tab
                    </button>
                    <button
                      onClick={() => {
                        const gt = `https://translate.google.com/translate?sl=auto&tl=en&u=${encodeURIComponent(activeUrl)}`;
                        navigateTo(gt, false);
                      }}
                      className="px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 font-semibold transition-colors text-sm"
                    >
                      Try Proxy
                    </button>
                  </div>
                </div>
              ) : (
                <iframe
                  key={key}
                  src={activeUrl}
                  className="absolute inset-0 w-full h-full border-none"
                  sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-modals allow-pointer-lock allow-downloads"
                  allow="fullscreen; autoplay; clipboard-write"
                  onError={() => setIframeError(true)}
                />
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </IframeContext.Provider>
  );
}

export function useIframe() {
  const context = useContext(IframeContext);
  if (!context) throw new Error("useIframe must be used within IframeProvider");
  return context;
}
