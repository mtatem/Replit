import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, ArrowLeftRight, Coins, Bot } from "lucide-react";
import { Link } from "wouter";

export default function QuickActions() {
  return (
    <Card className="bg-dark-surface border-dark-border">
      <CardHeader>
        <CardTitle className="text-xl font-semibold">Quick Actions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          <Link href="/buy-crypto">
            <Button className="w-full h-20 flex flex-col items-center justify-center bg-gradient-to-r from-crypto-blue to-crypto-green hover:opacity-80 transition-opacity">
              <Plus className="h-6 w-6 mb-2" />
              <span className="font-medium">Buy Crypto</span>
            </Button>
          </Link>
          
          <Link href="/swap">
            <Button className="w-full h-20 flex flex-col items-center justify-center bg-gradient-to-r from-purple-500 to-pink-500 hover:opacity-80 transition-opacity">
              <ArrowLeftRight className="h-6 w-6 mb-2" />
              <span className="font-medium">Swap</span>
            </Button>
          </Link>
          
          <Link href="/staking">
            <Button className="w-full h-20 flex flex-col items-center justify-center bg-gradient-to-r from-green-500 to-emerald-500 hover:opacity-80 transition-opacity">
              <Coins className="h-6 w-6 mb-2" />
              <span className="font-medium">Stake</span>
            </Button>
          </Link>
          
          <Link href="/automation">
            <Button className="w-full h-20 flex flex-col items-center justify-center bg-gradient-to-r from-orange-500 to-red-500 hover:opacity-80 transition-opacity">
              <Bot className="h-6 w-6 mb-2" />
              <span className="font-medium">Automation</span>
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
