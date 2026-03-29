import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export interface Link {
  id: string;
  name: string;
  url: string;
  icon?: string;
  category: "games" | "apps";
  position: number;
}

// This hook fetches your list of games/apps
export function useGetLinks() {
  return useQuery<Link[]>({
    queryKey: ["links"],
    queryFn: async () => {
      const res = await fetch("/api/links");
      if (!res.ok) throw new Error("Failed to fetch links");
      return res.json();
    },
  });
}

// This hook adds a new game/app
export function useCreateLink() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (newLink: Omit<Link, "id">) => {
      const res = await fetch("/api/links", {
        method: "POST",
        body: JSON.stringify(newLink),
        headers: { "Content-Type": "application/json" },
      });
      return res.json();
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["links"] }),
  });
}

// This hook updates an existing link
export function useUpdateLink() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...update }: Partial<Link> & { id: string }) => {
      const res = await fetch(`/api/links/${id}`, {
        method: "PATCH",
        body: JSON.stringify(update),
        headers: { "Content-Type": "application/json" },
      });
      return res.json();
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["links"] }),
  });
}

// This hook deletes a link
export function useDeleteLink() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      await fetch(`/api/links/${id}`, { method: "DELETE" });
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["links"] }),
  });
}
