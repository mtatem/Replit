import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Coins, TrendingUp, Lock, Unlock, Zap, DollarSign, Calendar, ArrowRight, Award, Timer } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

interface StakingRate {
  cryptoId: number;
  symbol: string;
  apy: string;
  minimumStake: string;
}

export default function Staking() {
  const { toast } = useToast();
  const [selectedStaking, setSelectedStaking] = useState<string>("");
  const [stakeAmount, setStakeAmount] = useState<string>("");

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
      description: "Stake ETH and help secure the Ethereum network while earning rewards",
      minStake: "0.1",
      totalStaked: "32.5M ETH",
      validators: "1.2M",
      color: "from-blue-400 to-purple-600"
    },
    {
      symbol: "SOL",
      name: "Solana",
      apy: "6.8",
      risk: "Medium",
      lockPeriod: "2-3 days",
      icon: "◎",
      description: "Earn rewards by delegating SOL to high-performance validators",
      minStake: "1",
      totalStaked: "402M SOL",
      validators: "3,400",
      color: "from-purple-400 to-pink-600"
    },
    {
      symbol: "BTC",
      name: "Bitcoin",
      apy: "2.1",
      risk: "Low", 
      lockPeriod: "No lock",
      icon: "₿",
      description: "Earn yield on your Bitcoin through liquid staking protocols",
      minStake: "0.001",
      totalStaked: "1.2M BTC",
      validators: "N/A",
      color: "from-orange-400 to-red-600"
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

  const handleStake = (symbol: string) => {
    if (!stakeAmount) {
      toast({
        title: "Invalid Amount",
        description: "Please enter an amount to stake",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Staking Initiated",
      description: `Staking ${stakeAmount} ${symbol} at ${stakingOpportunities.find(s => s.symbol === symbol)?.apy}% APY`,
    });
    setStakeAmount("");
  };

  return (
    <div className="p-3 lg:p-6 max-w-7xl mx-auto">
      <div className="space-y-4 lg:space-y-6">
        {/* Header */}
        <div className="text-center lg:text-left">
          <h1 className="text-2xl lg:text-3xl font-bold mb-2">Crypto Staking</h1>
          <p className="text-gray-400">Earn passive income by staking your cryptocurrency holdings</p>
        </div>

        {/* Staking Overview */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
          <Card className="bg-dark-surface border-dark-border">
            <CardContent className="p-4 lg:p-6">
              <div className="flex items-center justify-between mb-3 lg:mb-4">
                <div className="flex items-center space-x-2">
                  <Coins className="h-4 lg:h-5 w-4 lg:w-5 text-crypto-green" />
                  <h3 className="text-sm lg:text-lg font-semibold">Total Staked</h3>
                </div>
              </div>
              <div className="space-y-1 lg:space-y-2">
                <p className="text-2xl lg:text-3xl font-bold">$11,580.68</p>
                <p className="text-xs lg:text-sm text-gray-400">Across 2 protocols</p>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-dark-surface border-dark-border">
            <CardContent className="p-4 lg:p-6">
              <div className="flex items-center justify-between mb-3 lg:mb-4">
                <div className="flex items-center space-x-2">
                  <TrendingUp className="h-4 lg:h-5 w-4 lg:w-5 text-neon-green" />
                  <h3 className="text-sm lg:text-lg font-semibold">Monthly Rewards</h3>
                </div>
              </div>
              <div className="space-y-1 lg:space-y-2">
                <p className="text-2xl lg:text-3xl font-bold text-neon-green">$47.23</p>
                <p className="text-xs lg:text-sm text-gray-400">Estimated earnings</p>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-dark-surface border-dark-border">
            <CardContent className="p-4 lg:p-6">
              <div className="flex items-center justify-between mb-3 lg:mb-4">
                <div className="flex items-center space-x-2">
                  <Award className="h-4 lg:h-5 w-4 lg:w-5 text-crypto-blue" />
                  <h3 className="text-sm lg:text-lg font-semibold">Average APY</h3>
                </div>
              </div>
              <div className="space-y-1 lg:space-y-2">
                <p className="text-2xl lg:text-3xl font-bold">5.65%</p>
                <p className="text-xs lg:text-sm text-gray-400">Above market avg</p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-dark-surface border-dark-border">
            <CardContent className="p-4 lg:p-6">
              <div className="flex items-center justify-between mb-3 lg:mb-4">
                <div className="flex items-center space-x-2">
                  <Timer className="h-4 lg:h-5 w-4 lg:w-5 text-purple-400" />
                  <h3 className="text-sm lg:text-lg font-semibold">Active Stakes</h3>
                </div>
              </div>
              <div className="space-y-1 lg:space-y-2">
                <p className="text-2xl lg:text-3xl font-bold">2</p>
                <p className="text-xs lg:text-sm text-gray-400">ETH, SOL protocols</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="positions" className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-dark-bg h-12 lg:h-14">
            <TabsTrigger value="positions" className="text-sm lg:text-base">Your Positions</TabsTrigger>
            <TabsTrigger value="opportunities" className="text-sm lg:text-base">Stake Now</TabsTrigger>
          </TabsList>
          
          <TabsContent value="positions" className="mt-4 lg:mt-6">
            <Card className="bg-dark-surface border-dark-border">
              <CardHeader className="p-4 lg:p-6">
                <CardTitle className="flex items-center space-x-2 text-lg lg:text-xl">
                  <Lock className="h-4 lg:h-5 w-4 lg:w-5" />
                  <span>Active Staking Positions</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 lg:p-6 pt-0">
                {/* Desktop View */}
                <div className="hidden lg:block space-y-4">
                  {userStaking.map((stake) => (
                    <div key={stake.symbol} className="flex items-center justify-between p-4 border border-dark-border rounded-xl hover:bg-dark-bg/50 transition-colors">
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

                {/* Mobile View */}
                <div className="lg:hidden space-y-4">
                  {userStaking.map((stake) => (
                    <Card key={stake.symbol} className="bg-dark-bg border-dark-border">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-gradient-to-r from-crypto-blue to-crypto-green rounded-full flex items-center justify-center font-bold">
                              {stake.icon}
                            </div>
                            <div>
                              <h4 className="font-semibold text-sm">{stake.symbol} Staking</h4>
                              <Badge className="bg-crypto-green/20 text-crypto-green text-xs">
                                {stake.apy}% APY
                              </Badge>
                            </div>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                          <div>
                            <p className="text-gray-400">Staked Amount</p>
                            <p className="font-medium">{stake.stakedAmount} {stake.symbol}</p>
                          </div>
                          <div>
                            <p className="text-gray-400">USD Value</p>
                            <p className="font-medium">${stake.value}</p>
                          </div>
                          <div>
                            <p className="text-gray-400">Pending Rewards</p>
                            <p className="font-medium text-neon-green">+{stake.rewards} {stake.symbol}</p>
                          </div>
                          <div>
                            <p className="text-gray-400">Annual Yield</p>
                            <p className="font-medium">{stake.apy}%</p>
                          </div>
                        </div>
                        
                        <div className="flex space-x-2">
                          <Button variant="outline" size="sm" className="border-dark-border flex-1">
                            Claim Rewards
                          </Button>
                          <Button variant="outline" size="sm" className="border-dark-border">
                            <Unlock className="h-4 w-4" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="opportunities" className="mt-4 lg:mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 lg:gap-6">
              {stakingOpportunities.map((opportunity) => (
                <Card key={opportunity.symbol} className="bg-dark-surface border-dark-border hover:bg-dark-bg/50 transition-colors">
                  <CardContent className="p-4 lg:p-6">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div className={cn("w-10 lg:w-12 h-10 lg:h-12 bg-gradient-to-r rounded-full flex items-center justify-center text-lg lg:text-xl font-bold", opportunity.color)}>
                          {opportunity.icon}
                        </div>
                        <div>
                          <h4 className="font-semibold text-sm lg:text-base">{opportunity.name}</h4>
                          <p className="text-xs lg:text-sm text-gray-400">{opportunity.symbol}</p>
                        </div>
                      </div>
                      <Badge className="bg-neon-green/20 text-neon-green text-xs lg:text-sm font-bold">
                        {opportunity.apy}% APY
                      </Badge>
                    </div>
                    
                    {/* Stats Grid */}
                    <div className="grid grid-cols-2 gap-3 lg:gap-4 mb-4">
                      <div className="text-center p-2 lg:p-3 bg-dark-bg rounded-lg">
                        <p className="text-xs text-gray-400">Risk Level</p>
                        <p className={cn("text-sm lg:text-base font-medium", 
                          opportunity.risk === "Low" ? "text-green-400" : 
                          opportunity.risk === "Medium" ? "text-yellow-400" : "text-red-400"
                        )}>
                          {opportunity.risk}
                        </p>
                      </div>
                      <div className="text-center p-2 lg:p-3 bg-dark-bg rounded-lg">
                        <p className="text-xs text-gray-400">Lock Period</p>
                        <p className="text-sm lg:text-base font-medium">{opportunity.lockPeriod}</p>
                      </div>
                      <div className="text-center p-2 lg:p-3 bg-dark-bg rounded-lg">
                        <p className="text-xs text-gray-400">Min Stake</p>
                        <p className="text-sm lg:text-base font-medium">{opportunity.minStake} {opportunity.symbol}</p>
                      </div>
                      <div className="text-center p-2 lg:p-3 bg-dark-bg rounded-lg">
                        <p className="text-xs text-gray-400">Validators</p>
                        <p className="text-sm lg:text-base font-medium">{opportunity.validators}</p>
                      </div>
                    </div>

                    {/* Network Stats */}
                    <div className="mb-4 p-3 bg-dark-bg/50 rounded-lg">
                      <div className="flex items-center space-x-2 mb-2">
                        <Zap className="h-4 w-4 text-crypto-blue" />
                        <span className="text-xs text-gray-400">Network Stats</span>
                      </div>
                      <p className="text-xs text-gray-400">Total Staked: {opportunity.totalStaked}</p>
                    </div>
                    
                    <p className="text-xs lg:text-sm text-gray-400 mb-4 leading-relaxed">{opportunity.description}</p>
                    
                    {/* Staking Form */}
                    <div className="space-y-3">
                      <div>
                        <Label className="text-xs lg:text-sm text-gray-400">Amount to stake</Label>
                        <div className="flex space-x-2 mt-1">
                          <Input 
                            placeholder={`0.00 ${opportunity.symbol}`}
                            value={selectedStaking === opportunity.symbol ? stakeAmount : ""}
                            onChange={(e) => {
                              setSelectedStaking(opportunity.symbol);
                              setStakeAmount(e.target.value);
                            }}
                            className="bg-dark-bg border-dark-border text-sm lg:text-base h-10 lg:h-12"
                          />
                        </div>
                        <div className="flex space-x-1 mt-2">
                          {["25%", "50%", "75%", "Max"].map((percent) => (
                            <Button
                              key={percent}
                              variant="outline"
                              size="sm"
                              className="border-dark-border text-xs flex-1 h-8"
                              onClick={() => {
                                setSelectedStaking(opportunity.symbol);
                                // This would calculate based on user's balance
                                setStakeAmount("1.0");
                              }}
                            >
                              {percent}
                            </Button>
                          ))}
                        </div>
                      </div>
                      
                      <Button 
                        className="w-full bg-gradient-to-r from-crypto-blue to-crypto-green h-10 lg:h-12 text-sm lg:text-base font-semibold"
                        onClick={() => handleStake(opportunity.symbol)}
                      >
                        <Lock className="h-4 w-4 mr-2" />
                        Stake {opportunity.symbol}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
