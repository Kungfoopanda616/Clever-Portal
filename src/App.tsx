import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { SettingsProvider } from "@/contexts/SettingsContext";
import { IframeProvider } from "@/contexts/IframeContext";
import NotFound from "@/pages/not-found";

import { Navbar } from "@/components/layout/Navbar";
import Home from "@/pages/Home";
import Games from "@/pages/Games";
import Settings from "@/pages/Settings";
import Admin from "@/pages/Admin";
import Chat from "@/pages/Chat";
import Apps from "@/pages/Apps";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      staleTime: 1000 * 60 * 5,
    }
  }
});

function AppContent() {
  return (
    <div className="min-h-screen flex flex-col text-foreground font-sans">
      <Navbar />
      <main className="flex-1 relative">
        <Switch>
          <Route path="/" component={Home} />
          <Route path="/games" component={Games} />
          <Route path="/apps" component={Apps} />
          <Route path="/settings" component={Settings} />
          <Route path="/admin" component={Admin} />
          <Route path="/chat" component={Chat} />
          <Route component={NotFound} />
        </Switch>
      </main>
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <SettingsProvider>
        <IframeProvider>
          <TooltipProvider>
            <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
              <AppContent />
            </WouterRouter>
            <Toaster />
          </TooltipProvider>
        </IframeProvider>
      </SettingsProvider>
    </QueryClientProvider>
  );
}

export default App;
