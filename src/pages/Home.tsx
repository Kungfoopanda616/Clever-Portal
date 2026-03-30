// Inside src/pages/Home.tsx

// Since it's on the SAME site, we use a relative path
const PROXY_URL = "/uv/service/"; 

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

  // Ultraviolet needs the URL to be encoded. 
  // 'btoa' turns it into Base64 so the browser doesn't get confused.
  window.location.href = `${PROXY_URL}${btoa(targetUrl)}`;
};
