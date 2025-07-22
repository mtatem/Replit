import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowUpIcon, ArrowDownIcon, ArrowLeftRight, Coins, Settings, RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils";

interface HoldingWithCrypto {
  id: number;
  userId: number;
  cryptoId: number;
  balance: string;
  averageBuyPrice: string;
  totalInvested: string;
  isStaked: boolean;
  stakedAmount: string;
  stakingApy: string;
  crypto: {
    id: number;
    symbol: string;
    name: string;
    type: string;
    icon: string;
    currentPrice: string;
    priceChange24h: string;
  };
}

export default function HoldingsTable() {
  const { data: holdings, isLoading } = useQuery<HoldingWithCrypto[]>({
    queryKey: ['/api/portfolio/1'],
  });

  const getCryptoIcon = (symbol: string) => {
    const icons = {
      'BTC': '₿',
      'ETH': 'Ξ',
      'SOL': '◎',
      'DOGE': '🐕',
    };
    return icons[symbol as keyof typeof icons] || '●';
  };

  const getAutomationType = (type: string) => {
    switch (type) {
      case 'major':
        return { label: 'Major Coin Rules', color: 'text-neon-green' };
      case 'altcoin':
        return { label: 'Altcoin Rules', color: 'text-purple-400' };
      case 'meme':
        return { label: 'Meme Coin Rules', color: 'text-neon-orange' };
      default:
        return { label: 'No Rules', color: 'text-gray-400' };
    }
  };

  const calculateCurrentValue = (balance: string, price: string) => {
    return (parseFloat(balance) * parseFloat(price));
  };

  const calculatePnL = (currentValue: number, invested: string) => {
    const investedAmount = parseFloat(invested);
    const pnl = currentValue - investedAmount;
    const pnlPercent = investedAmount > 0 ? (pnl / investedAmount) * 100 : 0;
    return { pnl, pnlPercent };
  };

  if (isLoading) {
    return (
      <Card className="bg-dark-surface border-dark-border">
        <CardContent className="p-6">
          <div className="animate-pulse">Loading holdings...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-dark-surface border-dark-border overflow-hidden">
      <CardHeader className="border-b border-dark-border p-3 lg:p-6">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <CardTitle className="text-base lg:text-xl font-semibold">Your Holdings</CardTitle>
          <div className="flex items-center space-x-2 lg:space-x-4">
            <Select defaultValue="all">
              <SelectTrigger className="w-28 lg:w-48 bg-dark-bg border-dark-border text-xs lg:text-base">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Assets</SelectItem>
                <SelectItem value="major">Major Coins</SelectItem>
                <SelectItem value="altcoin">Altcoins</SelectItem>
                <SelectItem value="meme">Meme Coins</SelectItem>
                <SelectItem value="staked">Staked Assets</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="ghost" size="icon" className="h-7 w-7 lg:h-10 lg:w-10">
              <RotateCcw className="h-3 lg:h-4 w-3 lg:w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="p-0">
        {/* Desktop Table View */}
        <div className="hidden lg:block overflow-x-auto">
          <table className="w-full">
            <thead className="bg-dark-bg">
              <tr>
                <th className="text-left px-6 py-4 font-medium text-gray-400">Asset</th>
                <th className="text-left px-6 py-4 font-medium text-gray-400">Balance</th>
                <th className="text-left px-6 py-4 font-medium text-gray-400">Price</th>
                <th className="text-left px-6 py-4 font-medium text-gray-400">24h Change</th>
                <th className="text-left px-6 py-4 font-medium text-gray-400">Value</th>
                <th className="text-left px-6 py-4 font-medium text-gray-400">P&L</th>
                <th className="text-left px-6 py-4 font-medium text-gray-400">Automation</th>
                <th className="text-left px-6 py-4 font-medium text-gray-400">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-dark-border">
              {holdings?.map((holding) => {
                const currentValue = calculateCurrentValue(holding.balance, holding.crypto.currentPrice);
                const { pnl, pnlPercent } = calculatePnL(currentValue, holding.totalInvested);
                const priceChange = parseFloat(holding.crypto.priceChange24h);
                const automation = getAutomationType(holding.crypto.type);
                
                return (
                  <tr key={holding.id} className="hover:bg-dark-bg/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-gradient-to-r from-orange-400 to-orange-600 rounded-full flex items-center justify-center text-sm font-bold">
                          {getCryptoIcon(holding.crypto.symbol)}
                        </div>
                        <div>
                          <p className="font-medium">{holding.crypto.name}</p>
                          <p className="text-sm text-gray-400">{holding.crypto.symbol}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-medium">{parseFloat(holding.balance).toFixed(6)}</p>
                      <p className="text-sm text-gray-400">{holding.crypto.symbol}</p>
                      {holding.isStaked && (
                        <p className="text-xs text-crypto-green">
                          {parseFloat(holding.stakedAmount).toFixed(2)} staked
                        </p>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-medium">${parseFloat(holding.crypto.currentPrice).toLocaleString()}</p>
                    </td>
                    <td className="px-6 py-4">
                      <Badge
                        variant="secondary"
                        className={cn(
                          "text-xs font-medium",
                          priceChange >= 0
                            ? "bg-profit-green/20 text-profit-green"
                            : "bg-loss-red/20 text-loss-red"
                        )}
                      >
                        {priceChange >= 0 ? (
                          <ArrowUpIcon className="w-3 h-3 mr-1" />
                        ) : (
                          <ArrowDownIcon className="w-3 h-3 mr-1" />
                        )}
                        {Math.abs(priceChange).toFixed(2)}%
                      </Badge>
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-medium">${currentValue.toLocaleString(undefined, { maximumFractionDigits: 2 })}</p>
                    </td>
                    <td className="px-6 py-4">
                      <div className={cn(
                        "font-medium",
                        pnl >= 0 ? "text-profit-green" : "text-loss-red"
                      )}>
                        <p>${Math.abs(pnl).toLocaleString(undefined, { maximumFractionDigits: 2 })}</p>
                        <p className="text-xs">
                          {pnl >= 0 ? '+' : '-'}{Math.abs(pnlPercent).toFixed(2)}%
                        </p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-neon-green rounded-full animate-pulse"></div>
                        <span className={cn("text-xs font-medium", automation.color)}>
                          {automation.label}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex space-x-2">
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <ArrowLeftRight className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <Coins className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <Settings className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        
        {/* Mobile Card View */}
        <div className="lg:hidden divide-y divide-dark-border">
          {holdings?.map((holding) => {
            const currentValue = calculateCurrentValue(holding.balance, holding.crypto.currentPrice);
            const { pnl, pnlPercent } = calculatePnL(currentValue, holding.totalInvested);
            const priceChange = parseFloat(holding.crypto.priceChange24h);
            const automation = getAutomationType(holding.crypto.type);
            
            return (
              <div key={holding.id} className="p-4 active:bg-dark-bg/70 transition-colors">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-gradient-to-r from-orange-400 to-orange-600 rounded-full flex items-center justify-center text-lg font-bold">
                      {getCryptoIcon(holding.crypto.symbol)}
                    </div>
                    <div>
                      <p className="font-semibold text-base">{holding.crypto.name}</p>
                      <p className="text-sm text-gray-400">{holding.crypto.symbol}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-base">${currentValue.toLocaleString(undefined, { maximumFractionDigits: 2 })}</p>
                    <Badge
                      variant="secondary"
                      className={cn(
                        "text-xs font-medium",
                        priceChange >= 0
                          ? "bg-profit-green/20 text-profit-green"
                          : "bg-loss-red/20 text-loss-red"
                      )}
                    >
                      {priceChange >= 0 ? (
                        <ArrowUpIcon className="w-3 h-3 mr-1" />
                      ) : (
                        <ArrowDownIcon className="w-3 h-3 mr-1" />
                      )}
                      {Math.abs(priceChange).toFixed(2)}%
                    </Badge>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4 mb-3">
                  <div>
                    <p className="text-xs text-gray-400 mb-1">Balance</p>
                    <p className="font-medium text-sm">{parseFloat(holding.balance).toFixed(6)} {holding.crypto.symbol}</p>
                    {holding.isStaked && (
                      <p className="text-xs text-crypto-green mt-1">
                        {parseFloat(holding.stakedAmount).toFixed(2)} staked
                      </p>
                    )}
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 mb-1">Price</p>
                    <p className="font-medium text-sm">${parseFloat(holding.crypto.currentPrice).toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 mb-1">P&L</p>
                    <div className={cn(
                      "font-medium text-sm",
                      pnl >= 0 ? "text-profit-green" : "text-loss-red"
                    )}>
                      <p>${Math.abs(pnl).toLocaleString(undefined, { maximumFractionDigits: 2 })}</p>
                      <p className="text-xs">
                        {pnl >= 0 ? '+' : '-'}{Math.abs(pnlPercent).toFixed(2)}%
                      </p>
                    </div>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 mb-1">Automation</p>
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-neon-green rounded-full animate-pulse"></div>
                      <span className={cn("text-xs font-medium", automation.color)}>
                        {automation.label}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-between items-center pt-3 border-t border-dark-border">
                  <div className="flex space-x-2">
                    <Button variant="ghost" size="sm" className="text-xs">
                      <ArrowLeftRight className="h-3 w-3 mr-1" />
                      Swap
                    </Button>
                    <Button variant="ghost" size="sm" className="text-xs">
                      <Coins className="h-3 w-3 mr-1" />
                      Stake
                    </Button>
                  </div>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <Settings className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
