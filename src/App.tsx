import { Route, Switch } from "wouter";
import Home from "@/pages/Home"; // This line is what failed in your logs
import Admin from "@/pages/Admin";

function App() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/admin" component={Admin} />
    </Switch>
  );
}

export default App;
