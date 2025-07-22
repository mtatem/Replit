import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { Wallet, PieChart, ArrowLeftRight, CreditCard, Coins, TrendingUp, Bot, Shield, User, X } from "lucide-react";
import { Button } from "@/components/ui/button";

const navigation = [
  { name: "Portfolio", href: "/", icon: PieChart },
  { name: "Swap", href: "/swap", icon: ArrowLeftRight },
  { name: "Buy Crypto", href: "/buy-crypto", icon: CreditCard },
  { name: "Staking", href: "/staking", icon: Coins },
  { name: "DEX View", href: "/dex-view", icon: TrendingUp },
  { name: "Smart Automation", href: "/automation", icon: Bot },
  { name: "Security", href: "/security", icon: Shield },
];

interface SidebarProps {
  onClose?: () => void;
}

export default function Sidebar({ onClose }: SidebarProps) {
  const [location] = useLocation();

  return (
    <div className="w-64 bg-dark-surface border-r border-dark-border flex-shrink-0 h-full">
      <div className="p-4 lg:p-6 h-full flex flex-col">
        {/* Mobile Header with Close Button */}
        <div className="flex items-center justify-between mb-6 lg:mb-8">
          <div className="flex items-center space-x-3">
            <div className="w-8 lg:w-10 h-8 lg:h-10 bg-gradient-to-r from-crypto-blue to-crypto-green rounded-xl flex items-center justify-center">
              <Wallet className="text-white text-lg" />
            </div>
            <h1 className="text-xl lg:text-2xl font-bold bg-gradient-to-r from-crypto-blue to-crypto-green bg-clip-text text-transparent">
              Woosa
            </h1>
          </div>
          {onClose && (
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={onClose}
              className="lg:hidden"
            >
              <X className="h-5 w-5" />
            </Button>
          )}
        </div>
        
        {/* Navigation */}
        <nav className="space-y-2 flex-1">
          {navigation.map((item) => {
            const isActive = location === item.href;
            const Icon = item.icon;
            
            return (
              <Link key={item.name} href={item.href}>
                <a
                  className={cn(
                    "flex items-center space-x-3 px-3 lg:px-4 py-3 rounded-xl transition-colors",
                    isActive
                      ? "bg-crypto-blue/20 border border-crypto-blue/30 text-crypto-blue"
                      : "hover:bg-dark-border text-gray-300 hover:text-white"
                  )}
                  onClick={onClose} // Close mobile menu when clicking nav item
                >
                  <Icon className="w-5 h-5 flex-shrink-0" />
                  <span className="text-sm lg:text-base">{item.name}</span>
                </a>
              </Link>
            );
          })}
        </nav>
        
        {/* User Profile */}
        <div className="border-t border-dark-border pt-4">
          <div className="flex items-center space-x-3">
            <div className="w-8 lg:w-10 h-8 lg:h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
              <User className="text-white w-4 lg:w-5 h-4 lg:h-5" />
            </div>
            <div>
              <p className="font-medium text-sm lg:text-base">Alex Smith</p>
              <p className="text-xs lg:text-sm text-gray-400">Premium Member</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
