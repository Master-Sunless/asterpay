import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Subscriptions from "./pages/Subscriptions";
import Settings from "./pages/Settings";
import NewSubscription from "./pages/NewSubscription";
import UpgradeSubscription from "./pages/UpgradeSubscription";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/subscriptions" element={<Subscriptions />} />
        <Route path="/subscriptions/:id/upgrade" element={<UpgradeSubscription />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/new-subscription" element={<NewSubscription />} />
      </Routes>
    </Router>
  );
}

export default App;