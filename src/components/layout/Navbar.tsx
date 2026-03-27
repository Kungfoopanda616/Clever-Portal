import { useState, useRef, useEffect } from "react";
import { Link, useRoute } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { Compass, Gamepad2, Settings, ShieldAlert, MessageCircle, ExternalLink, LayoutGrid } from "lucide-react";

const DISCORD_ICON = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
    <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057.1 18.08.11 18.1.127 18.11a19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/>
  </svg>
);

export function Navbar() {
  const [discordOpen, setDiscordOpen] = useState(false);
  const discordRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (discordRef.current && !discordRef.current.contains(e.target as Node)) {
        setDiscordOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const navItems = [
    { path: "/", label: "Home", icon: Compass },
    { path: "/games", label: "Games", icon: Gamepad2 },
    { path: "/apps", label: "Apps", icon: LayoutGrid },
    { path: "/chat", label: "Chat", icon: MessageCircle },
    { path: "/settings", label: "Settings", icon: Settings },
    { path: "/admin", label: "Admin", icon: ShieldAlert },
  ];

  return (
    <>
      <div className="w-full text-center py-0.5 bg-white/5 border-b border-white/5 text-[10px] text-muted-foreground/40 tracking-widest select-none">
        Colby, Trey, and Jacob Stink
      </div>
      <nav className="sticky top-0 z-40 w-full border-b border-white/5 bg-background/40 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-primary to-secondary flex items-center justify-center shadow-lg shadow-primary/20">
                <span className="text-white font-display font-bold text-lg leading-none">E</span>
              </div>
              <span className="font-display font-bold text-xl tracking-tight text-gradient hidden sm:block">Epstein</span>
            </div>

            {/* Nav links + Discord */}
            <div className="flex items-center space-x-1 sm:space-x-2">
              {navItems.map((item) => {
                const [isActive] = useRoute(item.path);
                const Icon = item.icon;
                return (
                  <Link key={item.path} href={item.path} className="relative px-3 py-2 sm:px-4 sm:py-2 rounded-xl text-sm font-medium transition-colors hover:text-foreground text-muted-foreground outline-none">
                    <div className="flex items-center gap-2 relative z-10">
                      <Icon className={`w-4 h-4 ${isActive ? "text-primary" : ""}`} />
                      <span className="hidden sm:block">{item.label}</span>
                    </div>
                    {isActive && (
                      <motion.div
                        layoutId="navbar-indicator"
                        className="absolute inset-0 rounded-xl bg-white/10 border border-white/10"
                        transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                      />
                    )}
                  </Link>
                );
              })}

              {/* Discord Button */}
              <div ref={discordRef} className="relative">
                <button
                  onClick={() => setDiscordOpen(prev => !prev)}
                  className="relative flex items-center gap-2 px-3 py-2 rounded-xl text-muted-foreground hover:text-[#7289da] transition-colors hover:bg-[#7289da]/10"
                  title="Join our Discord"
                >
                  <DISCORD_ICON />
                  <span className="hidden sm:block text-sm font-medium">Discord</span>
                </button>

                <AnimatePresence>
                  {discordOpen && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95, y: -8 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95, y: -8 }}
                      transition={{ type: "spring", damping: 20, stiffness: 300 }}
                      className="absolute right-0 top-full mt-2 w-64 bg-[#2b2d31] border border-white/10 rounded-2xl shadow-2xl shadow-black/40 overflow-hidden z-50"
                    >
                      {/* Discord banner */}
                      <div className="bg-[#5865f2] px-5 py-4">
                        <div className="flex items-center gap-3 mb-1">
                          <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                            <DISCORD_ICON />
                          </div>
                          <div>
                            <div className="font-display font-bold text-white text-sm">EFN Community</div>
                            <div className="text-white/70 text-xs">Elite Firewall Network</div>
                          </div>
                        </div>
                      </div>

                      <div className="p-4 space-y-3">
                        <p className="text-sm text-[#dbdee1] leading-relaxed">
                          Join our Discord to get updates, share links, and talk with the community.
                        </p>

                        <a
                          href="https://discord.gg/gBddYPJh6Y"
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={() => setDiscordOpen(false)}
                          className="flex items-center justify-center gap-2 w-full py-2.5 px-4 rounded-xl bg-[#5865f2] hover:bg-[#4752c4] text-white font-bold text-sm transition-colors active:scale-95"
                        >
                          <DISCORD_ICON />
                          Join Server
                          <ExternalLink className="w-3.5 h-3.5 opacity-70" />
                        </a>

                        <p className="text-[10px] text-[#949ba4] text-center break-all select-all">
                          discord.gg/gBddYPJh6Y
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>
      </nav>
    </>
  );
}
