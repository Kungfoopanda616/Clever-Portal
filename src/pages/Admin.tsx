import { useState } from "react";

export default function Admin() {
  const [password, setPassword] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Set your own password here!
  const SECRET_PASSWORD = "your-cool-password-123"; 

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === SECRET_PASSWORD) {
      setIsAuthenticated(true);
    } else {
      alert("Wrong password, Slim.");
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-6">
        <form onSubmit={handleLogin} className="bg-card p-8 rounded-2xl border border-white/10 w-full max-w-md space-y-4">
          <h1 className="text-2xl font-bold text-center">Admin Login</h1>
          <input 
            type="password" 
            placeholder="Enter Admin Password"
            className="w-full p-4 bg-background border border-white/10 rounded-xl outline-none focus:border-primary"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button type="submit" className="w-full p-4 bg-primary text-white font-bold rounded-xl">
            Unlock Dashboard
          </button>
        </form>
      </div>
    );
  }

  // ... (the rest of your Admin code goes here)
}
