import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Portfolio from "@/pages/portfolio";
import Swap from "@/pages/swap";
import BuyCrypto from "@/pages/buy-crypto";
import Staking from "@/pages/staking";
import DexView from "@/pages/dex-view";
import Automation from "@/pages/automation";
import Security from "@/pages/security";
import Sidebar from "@/components/layout/sidebar";
import Header from "@/components/layout/header";

function Router() {
  return (
    <div className="flex h-screen overflow-hidden bg-dark-bg text-white">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-auto">
          <Switch>
            <Route path="/" component={Portfolio} />
            <Route path="/swap" component={Swap} />
            <Route path="/buy-crypto" component={BuyCrypto} />
            <Route path="/staking" component={Staking} />
            <Route path="/dex-view" component={DexView} />
            <Route path="/automation" component={Automation} />
            <Route path="/security" component={Security} />
            <Route component={NotFound} />
          </Switch>
        </main>
      </div>
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
