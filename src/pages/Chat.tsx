import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, CornerDownRight, X, MessageCircle, UserX, Clock, Ban, CheckCircle } from "lucide-react";
import { useChat } from "@/hooks/useApi";
import type { ChatMessage } from "@/hooks/useApi";
import { useToast } from "@/hooks/use-toast";

const ADMIN_PASSWORD = "sumrall piggy";

function formatTime(iso: string) {
  const d = new Date(iso);
  return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

function UsernameSetup({ onSet }: { onSet: (name: string) => void }) {
  const [val, setVal] = useState("");
  return (
    <div className="min-h-[calc(100vh-6rem)] flex items-center justify-center p-4">
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-sm bg-card border border-white/10 rounded-3xl p-8 shadow-2xl text-center">
        <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
          <MessageCircle className="w-8 h-8 text-primary" />
        </div>
        <h2 className="text-2xl font-display font-bold mb-2">Choose a Username</h2>
        <p className="text-muted-foreground mb-6 text-sm">This is how others will see you in the chat.</p>
        <form onSubmit={(e) => { e.preventDefault(); if (val.trim().length >= 2) onSet(val.trim()); }}>
          <input
            value={val} onChange={e => setVal(e.target.value)}
            maxLength={20} placeholder="e.g. xX_Gamer_Xx"
            className="w-full px-4 py-3 rounded-xl bg-background border border-border focus:border-primary outline-none mb-4 text-center text-lg"
            autoFocus
          />
          <button type="submit" disabled={val.trim().length < 2}
            className="w-full py-3 rounded-xl font-bold bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-40 transition-all">
            Enter Chat
          </button>
        </form>
      </motion.div>
    </div>
  );
}

interface ModModalProps {
  target: string;
  onClose: () => void;
  onBan: (type: "ban" | "timeout", expiresAt: string | null, reason: string) => void;
}

function ModModal({ target, onClose, onBan }: ModModalProps) {
  const [mode, setMode] = useState<"ban" | "timeout">("timeout");
  const [minutes, setMinutes] = useState(5);
  const [reason, setReason] = useState("");

  const handle = () => {
    let expiresAt: string | null = null;
    if (mode === "timeout") {
      const d = new Date();
      d.setMinutes(d.getMinutes() + minutes);
      expiresAt = d.toISOString();
    }
    onBan(mode, expiresAt, reason);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" onClick={onClose} />
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
        className="relative w-full max-w-sm bg-card border border-white/10 rounded-2xl p-6 shadow-2xl">
        <h3 className="text-lg font-display font-bold mb-1">Moderate: <span className="text-primary">{target}</span></h3>
        <p className="text-muted-foreground text-sm mb-4">Choose an action to take.</p>
        <div className="flex gap-2 mb-4">
          {(["timeout", "ban"] as const).map(t => (
            <button key={t} onClick={() => setMode(t)}
              className={`flex-1 py-2 rounded-xl text-sm font-semibold transition-all ${mode === t ? "bg-destructive text-white" : "bg-white/5 hover:bg-white/10"}`}>
              {t === "timeout" ? <><Clock className="w-4 h-4 inline mr-1" />Timeout</> : <><Ban className="w-4 h-4 inline mr-1" />Perm Ban</>}
            </button>
          ))}
        </div>
        {mode === "timeout" && (
          <div className="mb-4">
            <label className="text-sm font-medium block mb-1">Duration</label>
            <div className="flex gap-2 flex-wrap">
              {[1, 5, 10, 30, 60, 120].map(m => (
                <button key={m} onClick={() => setMinutes(m)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${minutes === m ? "bg-primary text-white" : "bg-white/5 hover:bg-white/10"}`}>
                  {m < 60 ? `${m}m` : `${m / 60}h`}
                </button>
              ))}
            </div>
            <input type="number" value={minutes} min={1} max={10080} onChange={e => setMinutes(parseInt(e.target.value) || 5)}
              className="mt-2 w-full px-3 py-2 rounded-lg bg-background border border-border text-sm outline-none focus:border-primary"
              placeholder="Custom minutes..." />
          </div>
        )}
        <input value={reason} onChange={e => setReason(e.target.value)} placeholder="Reason (optional)"
          className="w-full px-3 py-2 rounded-lg bg-background border border-border text-sm mb-4 outline-none focus:border-primary" />
        <div className="flex gap-2">
          <button onClick={onClose} className="flex-1 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-sm font-medium transition-all">Cancel</button>
          <button onClick={handle} className="flex-1 py-2 rounded-xl bg-destructive text-white text-sm font-semibold hover:bg-destructive/80 transition-all">
            Apply
          </button>
        </div>
      </motion.div>
    </div>
  );
}

export default function Chat() {
  const [username, setUsernameState] = useState<string | null>(() => localStorage.getItem("chat_username"));
  const [isAdmin, setIsAdmin] = useState(() => localStorage.getItem("chat_admin") === "true");
  const [input, setInput] = useState("");
  const [replyTo, setReplyTo] = useState<ChatMessage | null>(null);
  const [modTarget, setModTarget] = useState<string | null>(null);
  const [adminPw, setAdminPw] = useState("");
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  const { messages, loading, banned, sendMessage, deleteMessage, banUser, unbanUser } = useChat(username);

  const setUsername = (name: string) => {
    setUsernameState(name);
    localStorage.setItem("chat_username", name);
  };

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  if (!username) return <UsernameSetup onSet={setUsername} />;

  if (banned.banned) {
    return (
      <div className="min-h-[calc(100vh-6rem)] flex items-center justify-center p-4">
        <div className="text-center bg-card border border-destructive/30 rounded-3xl p-8 max-w-sm">
          <Ban className="w-12 h-12 text-destructive mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">You're {banned.banType === "ban" ? "Banned" : "Timed Out"}</h2>
          {banned.reason && <p className="text-muted-foreground text-sm mb-2">Reason: {banned.reason}</p>}
          {banned.expiresAt && <p className="text-muted-foreground text-sm">Until: {new Date(banned.expiresAt).toLocaleString()}</p>}
          {!banned.expiresAt && banned.banType === "ban" && <p className="text-muted-foreground text-sm">This ban is permanent.</p>}
        </div>
      </div>
    );
  }

  const handleSend = async () => {
    const content = input.trim();
    if (!content) return;
    try {
      await sendMessage(content, replyTo?.id);
      setInput("");
      setReplyTo(null);
    } catch (err: any) {
      toast({ title: "Failed to send", description: err.message, variant: "destructive" });
    }
  };

  const handleBan = async (type: "ban" | "timeout", expiresAt: string | null, reason: string) => {
    if (!modTarget) return;
    try {
      await banUser(modTarget, type, expiresAt, reason || null);
      toast({ title: `${modTarget} ${type === "ban" ? "banned" : "timed out"}` });
    } catch {
      toast({ title: "Failed to moderate", variant: "destructive" });
    }
  };

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (adminPw === ADMIN_PASSWORD) {
      setIsAdmin(true);
      localStorage.setItem("chat_admin", "true");
      setShowAdminLogin(false);
      toast({ title: "Admin mode enabled" });
    } else {
      toast({ title: "Wrong password", variant: "destructive" });
    }
  };

  const replyMsg = replyTo ? messages.find(m => m.id === replyTo.id) : null;

  return (
    <div className="flex flex-col h-[calc(100vh-5rem)]">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-white/5 bg-background/30 backdrop-blur-sm">
        <div className="flex items-center gap-3">
          <MessageCircle className="w-5 h-5 text-primary" />
          <h1 className="font-display font-bold">EFN Chat</h1>
          <span className="text-xs text-muted-foreground bg-white/5 px-2 py-1 rounded-full">{username}</span>
        </div>
        <div className="flex items-center gap-2">
          {!isAdmin && (
            <button onClick={() => setShowAdminLogin(true)}
              className="text-xs text-muted-foreground hover:text-foreground px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 transition-all">
              Admin Login
            </button>
          )}
          {isAdmin && (
            <span className="text-xs text-amber-400 bg-amber-400/10 px-2 py-1 rounded-full font-medium flex items-center gap-1">
              <ShieldIcon /> Admin
            </span>
          )}
          <button onClick={() => { setUsernameState(null); localStorage.removeItem("chat_username"); }}
            className="text-xs text-muted-foreground hover:text-foreground px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 transition-all">
            Change Name
          </button>
        </div>
      </div>

      {/* Admin login modal */}
      <AnimatePresence>
        {showAdminLogin && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" onClick={() => setShowAdminLogin(false)} />
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
              className="relative bg-card border border-white/10 rounded-2xl p-6 w-full max-w-sm shadow-2xl">
              <h3 className="text-lg font-bold mb-4">Admin Login</h3>
              <form onSubmit={handleAdminLogin} className="space-y-3">
                <input type="password" value={adminPw} onChange={e => setAdminPw(e.target.value)}
                  placeholder="Admin password..." autoFocus
                  className="w-full px-4 py-3 rounded-xl bg-background border border-border outline-none focus:border-primary" />
                <button type="submit" className="w-full py-3 rounded-xl bg-primary text-white font-bold hover:bg-primary/90">Unlock</button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
        {loading ? (
          <div className="flex items-center justify-center h-full text-muted-foreground">Loading messages...</div>
        ) : messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-muted-foreground gap-2">
            <MessageCircle className="w-10 h-10 opacity-30" />
            <p>No messages yet. Say something!</p>
          </div>
        ) : (
          messages.map(msg => {
            const replied = msg.replyToId ? messages.find(m => m.id === msg.replyToId) : null;
            const isOwn = msg.username === username;
            return (
              <motion.div key={msg.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                className={`flex ${isOwn ? "justify-end" : "justify-start"} group`}>
                <div className={`max-w-[75%] ${isOwn ? "items-end" : "items-start"} flex flex-col gap-1`}>
                  {!isOwn && (
                    <span className="text-xs text-muted-foreground px-1 font-medium">{msg.username}</span>
                  )}
                  {replied && (
                    <div className={`flex items-start gap-1.5 text-xs text-muted-foreground px-2 py-1 rounded-lg bg-white/5 border-l-2 border-primary/40 ${isOwn ? "self-end" : "self-start"}`}>
                      <CornerDownRight className="w-3 h-3 mt-0.5 shrink-0" />
                      <span className="truncate max-w-[200px]"><strong>{replied.username}:</strong> {replied.content}</span>
                    </div>
                  )}
                  <div className={`px-4 py-2.5 rounded-2xl ${isOwn ? "bg-primary text-primary-foreground rounded-br-sm" : "bg-card border border-white/10 rounded-bl-sm"}`}>
                    <p className="text-sm leading-relaxed break-words">{msg.content}</p>
                  </div>
                  <div className={`flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity ${isOwn ? "flex-row-reverse" : ""}`}>
                    <span className="text-[10px] text-muted-foreground">{formatTime(msg.createdAt)}</span>
                    <button onClick={() => setReplyTo(msg)} className="text-[10px] text-muted-foreground hover:text-foreground px-1.5 py-0.5 rounded bg-white/5 hover:bg-white/10 transition-all">
                      Reply
                    </button>
                    {isAdmin && !isOwn && (
                      <>
                        <button onClick={() => setModTarget(msg.username)} className="text-[10px] text-amber-400 hover:text-amber-300 px-1.5 py-0.5 rounded bg-amber-400/10 hover:bg-amber-400/20 transition-all">
                          Mod
                        </button>
                        <button onClick={() => deleteMessage(msg.id)} className="text-[10px] text-destructive hover:text-red-400 px-1.5 py-0.5 rounded bg-destructive/10 hover:bg-destructive/20 transition-all">
                          Del
                        </button>
                      </>
                    )}
                    {isOwn && (
                      <button onClick={() => deleteMessage(msg.id)} className="text-[10px] text-muted-foreground hover:text-destructive px-1.5 py-0.5 rounded bg-white/5 hover:bg-destructive/10 transition-all">
                        Del
                      </button>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })
        )}
        <div ref={bottomRef} />
      </div>

      {/* Reply bar */}
      <AnimatePresence>
        {replyTo && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }}
            className="flex items-center gap-3 px-4 py-2 bg-white/5 border-t border-white/5">
            <CornerDownRight className="w-4 h-4 text-primary shrink-0" />
            <div className="flex-1 min-w-0">
              <span className="text-xs font-medium text-primary">{replyTo.username}</span>
              <p className="text-xs text-muted-foreground truncate">{replyTo.content}</p>
            </div>
            <button onClick={() => setReplyTo(null)} className="text-muted-foreground hover:text-foreground transition-colors">
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Input */}
      <div className="px-4 py-3 border-t border-white/5 bg-background/30 backdrop-blur-sm">
        <form onSubmit={e => { e.preventDefault(); handleSend(); }} className="flex gap-2">
          <input
            value={input} onChange={e => setInput(e.target.value)} maxLength={500}
            placeholder="Type a message..."
            className="flex-1 px-4 py-3 rounded-xl bg-card border border-white/10 focus:border-primary outline-none text-sm transition-all"
          />
          <button type="submit" disabled={!input.trim()}
            className="px-4 py-3 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-40 transition-all active:scale-95">
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>

      {/* Mod modal */}
      <AnimatePresence>
        {modTarget && (
          <ModModal target={modTarget} onClose={() => setModTarget(null)} onBan={handleBan} />
        )}
      </AnimatePresence>
    </div>
  );
}

function ShieldIcon() {
  return (
    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
      <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z" />
    </svg>
  );
}
