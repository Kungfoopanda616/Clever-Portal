import { useState } from "react";

export function useToast() {
  const [toasts, setToasts] = useState<any[]>([]);

  const toast = ({ title, description, variant }: { title: string; description?: string; variant?: string }) => {
    console.log(`Toast: ${title} - ${description}`);
    // You can expand this later with actual UI, but this unblocks the build
  };

  return { toast, toasts };
}
