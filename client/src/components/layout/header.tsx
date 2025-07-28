import { Bell, Settings, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";
import ChainSelector from "@/components/ui/chain-selector";

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

interface HeaderProps {
  onMobileMenuToggle?: () => void;
}

export default function Header({ onMobileMenuToggle }: HeaderProps) {
  const [location] = useLocation();
  
  const pageName = pageNames[location as keyof typeof pageNames] || "Woosa Wallet";
  const pageDescription = pageDescriptions[location as keyof typeof pageDescriptions] || "Advanced cryptocurrency wallet";

  return (
    <header className="bg-dark-surface border-b border-dark-border px-3 lg:px-6 py-3 lg:py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3 lg:space-x-4">
          {/* Mobile Menu Toggle */}
          <Button 
            variant="ghost" 
            size="icon" 
            className="lg:hidden h-8 w-8"
            onClick={onMobileMenuToggle}
          >
            <Menu className="h-4 w-4" />
          </Button>
          
          <div>
            <h2 className="text-lg lg:text-2xl font-bold">{pageName}</h2>
            <p className="text-xs lg:text-base text-gray-400 hidden sm:block">{pageDescription}</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-1 lg:space-x-4">
          {/* Network Selector - Hidden on mobile */}
          <div className="hidden md:block">
            <ChainSelector />
          </div>
          
          {/* Notifications */}
          <Button variant="ghost" size="icon" className="relative h-8 w-8 lg:h-10 lg:w-10">
            <Bell className="h-4 lg:h-5 w-4 lg:w-5" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-neon-green rounded-full animate-pulse"></span>
          </Button>
          
          {/* Settings */}
          <Button variant="ghost" size="icon" className="h-8 w-8 lg:h-10 lg:w-10">
            <Settings className="h-4 lg:h-5 w-4 lg:w-5" />
          </Button>
        </div>
      </div>
    </header>
  );
}
