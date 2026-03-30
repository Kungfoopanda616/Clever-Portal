import { Link, useLocation } from "wouter";
import { Search, Gamepad2, LayoutGrid, MessageSquare, Settings, Shield, Disc } from "lucide-react";
import { cn } from "@/lib/utils";

export default function Header() {
  const [location] = useLocation();

  const navLinks = [
    { href: "/", label: "Home", icon: Search },
    { href: "/games", label: "Games", icon: Gamepad2 },
    { href: "/apps", label: "Apps", icon: LayoutGrid },
    { href: "/chat", label: "Chat", icon: MessageSquare },
    { href: "/settings", label: "Settings", icon: Settings },
    { href: "/admin", label: "Admin", icon: Shield },
    { href: "/discord", label: "Discord", icon: Disc },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/5 bg-background/80 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold text-xl shadow-lg shadow-primary/20">
            E
          </div>
          <span className="text-2xl font-bold text-foreground">Epstien</span>
        </Link>

        {/* Navigation */}
        <nav className="hidden md:flex items-center gap-1.5 p-1 rounded-full bg-white/5 border border-white/5">
          {navLinks.map((link) => (
            <Link key={link.href} href={link.href}>
              <button
                className={cn(
                  "flex items-center gap-2.5 px-4 py-2.5 rounded-full text-sm font-medium transition-colors whitespace-nowrap",
                  location === link.href
                    ? "bg-white/5 text-primary"
                    : "text-muted-foreground hover:bg-white/5 hover:text-foreground"
                )}
              >
                <link.icon className="w-4 h-4" />
                {link.label}
              </button>
            </Link>
          ))}
        </nav>

        {/* All Bookmarks Button */}
        <button className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors p-2 rounded-lg">
          <LayoutGrid className="w-5 h-5" /> All Bookmarks
        </button>
      </div>
    </header>
  );
}
