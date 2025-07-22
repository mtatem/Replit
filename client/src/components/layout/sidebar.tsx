import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { Wallet, PieChart, ArrowLeftRight, CreditCard, Coins, TrendingUp, Bot, Shield, User } from "lucide-react";

const navigation = [
  { name: "Portfolio", href: "/", icon: PieChart },
  { name: "Swap", href: "/swap", icon: ArrowLeftRight },
  { name: "Buy Crypto", href: "/buy-crypto", icon: CreditCard },
  { name: "Staking", href: "/staking", icon: Coins },
  { name: "DEX View", href: "/dex-view", icon: TrendingUp },
  { name: "Smart Automation", href: "/automation", icon: Bot },
  { name: "Security", href: "/security", icon: Shield },
];

export default function Sidebar() {
  const [location] = useLocation();

  return (
    <div className="w-64 bg-dark-surface border-r border-dark-border flex-shrink-0">
      <div className="p-6">
        {/* Logo */}
        <div className="flex items-center space-x-3 mb-8">
          <div className="w-10 h-10 bg-gradient-to-r from-crypto-blue to-crypto-green rounded-xl flex items-center justify-center">
            <Wallet className="text-white text-lg" />
          </div>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-crypto-blue to-crypto-green bg-clip-text text-transparent">
            Woosa
          </h1>
        </div>
        
        {/* Navigation */}
        <nav className="space-y-2">
          {navigation.map((item) => {
            const isActive = location === item.href;
            const Icon = item.icon;
            
            return (
              <Link key={item.name} href={item.href}>
                <a
                  className={cn(
                    "flex items-center space-x-3 px-4 py-3 rounded-xl transition-colors",
                    isActive
                      ? "bg-crypto-blue/20 border border-crypto-blue/30 text-crypto-blue"
                      : "hover:bg-dark-border text-gray-300 hover:text-white"
                  )}
                >
                  <Icon className="w-5 h-5" />
                  <span>{item.name}</span>
                </a>
              </Link>
            );
          })}
        </nav>
      </div>
      
      {/* User Profile */}
      <div className="absolute bottom-0 left-0 right-0 p-6 border-t border-dark-border">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
            <User className="text-white w-5 h-5" />
          </div>
          <div>
            <p className="font-medium">Alex Smith</p>
            <p className="text-sm text-gray-400">Premium Member</p>
          </div>
        </div>
      </div>
    </div>
  );
}
