import { useState, useEffect, useCallback } from "react";

const BASE = import.meta.env.BASE_URL.replace(/\/$/, "");

async function apiFetch<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`/api${path}`, options);
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: "Request failed" }));
    throw new Error(err.error || "Request failed");
  }
  if (res.status === 204) return null as T;
  return res.json();
}

// Generic types
export interface Background { id: number; name: string; url: string; isPreset: boolean; createdAt: string; }
export interface AccessLink { id: number; name: string; url: string; createdAt: string; }
export interface ChatMessage { id: number; username: string; content: string; replyToId: number | null; createdAt: string; }
export interface ChatBan { id: number; username: string; banType: string; expiresAt: string | null; reason: string | null; active: boolean; createdAt: string; }

// Backgrounds
export function useBackgrounds() {
  const [data, setData] = useState<Background[]>([]);
  const [loading, setLoading] = useState(true);
  const refresh = useCallback(() => {
    apiFetch<Background[]>("/backgrounds").then(setData).catch(console.error).finally(() => setLoading(false));
  }, []);
  useEffect(() => { refresh(); }, [refresh]);

  const create = async (name: string, url: string) => {
    const bg = await apiFetch<Background>("/backgrounds", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ name, url }) });
    setData(prev => [...prev, bg]);
    return bg;
  };
  const remove = async (id: number) => {
    await apiFetch(`/backgrounds/${id}`, { method: "DELETE" });
    setData(prev => prev.filter(b => b.id !== id));
  };
  const uploadFile = async (file: File, name: string): Promise<Background> => {
    const form = new FormData();
    form.append("image", file);
    const res = await fetch(`/api/upload/background`, { method: "POST", body: form });
    if (!res.ok) throw new Error("Upload failed");
    const { url } = await res.json();
    return create(name, url);
  };

  return { data, loading, refresh, create, remove, uploadFile };
}

// Access Links
export function useAccessLinks() {
  const [data, setData] = useState<AccessLink[]>([]);
  const [loading, setLoading] = useState(true);
  const refresh = useCallback(() => {
    apiFetch<AccessLink[]>("/access-links").then(setData).catch(console.error).finally(() => setLoading(false));
  }, []);
  useEffect(() => { refresh(); }, [refresh]);

  const create = async (name: string, url: string) => {
    const link = await apiFetch<AccessLink>("/access-links", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ name, url }) });
    setData(prev => [...prev, link]);
    return link;
  };
  const remove = async (id: number) => {
    await apiFetch(`/access-links/${id}`, { method: "DELETE" });
    setData(prev => prev.filter(l => l.id !== id));
  };

  return { data, loading, refresh, create, remove };
}

// Chat
export function useChat(username: string | null) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastId, setLastId] = useState(0);
  const [banned, setBanned] = useState<{ banned: boolean; banType?: string; expiresAt?: string; reason?: string }>({ banned: false });

  useEffect(() => {
    apiFetch<ChatMessage[]>("/chat/messages?limit=100").then(msgs => {
      setMessages(msgs);
      if (msgs.length > 0) setLastId(msgs[msgs.length - 1].id);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (!username) return;
    apiFetch<{ banned: boolean; banType?: string; expiresAt?: string; reason?: string }>(`/chat/banned/${encodeURIComponent(username)}`)
      .then(setBanned).catch(console.error);
  }, [username]);

  useEffect(() => {
    const interval = setInterval(() => {
      apiFetch<ChatMessage[]>(`/chat/messages/since/${lastId}`)
        .then(newMsgs => {
          if (newMsgs.length > 0) {
            setMessages(prev => {
              const ids = new Set(prev.map(m => m.id));
              const fresh = newMsgs.filter(m => !ids.has(m.id));
              const combined = [...prev, ...fresh];
              return combined.slice(-200);
            });
            setLastId(newMsgs[newMsgs.length - 1].id);
          }
        }).catch(console.error);
    }, 2500);
    return () => clearInterval(interval);
  }, [lastId]);

  const sendMessage = async (content: string, replyToId?: number | null) => {
    if (!username) throw new Error("No username");
    const msg = await apiFetch<ChatMessage>("/chat/messages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, content, replyToId: replyToId ?? null }),
    });
    setMessages(prev => {
      const ids = new Set(prev.map(m => m.id));
      if (ids.has(msg.id)) return prev;
      const combined = [...prev, msg];
      setLastId(msg.id);
      return combined.slice(-200);
    });
    return msg;
  };

  const deleteMessage = async (id: number) => {
    await apiFetch(`/chat/messages/${id}`, { method: "DELETE" });
    setMessages(prev => prev.filter(m => m.id !== id));
  };

  const banUser = async (targetUsername: string, banType: "ban" | "timeout", expiresAt: string | null, reason?: string) => {
    await apiFetch("/chat/ban", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username: targetUsername, banType, expiresAt, reason }),
    });
  };

  const unbanUser = async (targetUsername: string) => {
    await apiFetch(`/chat/unban/${encodeURIComponent(targetUsername)}`, { method: "POST" });
  };

  return { messages, loading, banned, sendMessage, deleteMessage, banUser, unbanUser };
}

export function useActiveBans() {
  const [bans, setBans] = useState<ChatBan[]>([]);
  const refresh = useCallback(() => {
    apiFetch<ChatBan[]>("/chat/bans").then(setBans).catch(console.error);
  }, []);
  useEffect(() => { refresh(); }, [refresh]);
  return { bans, refresh };
}
