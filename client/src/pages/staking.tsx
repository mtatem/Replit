import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Coins, TrendingUp, Lock, Unlock } from "lucide-react";

interface StakingRate {
  cryptoId: number;
  symbol: string;
  apy: string;
  minimumStake: string;
}

export default function Staking() {
  const { data: stakingRates } = useQuery<StakingRate[]>({
    queryKey: ['/api/staking/rates'],
  });

  const { data: portfolio } = useQuery({
    queryKey: ['/api/portfolio/1'],
  });

  const stakingOpportunities = [
    {
      symbol: "ETH",
      name: "Ethereum 2.0",
      apy: "4.5",
      risk: "Low",
      lockPeriod: "No lock",
      icon: "Ξ",
      description: "Stake ETH and help secure the Ethereum network",
    },
    {
      symbol: "SOL",
      name: "Solana",
      apy: "6.8",
      risk: "Medium",
      lockPeriod: "2-3 days",
      icon: "◎",
      description: "Earn rewards by staking SOL tokens",
    },
    {
      symbol: "BTC",
      name: "Bitcoin",
      apy: "2.1",
      risk: "Low",
      lockPeriod: "No lock",
      icon: "₿",
      description: "Earn yield on your Bitcoin holdings",
    },
  ];

  const userStaking = [
    {
      symbol: "ETH",
      stakedAmount: "2.5",
      value: "7,109.18",
      rewards: "0.0234",
      apy: "4.5",
      icon: "Ξ",
    },
    {
      symbol: "SOL",
      stakedAmount: "50",
      value: "4,471.50",
      rewards: "0.89",
      apy: "6.8",
      icon: "◎",
    },
  ];

  return (
    <div className="p-6 space-y-8">
      {/* Staking Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-dark-surface border-dark-border">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Total Staked</h3>
              <Coins className="h-5 w-5 text-crypto-green" />
            </div>
            <div className="space-y-2">
              <p className="text-3xl font-bold">$11,580.68</p>
              <p className="text-sm text-gray-400">Across 2 protocols</p>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-dark-surface border-dark-border">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Estimated Rewards</h3>
              <TrendingUp className="h-5 w-5 text-neon-green" />
            </div>
            <div className="space-y-2">
              <p className="text-3xl font-bold text-neon-green">$47.23</p>
              <p className="text-sm text-gray-400">This month</p>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-dark-surface border-dark-border">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Average APY</h3>
              <Badge className="bg-crypto-blue/20 text-crypto-blue">
                5.65%
              </Badge>
            </div>
            <div className="space-y-2">
              <Progress value={65} className="h-2" />
              <p className="text-sm text-gray-400">Above market average</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Current Staking Positions */}
      <Card className="bg-dark-surface border-dark-border">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Lock className="h-5 w-5" />
            <span>Your Staking Positions</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {userStaking.map((stake) => (
              <div key={stake.symbol} className="flex items-center justify-between p-4 border border-dark-border rounded-xl">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-crypto-blue to-crypto-green rounded-full flex items-center justify-center text-lg font-bold">
                    {stake.icon}
                  </div>
                  <div>
                    <h4 className="font-semibold">{stake.symbol} Staking</h4>
                    <p className="text-sm text-gray-400">
                      {stake.stakedAmount} {stake.symbol} • ${stake.value}
                    </p>
                  </div>
                </div>
                
                <div className="text-center">
                  <p className="font-semibold text-neon-green">+{stake.rewards} {stake.symbol}</p>
                  <p className="text-sm text-gray-400">Pending rewards</p>
                </div>
                
                <div className="text-center">
                  <Badge className="bg-crypto-green/20 text-crypto-green mb-2">
                    {stake.apy}% APY
                  </Badge>
                  <p className="text-sm text-gray-400">Annual yield</p>
                </div>
                
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm" className="border-dark-border">
                    Claim
                  </Button>
                  <Button variant="outline" size="sm" className="border-dark-border">
                    <Unlock className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Available Staking Opportunities */}
      <Card className="bg-dark-surface border-dark-border">
        <CardHeader>
          <CardTitle>Available Staking Opportunities</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {stakingOpportunities.map((opportunity) => (
              <Card key={opportunity.symbol} className="bg-dark-bg border-dark-border">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="w-10 h-10 bg-gradient-to-r from-orange-400 to-orange-600 rounded-full flex items-center justify-center font-bold">
                      {opportunity.icon}
                    </div>
                    <div>
                      <h4 className="font-semibold">{opportunity.name}</h4>
                      <p className="text-sm text-gray-400">{opportunity.symbol}</p>
                    </div>
                  </div>
                  
                  <div className="space-y-3 mb-6">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-400">APY</span>
                      <Badge className="bg-neon-green/20 text-neon-green">
                        {opportunity.apy}%
                      </Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-400">Risk Level</span>
                      <span className="text-sm">{opportunity.risk}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-400">Lock Period</span>
                      <span className="text-sm">{opportunity.lockPeriod}</span>
                    </div>
                  </div>
                  
                  <p className="text-sm text-gray-400 mb-4">{opportunity.description}</p>
                  
                  <div className="space-y-3">
                    <Input 
                      placeholder={`Amount to stake (${opportunity.symbol})`}
                      className="bg-dark-surface border-dark-border"
                    />
                    <Button className="w-full bg-gradient-to-r from-crypto-blue to-crypto-green">
                      Stake {opportunity.symbol}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
