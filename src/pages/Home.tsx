const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    let targetUrl = searchQuery;
    if (!searchQuery.includes('.') || searchQuery.includes(' ')) {
      targetUrl = `https://www.google.com/search?q=${encodeURIComponent(searchQuery)}`;
    } else if (!searchQuery.startsWith('http')) {
      targetUrl = `https://${searchQuery}`;
    }

    // This is the "Xor" scrambling Ultraviolet needs
    const encodedUrl = btoa(
      targetUrl
        .split("")
        .map((char, ind) =>
          ind % 2 ? String.fromCharCode(char.charCodeAt(0) ^ 2) : char
        )
        .join("")
    );

    window.location.href = `/uv/service/${encodedUrl}`;
  };
