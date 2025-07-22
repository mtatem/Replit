import { Bell, Settings, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";

const pageNames = {
  "/": "Portfolio Overview",
  "/swap": "Crypto Swap",
  "/buy-crypto": "Buy Cryptocurrency",
  "/staking": "Staking Rewards",
  "/dex-view": "DEX Trading",
  "/automation": "Smart Automation",
  "/security": "Security Center",
};

const pageDescriptions = {
  "/": "Manage your crypto assets with smart automation",
  "/swap": "Exchange cryptocurrencies instantly",
  "/buy-crypto": "Purchase crypto with fiat currency",
  "/staking": "Earn rewards by staking your assets",
  "/dex-view": "Advanced trading with real-time charts",
  "/automation": "Configure intelligent trading rules",
  "/security": "Secure your wallet with advanced protection",
};

export default function Header() {
  const [location] = useLocation();
  
  const pageName = pageNames[location] || "Woosa Wallet";
  const pageDescription = pageDescriptions[location] || "Advanced cryptocurrency wallet";

  return (
    <header className="bg-dark-surface border-b border-dark-border px-6 py-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">{pageName}</h2>
          <p className="text-gray-400">{pageDescription}</p>
        </div>
        <div className="flex items-center space-x-4">
          {/* Network Selector */}
          <div className="flex items-center space-x-2 px-4 py-2 bg-dark-bg border border-dark-border rounded-xl">
            <div className="w-6 h-6 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full"></div>
            <span className="font-medium">Multi-Chain</span>
            <ChevronDown className="text-gray-400 w-4 h-4" />
          </div>
          
          {/* Notifications */}
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="h-5 w-5" />
            <span className="absolute top-0 right-0 w-2 h-2 bg-neon-green rounded-full animate-pulse"></span>
          </Button>
          
          {/* Settings */}
          <Button variant="ghost" size="icon">
            <Settings className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </header>
  );
}
