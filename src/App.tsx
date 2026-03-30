import { Route, Switch } from "wouter";
import Home from "@/pages/Home";
import Admin from "@/pages/Admin";
// Import your other pages here too

function App() {
  return (
    <>
      <Switch>
        {/* This line connects the main URL to your Home page */}
        <Route path="/" component={Home} />
        
        {/* This line connects the Admin page */}
        <Route path="/admin" component={Admin} />

        {/* Default 404 for any other broken links */}
        <Route>
          <div className="min-h-screen bg-[#0d0d0d] text-white flex items-center justify-center">
            <h1 className="text-2xl font-bold">404: Page Not Found</h1>
          </div>
        </Route>
      </Switch>
    </>
  );
}

export default App;
