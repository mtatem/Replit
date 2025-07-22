import { Bell, Settings, ChevronDown, Menu } from "lucide-react";
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

interface HeaderProps {
  onMobileMenuToggle?: () => void;
}

export default function Header({ onMobileMenuToggle }: HeaderProps) {
  const [location] = useLocation();
  
  const pageName = pageNames[location as keyof typeof pageNames] || "Woosa Wallet";
  const pageDescription = pageDescriptions[location as keyof typeof pageDescriptions] || "Advanced cryptocurrency wallet";

  return (
    <header className="bg-dark-surface border-b border-dark-border px-4 lg:px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          {/* Mobile Menu Toggle */}
          <Button 
            variant="ghost" 
            size="icon" 
            className="lg:hidden"
            onClick={onMobileMenuToggle}
          >
            <Menu className="h-5 w-5" />
          </Button>
          
          <div>
            <h2 className="text-xl lg:text-2xl font-bold">{pageName}</h2>
            <p className="text-sm lg:text-base text-gray-400 hidden sm:block">{pageDescription}</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2 lg:space-x-4">
          {/* Network Selector - Hidden on mobile */}
          <div className="hidden md:flex items-center space-x-2 px-3 lg:px-4 py-2 bg-dark-bg border border-dark-border rounded-xl">
            <div className="w-4 lg:w-6 h-4 lg:h-6 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full"></div>
            <span className="font-medium text-sm lg:text-base">Multi-Chain</span>
            <ChevronDown className="text-gray-400 w-3 lg:w-4 h-3 lg:h-4" />
          </div>
          
          {/* Notifications */}
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="h-4 lg:h-5 w-4 lg:w-5" />
            <span className="absolute top-0 right-0 w-2 h-2 bg-neon-green rounded-full animate-pulse"></span>
          </Button>
          
          {/* Settings */}
          <Button variant="ghost" size="icon">
            <Settings className="h-4 lg:h-5 w-4 lg:w-5" />
          </Button>
        </div>
      </div>
    </header>
  );
}
