// Inside your Home.tsx
// Replace the old placeholder with your new Ultraviolet link + /uv/service/
const PROXY_URL = "https://your-new-uv-link.vercel.app/uv/service/"; 

const handleSearch = (e: React.FormEvent) => {
  e.preventDefault();
  if (!searchQuery.trim()) return;

  let targetUrl = "";
  const isUrl = searchQuery.includes('.') && !searchQuery.includes(' ');

  if (isUrl) {
    targetUrl = searchQuery.startsWith('http') ? searchQuery : `https://${searchQuery}`;
  } else {
    targetUrl = `https://www.google.com/search?q=${encodeURIComponent(searchQuery)}`;
  }

  // Ultraviolet uses a special "Xor" encoding for URLs. 
  // For most basic setups, this simple redirect works:
  window.location.href = `${PROXY_URL}${btoa(targetUrl)}`; 
};
