import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShieldAlert, Plus, Edit2, Trash2, Link as LinkIcon, Gamepad2,
  ImageIcon, X, Loader2, Check, ExternalLink
} from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useQueryClient } from "@tanstack/react-query";
import {
  useGetLinks, getGetLinksQueryKey,
  useCreateLink, useUpdateLink, useDeleteLink,
  Link, CreateLinkCategory
} from "@workspace/api-client-react";
import { useBackgrounds } from "@/hooks/useApi";
import { useToast } from "@/hooks/use-toast";

const ADMIN_PASSWORD = "sumrall piggy";

const linkSchema = z.object({
  name: z.string().min(1, "Name is required"),
  url: z.string().url("Must be a valid URL"),
  category: z.enum(["games", "sites"]),
  icon: z.string().optional(),
  position: z.coerce.number().int().default(0),
});
type LinkFormData = z.infer<typeof linkSchema>;

const bgSchema = z.object({
  name: z.string().min(1, "Name is required"),
  url: z.string().url("Must be a valid URL"),
});
type BgFormData = z.infer<typeof bgSchema>;

type AdminTab = "links" | "backgrounds";

export default function Admin() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [activeTab, setActiveTab] = useState<AdminTab>("links");

  // Link state
  const [isLinkFormOpen, setIsLinkFormOpen] = useState(false);
  const [editingLink, setEditingLink] = useState<Link | null>(null);

  // Background state
  const [isBgFormOpen, setIsBgFormOpen] = useState(false);
  const [bgPreviewUrl, setBgPreviewUrl] = useState("");

  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data: links = [], isLoading: linksLoading } = useGetLinks();
  const createLinkMutation = useCreateLink();
  const updateLinkMutation = useUpdateLink();
  const deleteLinkMutation = useDeleteLink();

  const { data: backgrounds, loading: bgsLoading, refresh: refetchBgs } = useBackgrounds();

  const linkForm = useForm<LinkFormData>({
    resolver: zodResolver(linkSchema),
    defaultValues: { category: "games", position: 0 }
  });

  const bgForm = useForm<BgFormData>({ resolver: zodResolver(bgSchema) });

  // ── Auth ──
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      toast({ title: "Access Granted", description: "Welcome to Admin Panel" });
    } else {
      toast({ title: "Access Denied", description: "Incorrect password", variant: "destructive" });
    }
  };

  // ── Links ──
  const openLinkForm = (link?: Link) => {
    if (link) {
      setEditingLink(link);
      linkForm.reset({ name: link.name, url: link.url, category: link.category as "games" | "sites", icon: link.icon || "", position: link.position });
    } else {
      setEditingLink(null);
      linkForm.reset({ category: "games", position: 0, name: "", url: "", icon: "" });
    }
    setIsLinkFormOpen(true);
  };

  const onLinkSubmit = (data: LinkFormData) => {
    const submitData = { ...data, icon: data.icon || null, category: data.category as CreateLinkCategory };
    if (editingLink) {
      updateLinkMutation.mutate({ id: editingLink.id, data: submitData }, {
        onSuccess: () => { queryClient.invalidateQueries({ queryKey: getGetLinksQueryKey() }); toast({ title: "Link Updated" }); setIsLinkFormOpen(false); },
        onError: () => toast({ title: "Error updating link", variant: "destructive" })
      });
    } else {
      createLinkMutation.mutate({ data: submitData }, {
        onSuccess: () => { queryClient.invalidateQueries({ queryKey: getGetLinksQueryKey() }); toast({ title: "Link Created" }); setIsLinkFormOpen(false); },
        onError: () => toast({ title: "Error creating link", variant: "destructive" })
      });
    }
  };

  const handleDeleteLink = (id: number) => {
    if (confirm("Delete this link?")) {
      deleteLinkMutation.mutate({ id }, {
        onSuccess: () => { queryClient.invalidateQueries({ queryKey: getGetLinksQueryKey() }); toast({ title: "Link Deleted" }); },
        onError: () => toast({ title: "Error deleting link", variant: "destructive" })
      });
    }
  };

  // ── Backgrounds ──
  const BASE = import.meta.env.BASE_URL.replace(/\/$/, "");

  const onBgSubmit = async (data: BgFormData) => {
    try {
      const res = await fetch(`${BASE}/api/backgrounds`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: data.name, url: data.url }),
      });
      if (!res.ok) throw new Error("Failed");
      toast({ title: "Background Added" });
      bgForm.reset();
      setBgPreviewUrl("");
      setIsBgFormOpen(false);
      refetchBgs();
    } catch {
      toast({ title: "Error adding background", variant: "destructive" });
    }
  };

  const handleDeleteBg = async (id: number, name: string) => {
    if (!confirm(`Delete background "${name}"?`)) return;
    try {
      const res = await fetch(`${BASE}/api/backgrounds/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed");
      toast({ title: "Background Deleted" });
      refetchBgs();
    } catch {
      toast({ title: "Error deleting background", variant: "destructive" });
    }
  };

  // ── Login screen ──
  if (!isAuthenticated) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-md p-8 bg-card border border-white/10 rounded-3xl shadow-2xl"
        >
          <div className="flex justify-center mb-6">
            <div className="p-4 rounded-full bg-destructive/10 text-destructive">
              <ShieldAlert className="w-10 h-10" />
            </div>
          </div>
          <h2 className="text-3xl font-display font-bold text-center mb-2">Admin Access</h2>
          <p className="text-muted-foreground text-center mb-8">Enter password to manage the site.</p>
          <form onSubmit={handleLogin} className="space-y-4">
            <input
              type="password" value={password} onChange={e => setPassword(e.target.value)}
              placeholder="Enter password..." autoFocus
              className="w-full px-5 py-4 text-lg rounded-xl bg-background border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all outline-none"
            />
            <button type="submit" className="w-full py-4 rounded-xl font-bold bg-primary text-primary-foreground hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20">
              Unlock Panel
            </button>
          </form>
        </motion.div>
      </div>
    );
  }

  // ── Admin panel ──
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-display font-bold mb-1 text-gradient">Admin Panel</h1>
          <p className="text-muted-foreground">Manage links, apps, and backgrounds.</p>
        </div>

        {/* Tab switcher + action button */}
        <div className="flex items-center gap-3">
          <div className="flex rounded-xl overflow-hidden border border-white/10 bg-white/5">
            <button
              onClick={() => setActiveTab("links")}
              className={`flex items-center gap-2 px-4 py-2 text-sm font-medium transition-colors ${activeTab === "links" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`}
            >
              <LinkIcon className="w-4 h-4" /> Links
            </button>
            <button
              onClick={() => setActiveTab("backgrounds")}
              className={`flex items-center gap-2 px-4 py-2 text-sm font-medium transition-colors ${activeTab === "backgrounds" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`}
            >
              <ImageIcon className="w-4 h-4" /> Backgrounds
            </button>
          </div>

          {activeTab === "links" ? (
            <button
              onClick={() => openLinkForm()}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition-all shadow-lg shadow-primary/25"
            >
              <Plus className="w-5 h-5" /> Add Link
            </button>
          ) : (
            <button
              onClick={() => setIsBgFormOpen(true)}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition-all shadow-lg shadow-primary/25"
            >
              <Plus className="w-5 h-5" /> Add Background
            </button>
          )}
        </div>
      </div>

      {/* ── Links tab ── */}
      {activeTab === "links" && (
        <div className="bg-card border border-white/10 rounded-2xl overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-white/5 border-b border-white/10 text-muted-foreground text-sm uppercase tracking-wider">
                  <th className="p-4 font-medium">Type</th>
                  <th className="p-4 font-medium">Name</th>
                  <th className="p-4 font-medium">URL</th>
                  <th className="p-4 font-medium text-center">Position</th>
                  <th className="p-4 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {linksLoading ? (
                  <tr><td colSpan={5} className="p-8 text-center text-muted-foreground">Loading...</td></tr>
                ) : links.length === 0 ? (
                  <tr><td colSpan={5} className="p-8 text-center text-muted-foreground">No links yet. Add one above.</td></tr>
                ) : (
                  links.map(link => (
                    <tr key={link.id} className="hover:bg-white/[0.02] transition-colors">
                      <td className="p-4">
                        {link.category === "games" ? (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-purple-500/10 text-purple-400 text-xs font-semibold">
                            <Gamepad2 className="w-3 h-3" /> Game
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-cyan-500/10 text-cyan-400 text-xs font-semibold">
                            <LinkIcon className="w-3 h-3" /> Site
                          </span>
                        )}
                      </td>
                      <td className="p-4 font-medium">
                        <div className="flex items-center gap-3">
                          {link.icon && (
                            <div className="w-6 h-6 rounded bg-white/10 flex items-center justify-center text-xs overflow-hidden shrink-0">
                              {link.icon.startsWith("http") ? <img src={link.icon} className="w-full h-full object-cover" /> : link.icon}
                            </div>
                          )}
                          {link.name}
                        </div>
                      </td>
                      <td className="p-4 text-muted-foreground text-sm max-w-[200px] truncate" title={link.url}>{link.url}</td>
                      <td className="p-4 text-center">{link.position}</td>
                      <td className="p-4 text-right space-x-2">
                        <button onClick={() => openLinkForm(link)} className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-muted-foreground hover:text-foreground transition-colors">
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button onClick={() => handleDeleteLink(link.id)} disabled={deleteLinkMutation.isPending} className="p-2 rounded-lg bg-destructive/10 hover:bg-destructive text-destructive hover:text-white transition-colors disabled:opacity-50">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ── Backgrounds tab ── */}
      {activeTab === "backgrounds" && (
        <div>
          {bgsLoading ? (
            <div className="flex items-center justify-center py-16 text-muted-foreground gap-2">
              <Loader2 className="w-5 h-5 animate-spin" /> Loading...
            </div>
          ) : backgrounds.length === 0 ? (
            <div className="text-center py-24 bg-card/40 rounded-3xl border border-white/5 border-dashed">
              <ImageIcon className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-40" />
              <h3 className="text-xl font-display font-semibold mb-2">No backgrounds yet</h3>
              <p className="text-muted-foreground mb-6">Add image URLs and they'll appear in Settings for all users.</p>
              <button onClick={() => setIsBgFormOpen(true)} className="px-5 py-2.5 rounded-xl bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition-colors">
                Add First Background
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {backgrounds.map(bg => (
                <div key={bg.id} className="relative group rounded-2xl overflow-hidden aspect-video border border-white/10">
                  <img
                    src={bg.url} alt={bg.name}
                    className="w-full h-full object-cover"
                    onError={e => { (e.target as HTMLImageElement).style.opacity = "0.2"; }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                  <span className="absolute bottom-2 left-3 text-xs font-semibold text-white/90 truncate max-w-[calc(100%-3rem)]">{bg.name}</span>

                  {/* Delete button */}
                  <button
                    onClick={() => handleDeleteBg(bg.id, bg.name)}
                    className="absolute top-2 right-2 w-7 h-7 rounded-full bg-black/60 hover:bg-destructive flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all"
                    title="Delete"
                  >
                    <Trash2 className="w-3.5 h-3.5 text-white" />
                  </button>

                  {/* Preview link */}
                  <a
                    href={bg.url} target="_blank" rel="noopener noreferrer"
                    className="absolute top-2 left-2 w-7 h-7 rounded-full bg-black/60 hover:bg-white/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all"
                    title="View full image"
                  >
                    <ExternalLink className="w-3.5 h-3.5 text-white" />
                  </a>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ── Add Link Modal ── */}
      <AnimatePresence>
        {isLinkFormOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setIsLinkFormOpen(false)}
              className="absolute inset-0 bg-background/80 backdrop-blur-sm" />
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-lg bg-card border border-white/10 rounded-2xl shadow-2xl overflow-hidden">
              <div className="flex items-center justify-between p-6 border-b border-white/5 bg-white/[0.02]">
                <h3 className="text-xl font-display font-bold">{editingLink ? "Edit Link" : "Add New Link"}</h3>
                <button onClick={() => setIsLinkFormOpen(false)} className="p-1.5 rounded-lg hover:bg-white/10 text-muted-foreground"><X className="w-5 h-5" /></button>
              </div>
              <form onSubmit={linkForm.handleSubmit(onLinkSubmit)} className="p-6 space-y-5">
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2">
                    <label className="block text-sm font-medium mb-1.5">Name *</label>
                    <input {...linkForm.register("name")} className="w-full px-4 py-2.5 rounded-xl bg-background border border-border focus:border-primary outline-none" placeholder="e.g. Minecraft" />
                    {linkForm.formState.errors.name && <p className="text-destructive text-xs mt-1">{linkForm.formState.errors.name.message}</p>}
                  </div>
                  <div className="col-span-2">
                    <label className="block text-sm font-medium mb-1.5">URL *</label>
                    <input {...linkForm.register("url")} className="w-full px-4 py-2.5 rounded-xl bg-background border border-border focus:border-primary outline-none" placeholder="https://..." />
                    {linkForm.formState.errors.url && <p className="text-destructive text-xs mt-1">{linkForm.formState.errors.url.message}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1.5">Category *</label>
                    <select {...linkForm.register("category")} className="w-full px-4 py-2.5 rounded-xl bg-background border border-border focus:border-primary outline-none appearance-none">
                      <option value="games">Game</option>
                      <option value="sites">App / Site</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1.5">Sort Position</label>
                    <input type="number" {...linkForm.register("position")} className="w-full px-4 py-2.5 rounded-xl bg-background border border-border focus:border-primary outline-none" placeholder="0" />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-sm font-medium mb-1.5">Icon (Emoji or URL)</label>
                    <input {...linkForm.register("icon")} className="w-full px-4 py-2.5 rounded-xl bg-background border border-border focus:border-primary outline-none" placeholder="🎮 or https://...icon.png" />
                  </div>
                </div>
                <div className="pt-4 flex justify-end gap-3 border-t border-white/5">
                  <button type="button" onClick={() => setIsLinkFormOpen(false)} className="px-5 py-2.5 rounded-xl font-medium hover:bg-white/5 transition-colors">Cancel</button>
                  <button type="submit" disabled={createLinkMutation.isPending || updateLinkMutation.isPending}
                    className="px-6 py-2.5 rounded-xl font-semibold bg-primary text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-50">
                    {createLinkMutation.isPending || updateLinkMutation.isPending ? "Saving..." : "Save Link"}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ── Add Background Modal ── */}
      <AnimatePresence>
        {isBgFormOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => { setIsBgFormOpen(false); bgForm.reset(); setBgPreviewUrl(""); }}
              className="absolute inset-0 bg-background/80 backdrop-blur-sm" />
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-lg bg-card border border-white/10 rounded-2xl shadow-2xl overflow-hidden">
              <div className="flex items-center justify-between p-6 border-b border-white/5 bg-white/[0.02]">
                <h3 className="text-xl font-display font-bold">Add Background</h3>
                <button onClick={() => { setIsBgFormOpen(false); bgForm.reset(); setBgPreviewUrl(""); }} className="p-1.5 rounded-lg hover:bg-white/10 text-muted-foreground"><X className="w-5 h-5" /></button>
              </div>
              <form onSubmit={bgForm.handleSubmit(onBgSubmit)} className="p-6 space-y-5">
                <div>
                  <label className="block text-sm font-medium mb-1.5">Background Name *</label>
                  <input {...bgForm.register("name")} className="w-full px-4 py-2.5 rounded-xl bg-background border border-border focus:border-primary outline-none" placeholder="e.g. Space Nebula" />
                  {bgForm.formState.errors.name && <p className="text-destructive text-xs mt-1">{bgForm.formState.errors.name.message}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1.5">Image URL *</label>
                  <input
                    {...bgForm.register("url")}
                    onChange={e => { bgForm.setValue("url", e.target.value); setBgPreviewUrl(e.target.value); }}
                    className="w-full px-4 py-2.5 rounded-xl bg-background border border-border focus:border-primary outline-none"
                    placeholder="https://images.unsplash.com/..."
                  />
                  {bgForm.formState.errors.url && <p className="text-destructive text-xs mt-1">{bgForm.formState.errors.url.message}</p>}
                </div>

                {/* Live preview */}
                {bgPreviewUrl && (
                  <div className="rounded-xl overflow-hidden aspect-video border border-white/10 bg-black relative">
                    <img
                      src={bgPreviewUrl} alt="Preview"
                      className="w-full h-full object-cover"
                      onError={e => { (e.target as HTMLImageElement).style.opacity = "0.2"; }}
                    />
                    <div className="absolute bottom-2 left-3 flex items-center gap-1 text-[10px] text-white/60">
                      <Check className="w-3 h-3 text-emerald-400" /> Preview
                    </div>
                  </div>
                )}

                <div className="pt-4 flex justify-end gap-3 border-t border-white/5">
                  <button type="button" onClick={() => { setIsBgFormOpen(false); bgForm.reset(); setBgPreviewUrl(""); }} className="px-5 py-2.5 rounded-xl font-medium hover:bg-white/5 transition-colors">Cancel</button>
                  <button type="submit" className="px-6 py-2.5 rounded-xl font-semibold bg-primary text-primary-foreground hover:bg-primary/90 transition-colors">
                    Add Background
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
