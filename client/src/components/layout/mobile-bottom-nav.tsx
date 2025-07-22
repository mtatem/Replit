import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { PieChart, ArrowLeftRight, CreditCard, Bot, Shield } from "lucide-react";

const navigation = [
  { name: "Portfolio", href: "/", icon: PieChart },
  { name: "Swap", href: "/swap", icon: ArrowLeftRight },
  { name: "Buy", href: "/buy-crypto", icon: CreditCard },
  { name: "Automation", href: "/automation", icon: Bot },
  { name: "Security", href: "/security", icon: Shield },
];

export default function MobileBottomNav() {
  const [location] = useLocation();

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-dark-surface border-t border-dark-border z-50 safe-area-bottom">
      <div className="flex justify-around items-center py-3 px-2">
        {navigation.map((item) => {
          const isActive = location === item.href;
          const Icon = item.icon;
          
          return (
            <Link key={item.name} href={item.href}>
              <div
                className={cn(
                  "flex flex-col items-center justify-center py-2 px-3 rounded-lg transition-colors min-w-0 cursor-pointer",
                  isActive
                    ? "text-crypto-blue bg-crypto-blue/10"
                    : "text-gray-400 hover:text-white"
                )}
              >
                <Icon className="w-5 h-5 mb-1" />
                <span className="text-xs font-medium truncate">{item.name}</span>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}