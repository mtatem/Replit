import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, ArrowLeftRight, Coins, Bot } from "lucide-react";
import { Link } from "wouter";

export default function QuickActions() {
  return (
    <Card className="bg-dark-surface border-dark-border">
      <CardHeader className="p-3 lg:p-6">
        <CardTitle className="text-lg lg:text-xl font-semibold">Quick Actions</CardTitle>
      </CardHeader>
      <CardContent className="p-3 lg:p-6 pt-0">
        <div className="grid grid-cols-2 gap-3 lg:gap-4">
          <Link href="/buy-crypto">
            <Button className="w-full h-16 lg:h-20 flex flex-col items-center justify-center bg-gradient-to-r from-crypto-blue to-crypto-green hover:opacity-80 transition-opacity text-white">
              <Plus className="h-4 lg:h-6 w-4 lg:w-6 mb-1 lg:mb-2" />
              <span className="font-medium text-xs lg:text-sm">Buy Crypto</span>
            </Button>
          </Link>
          
          <Link href="/swap">
            <Button className="w-full h-16 lg:h-20 flex flex-col items-center justify-center bg-gradient-to-r from-purple-500 to-pink-500 hover:opacity-80 transition-opacity text-white">
              <ArrowLeftRight className="h-4 lg:h-6 w-4 lg:w-6 mb-1 lg:mb-2" />
              <span className="font-medium text-xs lg:text-sm">Swap</span>
            </Button>
          </Link>
          
          <Link href="/staking">
            <Button className="w-full h-16 lg:h-20 flex flex-col items-center justify-center bg-gradient-to-r from-green-500 to-emerald-500 hover:opacity-80 transition-opacity text-white">
              <Coins className="h-4 lg:h-6 w-4 lg:w-6 mb-1 lg:mb-2" />
              <span className="font-medium text-xs lg:text-sm">Stake</span>
            </Button>
          </Link>
          
          <Link href="/automation">
            <Button className="w-full h-16 lg:h-20 flex flex-col items-center justify-center bg-gradient-to-r from-orange-500 to-red-500 hover:opacity-80 transition-opacity text-white">
              <Bot className="h-4 lg:h-6 w-4 lg:w-6 mb-1 lg:mb-2" />
              <span className="font-medium text-xs lg:text-sm">Automation</span>
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
