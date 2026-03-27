import React, { createContext, useContext, useEffect, useState } from "react";

export type ProxyMode = "direct" | "newtab" | "googletranslate";
export type AppTheme = "default" | "midnight" | "forest" | "sunset" | "ice" | "mono";

interface SettingsContextType {
  tabTitle: string;
  tabIcon: string;
  searchEngine: string;
  proxyMode: ProxyMode;
  theme: AppTheme;
  selectedBgUrl: string | null;
  setTabTitle: (title: string) => void;
  setTabIcon: (icon: string) => void;
  setSearchEngine: (engine: string) => void;
  setProxyMode: (mode: ProxyMode) => void;
  setTheme: (theme: AppTheme) => void;
  setSelectedBgUrl: (url: string | null) => void;
  resetCloak: () => void;
}

const DEFAULT_TITLE = "Epstien Browser";
const DEFAULT_ICON = "/favicon.svg";

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [tabTitle, setTabTitleState] = useState(() => localStorage.getItem("nebula_tab_title") || DEFAULT_TITLE);
  const [tabIcon, setTabIconState] = useState(() => localStorage.getItem("nebula_tab_icon") || DEFAULT_ICON);
  const [searchEngine, setSearchEngineState] = useState(() => localStorage.getItem("nebula_search_engine") || "google");
  const [proxyMode, setProxyModeState] = useState<ProxyMode>(() => (localStorage.getItem("nebula_proxy_mode") as ProxyMode) || "direct");
  const [theme, setThemeState] = useState<AppTheme>(() => (localStorage.getItem("nebula_theme") as AppTheme) || "default");
  const [selectedBgUrl, setSelectedBgUrlState] = useState<string | null>(() => localStorage.getItem("nebula_bg_url") || null);

  const setTabTitle = (title: string) => { setTabTitleState(title); localStorage.setItem("nebula_tab_title", title); };
  const setTabIcon = (icon: string) => { setTabIconState(icon); localStorage.setItem("nebula_tab_icon", icon); };
  const setSearchEngine = (engine: string) => { setSearchEngineState(engine); localStorage.setItem("nebula_search_engine", engine); };
  const setProxyMode = (mode: ProxyMode) => { setProxyModeState(mode); localStorage.setItem("nebula_proxy_mode", mode); };
  const setTheme = (t: AppTheme) => { setThemeState(t); localStorage.setItem("nebula_theme", t); };
  const setSelectedBgUrl = (url: string | null) => {
    setSelectedBgUrlState(url);
    if (url) localStorage.setItem("nebula_bg_url", url);
    else localStorage.removeItem("nebula_bg_url");
  };
  const resetCloak = () => { setTabTitle(DEFAULT_TITLE); setTabIcon(DEFAULT_ICON); };

  useEffect(() => { document.title = tabTitle; }, [tabTitle]);

  useEffect(() => {
    let link = document.querySelector("link[rel~='icon']") as HTMLLinkElement;
    if (!link) { link = document.createElement("link"); link.rel = "icon"; document.head.appendChild(link); }
    link.href = tabIcon;
  }, [tabIcon]);

  useEffect(() => {
    const root = document.documentElement;
    root.removeAttribute("data-theme");
    if (theme !== "default") root.setAttribute("data-theme", theme);
  }, [theme]);

  // Apply background image directly to body
  useEffect(() => {
    if (selectedBgUrl) {
      document.body.style.backgroundImage = `url('${selectedBgUrl}')`;
      document.body.style.backgroundSize = "cover";
      document.body.style.backgroundPosition = "center";
      document.body.style.backgroundAttachment = "fixed";
    } else {
      document.body.style.backgroundImage = "";
      document.body.style.backgroundSize = "";
      document.body.style.backgroundPosition = "";
      document.body.style.backgroundAttachment = "";
    }
  }, [selectedBgUrl]);

  return (
    <SettingsContext.Provider value={{ tabTitle, tabIcon, searchEngine, proxyMode, theme, selectedBgUrl, setTabTitle, setTabIcon, setSearchEngine, setProxyMode, setTheme, setSelectedBgUrl, resetCloak }}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const context = useContext(SettingsContext);
  if (!context) throw new Error("useSettings must be used within SettingsProvider");
  return context;
}
