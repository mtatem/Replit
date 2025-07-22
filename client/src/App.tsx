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
import MobileBottomNav from "@/components/layout/mobile-bottom-nav";
import { useState } from "react";

function Router() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden bg-dark-bg text-white">
      {/* Desktop Sidebar */}
      <div className="hidden lg:block">
        <Sidebar />
      </div>
      
      {/* Mobile Sidebar Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="fixed inset-0 bg-black/50" onClick={() => setIsMobileMenuOpen(false)} />
          <div className="fixed left-0 top-0 h-full w-64 z-51">
            <Sidebar onClose={() => setIsMobileMenuOpen(false)} />
          </div>
        </div>
      )}
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header onMobileMenuToggle={() => setIsMobileMenuOpen(!isMobileMenuOpen)} />
        <main className="flex-1 overflow-auto px-4 lg:px-6 pb-20 lg:pb-6">
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
        <MobileBottomNav />
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
