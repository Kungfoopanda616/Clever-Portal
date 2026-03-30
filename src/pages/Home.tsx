import { useState } from "react"; // Add this at the top

// Inside your Home function:
const [searchQuery, setSearchQuery] = useState("");

const handleSearch = (e: React.FormEvent) => {
  e.preventDefault();
  if (searchQuery.trim()) {
    // This sends the user to Google with their search
    window.location.href = `https://www.google.com/search?q=${encodeURIComponent(searchQuery)}`;
  }
};

// Then update your Search Bar HTML:
<form onSubmit={handleSearch} className="w-full relative group">
   <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-6 h-6 text-muted-foreground group-focus-within:text-primary transition-colors" />
   <input
     type="text"
     value={searchQuery}
     onChange={(e) => setSearchQuery(e.target.value)}
     placeholder="Search the web or enter URL..."
     className="w-full bg-card/40 backdrop-blur-md p-7 pl-16 pr-20 text-xl rounded-full border border-white/5 outline-none focus:border-primary/40 focus:ring-4 focus:ring-primary/5 transition-all"
   />
   <button type="submit" className="absolute right-6 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center rounded-full bg-background border border-white/5 text-muted-foreground/60 hover:text-foreground transition-colors shadow-sm">
      <CornerDownLeft className="w-5 h-5" />
   </button>
</form>
