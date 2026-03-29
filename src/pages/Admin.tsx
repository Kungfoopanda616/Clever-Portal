import { useState } from "react";
import { Plus, Pencil, Trash2, Save, X, LayoutGrid, Gamepad2 } from "lucide-react";
import { useGetLinks, useCreateLink, useUpdateLink, useDeleteLink } from "@/hooks/use-links";
import { useToast } from "@/hooks/use-toast";

export default function Admin() {
  const { data: links = [], isLoading } = useGetLinks();
  const createLink = useCreateLink();
  const updateLink = useUpdateLink();
  const deleteLink = useDeleteLink();
  const { toast } = useToast();

  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    url: "",
    icon: "",
    category: "games" as "games" | "apps",
    position: 0
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingId) {
        await updateLink.mutateAsync({ id: editingId, ...formData });
        toast({ title: "Success", description: "Link updated successfully" });
      } else {
        await createLink.mutateAsync(formData);
        toast({ title: "Success", description: "Link created successfully" });
      }
      resetForm();
    } catch (error) {
      toast({ title: "Error", description: "Something went wrong", variant: "destructive" });
    }
  };

  const handleEdit = (link: any) => {
    setEditingId(link.id);
    setFormData({
      name: link.name,
      url: link.url,
      icon: link.icon || "",
      category: link.category,
      position: link.position
    });
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this link?")) {
      await deleteLink.mutateAsync(id);
      toast({ title: "Deleted", description: "Link removed successfully" });
    }
  };

  const resetForm = () => {
    setEditingId(null);
    setFormData({ name: "", url: "", icon: "", category: "games", position: 0 });
  };

  if (isLoading) return <div className="p-8 text-center">Loading admin panel...</div>;

  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-display font-bold mb-8">Admin Dashboard</h1>

      {/* Form Section */}
      <div className="bg-card border border-white/10 rounded-2xl p-6 mb-12">
        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
          {editingId ? <Pencil className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
          {editingId ? "Edit Link" : "Add New Link"}
        </h2>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="text"
            placeholder="Name (e.g. Minecraft)"
            className="bg-background border border-white/10 p-3 rounded-xl outline-none focus:border-primary"
            value={formData.name}
            onChange={e => setFormData({ ...formData, name: e.target.value })}
            required
          />
          <input
            type="text"
            placeholder="URL (https://...)"
            className="bg-background border border-white/10 p-3 rounded-xl outline-none focus:border-primary"
            value={formData.url}
            onChange={e => setFormData({ ...formData, url: e.target.value })}
            required
          />
          <input
            type="text"
            placeholder="Icon (URL or Emoji)"
            className="bg-background border border-white/10 p-3 rounded-xl outline-none focus:border-primary"
            value={formData.icon}
            onChange={e => setFormData({ ...formData, icon: e.target.value })}
          />
          <select
            className="bg-background border border-white/10 p-3 rounded-xl outline-none focus:border-primary"
            value={formData.category}
            onChange={e => setFormData({ ...formData, category: e.target.value as "games" | "apps" })}
          >
            <option value="games">Game</option>
            <option value="apps">App</option>
          </select>
          <div className="md:col-span-2 flex gap-2">
            <button type="submit" className="flex-1 bg-primary text-primary-foreground p-3 rounded-xl font-bold flex items-center justify-center gap-2">
              <Save className="w-5 h-5" /> {editingId ? "Update" : "Create"}
            </button>
            {editingId && (
              <button type="button" onClick={resetForm} className="bg-white/5 p-3 rounded-xl">
                <X className="w-5 h-5" />
              </button>
            )}
          </div>
        </form>
      </div>

      {/* List Section */}
      <div className="space-y-4">
        {links.sort((a, b) => a.position - b.position).map((link) => (
          <div key={link.id} className="bg-card border border-white/5 p-4 rounded-xl flex items-center justify-between group">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-white/5 rounded-lg flex items-center justify-center text-xl">
                {link.category === "games" ? <Gamepad2 className="w-5 h-5 text-primary" /> : <LayoutGrid className="w-5 h-5 text-primary" />}
              </div>
              <div>
                <h3 className="font-bold">{link.name}</h3>
                <p className="text-xs text-muted-foreground truncate max-w-[200px]">{link.url}</p>
              </div>
            </div>
            <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <button onClick={() => handleEdit(link)} className="p-2 hover:bg-white/5 rounded-lg text-primary">
                <Pencil className="w-4 h-4" />
              </button>
              <button onClick={() => handleDelete(link.id)} className="p-2 hover:bg-white/5 rounded-lg text-destructive">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
