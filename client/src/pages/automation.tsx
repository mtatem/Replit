import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Bot, TrendingUp, AlertTriangle, Settings, Activity, Zap, Target, Shield, Laugh, Gem, Star, Play, Pause, RotateCcw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { getAutomationRuleDescription } from "@/lib/mock-data";
import type { AutomationRule } from "@shared/schema";

interface AutomationExecution {
  id: number;
  userId: number;
  cryptoId: number;
  type: string;
  amount: string;
  price: string;
  totalValue: string;
  automationTriggered: boolean;
  createdAt: string;
  crypto: {
    id: number;
    symbol: string;
    name: string;
    type: string;
  };
}

export default function Automation() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const { data: rules, isLoading } = useQuery<AutomationRule[]>({
    queryKey: ['/api/automation/1'],
  });

  const { data: executions, isLoading: executionsLoading } = useQuery<AutomationExecution[]>({
    queryKey: ['/api/automation/1/executions'],
  });

  const [localRules, setLocalRules] = useState<Record<string, AutomationRule>>({});

  // Update local state when rules are loaded
  useState(() => {
    if (rules) {
      const rulesMap = rules.reduce((acc, rule) => {
        acc[rule.cryptoType] = rule;
        return acc;
      }, {} as Record<string, AutomationRule>);
      setLocalRules(rulesMap);
    }
  });

  const updateRuleMutation = useMutation({
    mutationFn: async ({ ruleId, updates }: { ruleId: number; updates: Partial<AutomationRule> }) => {
      await apiRequest('PUT', `/api/automation/${ruleId}`, updates);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/automation/1'] });
      toast({
        title: "Success",
        description: "Automation rules updated successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update automation rules",
        variant: "destructive",
      });
    },
  });

  const pauseAllMutation = useMutation({
    mutationFn: async () => {
      await apiRequest('POST', '/api/automation/1/pause-all');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/automation/1'] });
      toast({
        title: "Success",
        description: "All automation rules paused",
      });
    },
  });

  const enableAllMutation = useMutation({
    mutationFn: async () => {
      await apiRequest('POST', '/api/automation/1/enable-all');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/automation/1'] });
      toast({
        title: "Success",
        description: "All automation rules enabled",
      });
    },
  });

  const resetDefaultsMutation = useMutation({
    mutationFn: async () => {
      await apiRequest('POST', '/api/automation/1/reset-defaults');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/automation/1'] });
      toast({
        title: "Success",
        description: "All rules reset to recommended defaults",
      });
    },
  });

  const handleRuleUpdate = (cryptoType: string, field: string, value: any) => {
    setLocalRules(prev => ({
      ...prev,
      [cryptoType]: {
        ...prev[cryptoType],
        [field]: value,
      },
    }));
  };

  const handleSave = () => {
    Object.values(localRules).forEach(rule => {
      updateRuleMutation.mutate({
        ruleId: rule.id,
        updates: {
          enabled: rule.enabled,
          profitTarget: rule.profitTarget,
          stopLoss: rule.stopLoss,
          sellPercentage: rule.sellPercentage,
        },
      });
    });
  };

  const ruleConfigs = [
    {
      type: 'meme',
      title: 'Meme Coin Strategy',
      icon: Laugh,
      color: 'from-yellow-400 to-orange-500',
    },
    {
      type: 'altcoin',
      title: 'Altcoin Strategy',
      icon: Gem,
      color: 'from-purple-500 to-pink-500',
    },
    {
      type: 'major',
      title: 'Major Coins (BTC/ETH/SOL)',
      icon: Star,
      color: 'from-crypto-blue to-crypto-green',
    },
  ];

  const mockStats = {
    totalAutomations: 12,
    activeTriggers: 3,
    profitsSaved: 15847.32,
    lossesPrevented: 8923.45,
  };

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="animate-pulse">Loading automation settings...</div>
      </div>
    );
  }

  return (
    <div className="py-4 lg:py-6 space-y-6 lg:space-y-8">
      {/* Automation Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-r from-crypto-blue/20 to-crypto-green/20 border-crypto-blue/30">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Active Automations</h3>
              <Bot className="h-5 w-5 text-crypto-blue" />
            </div>
            <div className="space-y-2">
              <p className="text-3xl font-bold text-neon-green">{mockStats.totalAutomations}</p>
              <p className="text-sm text-gray-400">Protecting your portfolio</p>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-dark-surface border-dark-border">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Active Triggers</h3>
              <Activity className="h-5 w-5 text-neon-orange" />
            </div>
            <div className="space-y-2">
              <p className="text-3xl font-bold text-neon-orange">{mockStats.activeTriggers}</p>
              <p className="text-sm text-gray-400">Ready to execute</p>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-dark-surface border-dark-border">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Profits Secured</h3>
              <TrendingUp className="h-5 w-5 text-profit-green" />
            </div>
            <div className="space-y-2">
              <p className="text-3xl font-bold text-profit-green">${mockStats.profitsSaved.toLocaleString()}</p>
              <p className="text-sm text-gray-400">This year</p>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-dark-surface border-dark-border">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Losses Prevented</h3>
              <Shield className="h-5 w-5 text-crypto-blue" />
            </div>
            <div className="space-y-2">
              <p className="text-3xl font-bold text-crypto-blue">${mockStats.lossesPrevented.toLocaleString()}</p>
              <p className="text-sm text-gray-400">Through smart selling</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="rules" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3 bg-dark-surface">
          <TabsTrigger value="rules">Automation Rules</TabsTrigger>
          <TabsTrigger value="history">Execution History</TabsTrigger>
          <TabsTrigger value="settings">Advanced Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="rules" className="space-y-6">
          {/* Automation Rules */}
          <div className="space-y-6">
            {ruleConfigs.map((config) => {
              const rule = localRules[config.type];
              const ruleDescription = getAutomationRuleDescription(config.type);
              const Icon = config.icon;
              
              if (!rule) return null;
              
              return (
                <Card key={config.type} className="bg-dark-surface border-dark-border">
                  <CardHeader className="p-4 lg:p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-3 flex-1 min-w-0">
                        <div className={`w-10 lg:w-12 h-10 lg:h-12 bg-gradient-to-r ${config.color} rounded-xl flex items-center justify-center flex-shrink-0`}>
                          <Icon className="w-5 lg:w-6 h-5 lg:h-6 text-white" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <CardTitle className="text-lg lg:text-xl truncate">{config.title}</CardTitle>
                          <p className="text-xs lg:text-sm text-gray-400 line-clamp-2 mt-1">{ruleDescription.description}</p>
                        </div>
                      </div>
                      <div className="flex flex-col lg:flex-row items-end lg:items-center space-y-2 lg:space-y-0 lg:space-x-4 ml-3">
                        <Badge variant="secondary" className={`text-xs ${rule.enabled ? 'bg-neon-green/20 text-neon-green' : 'bg-gray-500/20 text-gray-500'}`}>
                          {rule.enabled ? 'Active' : 'Inactive'}
                        </Badge>
                        <Switch
                          checked={rule.enabled || false}
                          onCheckedChange={(enabled) => handleRuleUpdate(config.type, 'enabled', enabled)}
                        />
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="p-4 lg:p-6 pt-0">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
                      <div className="space-y-2">
                        <Label htmlFor={`${config.type}-profit`} className="text-sm font-medium flex items-center space-x-2">
                          <Target className="w-4 h-4" />
                          <span>Profit Target (%)</span>
                        </Label>
                        <Input
                          id={`${config.type}-profit`}
                          type="number"
                          value={rule.profitTarget}
                          onChange={(e) => handleRuleUpdate(config.type, 'profitTarget', e.target.value)}
                          className="bg-dark-bg border-dark-border"
                        />
                        <p className="text-xs text-gray-400">
                          Recommended: {ruleDescription.recommendedTarget}
                        </p>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor={`${config.type}-stop`} className="text-sm font-medium flex items-center space-x-2">
                          <AlertTriangle className="w-4 h-4" />
                          <span>Stop Loss (%)</span>
                        </Label>
                        <Input
                          id={`${config.type}-stop`}
                          type="number"
                          value={rule.stopLoss}
                          onChange={(e) => handleRuleUpdate(config.type, 'stopLoss', e.target.value)}
                          className="bg-dark-bg border-dark-border"
                        />
                        <p className="text-xs text-gray-400">
                          Recommended: {ruleDescription.recommendedStopLoss}
                        </p>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor={`${config.type}-sell`} className="text-sm font-medium flex items-center space-x-2">
                          <Zap className="w-4 h-4" />
                          <span>Sell Percentage (%)</span>
                        </Label>
                        <Input
                          id={`${config.type}-sell`}
                          type="number"
                          value={rule.sellPercentage}
                          onChange={(e) => handleRuleUpdate(config.type, 'sellPercentage', e.target.value)}
                          className="bg-dark-bg border-dark-border"
                        />
                        <p className="text-xs text-gray-400">
                          Amount to sell when triggered
                        </p>
                      </div>

                      <div className="space-y-2">
                        <Label className="text-sm font-medium">Risk Level</Label>
                        <div className="pt-2">
                          <Badge 
                            variant="secondary"
                            className={`${
                              ruleDescription.riskLevel === 'High' ? 'bg-loss-red/20 text-loss-red' :
                              ruleDescription.riskLevel === 'Medium' ? 'bg-warning-yellow/20 text-warning-yellow' :
                              'bg-profit-green/20 text-profit-green'
                            }`}
                          >
                            {ruleDescription.riskLevel}
                          </Badge>
                          <Progress 
                            value={
                              ruleDescription.riskLevel === 'High' ? 80 :
                              ruleDescription.riskLevel === 'Medium' ? 50 : 20
                            } 
                            className="h-2 mt-2" 
                          />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          <div className="flex flex-col sm:flex-row justify-between space-y-2 sm:space-y-0 sm:space-x-4">
            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
              <Button
                variant="outline"
                className="border-dark-border text-sm"
                onClick={() => pauseAllMutation.mutate()}
                disabled={pauseAllMutation.isPending}
              >
                <Pause className="h-4 w-4 mr-2" />
                {pauseAllMutation.isPending ? "Pausing..." : "Pause All"}
              </Button>
              <Button
                variant="outline"
                className="border-dark-border text-sm"
                onClick={() => enableAllMutation.mutate()}
                disabled={enableAllMutation.isPending}
              >
                <Play className="h-4 w-4 mr-2" />
                {enableAllMutation.isPending ? "Enabling..." : "Enable All"}
              </Button>
              <Button
                variant="outline"
                className="border-dark-border text-sm"
                onClick={() => resetDefaultsMutation.mutate()}
                disabled={resetDefaultsMutation.isPending}
              >
                <RotateCcw className="h-4 w-4 mr-2" />
                {resetDefaultsMutation.isPending ? "Resetting..." : "Reset to Defaults"}
              </Button>
            </div>
            <Button
              onClick={handleSave}
              disabled={updateRuleMutation.isPending}
              className="bg-gradient-to-r from-crypto-blue to-crypto-green"
            >
              {updateRuleMutation.isPending ? "Saving..." : "Save All Rules"}
            </Button>
          </div>
        </TabsContent>

        <TabsContent value="history" className="space-y-6">
          <Card className="bg-dark-surface border-dark-border">
            <CardHeader className="p-3 lg:p-6">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg lg:text-xl">Automation Execution History</CardTitle>
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm" className="border-dark-border text-xs lg:text-sm">
                    Export
                  </Button>
                  <Button variant="outline" size="sm" className="border-dark-border text-xs lg:text-sm">
                    Filter
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-3 lg:p-6 pt-0">
              {executionsLoading ? (
                <div className="animate-pulse">Loading execution history...</div>
              ) : executions && executions.length > 0 ? (
                <div className="space-y-3 lg:space-y-4">
                  {executions.map((execution) => {
                    const isProfit = execution.type === 'auto_sell' && parseFloat(execution.totalValue) > 0;
                    const isStopLoss = execution.type === 'auto_sell' && parseFloat(execution.totalValue) < 0;
                    
                    const actionType = isProfit ? 'Profit Taking' : isStopLoss ? 'Stop Loss' : 'Auto Sell';
                    const actionColor = isProfit ? 'text-profit-green' : isStopLoss ? 'text-loss-red' : 'text-warning-yellow';
                    
                    return (
                      <div key={execution.id} className="flex items-center justify-between p-3 lg:p-4 border border-dark-border rounded-xl hover:bg-dark-bg/50 transition-colors">
                        <div className="flex items-center space-x-3 lg:space-x-4">
                          <div className={`w-10 lg:w-12 h-10 lg:h-12 bg-gradient-to-r ${
                            execution.crypto.type === 'meme' ? 'from-yellow-400 to-orange-500' :
                            execution.crypto.type === 'altcoin' ? 'from-purple-500 to-pink-500' :
                            'from-crypto-blue to-crypto-green'
                          } rounded-full flex items-center justify-center font-bold text-white text-sm lg:text-base`}>
                            {execution.crypto.symbol.slice(0, 2)}
                          </div>
                          <div>
                            <p className="font-semibold text-sm lg:text-base">{execution.crypto.symbol} - {actionType}</p>
                            <p className="text-xs lg:text-sm text-gray-400">
                              {execution.type === 'sell' ? 'Sold' : 'Auto-sold'} {Math.abs(parseFloat(execution.amount)).toFixed(6)} {execution.crypto.symbol}
                            </p>
                            <p className="text-xs text-gray-500">
                              {new Date(execution.createdAt).toLocaleDateString()} at {new Date(execution.createdAt).toLocaleTimeString()}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className={`font-semibold text-sm lg:text-base ${actionColor}`}>
                            {parseFloat(execution.totalValue) >= 0 ? '+' : ''}${Math.abs(parseFloat(execution.totalValue)).toLocaleString(undefined, { maximumFractionDigits: 2 })}
                          </p>
                          <p className="text-xs lg:text-sm text-gray-400">
                            @ ${parseFloat(execution.price).toLocaleString()}
                          </p>
                          <Badge variant="secondary" className={`text-xs mt-1 ${
                            execution.crypto.type === 'meme' ? 'bg-yellow-500/20 text-yellow-400' :
                            execution.crypto.type === 'altcoin' ? 'bg-purple-500/20 text-purple-400' :
                            'bg-blue-500/20 text-blue-400'
                          }`}>
                            {execution.crypto.type}
                          </Badge>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="w-16 h-16 mx-auto mb-4 bg-dark-bg rounded-full flex items-center justify-center">
                    <Activity className="w-8 h-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">No Automation Executions Yet</h3>
                  <p className="text-gray-400 mb-4">Your automation rules haven't triggered any transactions yet.</p>
                  <Button variant="outline" className="border-dark-border">
                    View All Transactions
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="bg-dark-surface border-dark-border">
              <CardHeader className="p-3 lg:p-6">
                <CardTitle className="flex items-center space-x-2 text-lg lg:text-xl">
                  <Settings className="h-5 w-5" />
                  <span>Global Settings</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 p-3 lg:p-6 pt-0">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="global-automation" className="text-sm font-medium">
                      Enable All Automation
                    </Label>
                    <Switch id="global-automation" defaultChecked />
                  </div>
                  <p className="text-xs text-gray-400">
                    Master switch for all automation rules
                  </p>
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="notifications" className="text-sm font-medium">
                      Execution Notifications
                    </Label>
                    <Switch id="notifications" defaultChecked />
                  </div>
                  <p className="text-xs text-gray-400">
                    Get notified when rules execute trades
                  </p>
                </div>
                
                <div className="space-y-3">
                  <Label htmlFor="max-daily" className="text-sm font-medium">
                    Max Daily Executions
                  </Label>
                  <Input
                    id="max-daily"
                    type="number"
                    defaultValue="10"
                    className="bg-dark-bg border-dark-border"
                  />
                  <p className="text-xs text-gray-400">
                    Prevent excessive trading in volatile markets
                  </p>
                </div>
                
                <div className="space-y-3">
                  <Label htmlFor="delay" className="text-sm font-medium">
                    Execution Delay (seconds)
                  </Label>
                  <Input
                    id="delay"
                    type="number"
                    defaultValue="30"
                    className="bg-dark-bg border-dark-border"
                  />
                  <p className="text-xs text-gray-400">
                    Delay between trigger and execution
                  </p>
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="gas-optimization" className="text-sm font-medium">
                      Gas Fee Optimization
                    </Label>
                    <Switch id="gas-optimization" defaultChecked />
                  </div>
                  <p className="text-xs text-gray-400">
                    Wait for lower gas fees before executing
                  </p>
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="smart-timing" className="text-sm font-medium">
                      Smart Market Timing
                    </Label>
                    <Switch id="smart-timing" defaultChecked />
                  </div>
                  <p className="text-xs text-gray-400">
                    Analyze market conditions before selling
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-dark-surface border-dark-border">
              <CardHeader className="p-3 lg:p-6">
                <CardTitle className="flex items-center space-x-2 text-lg lg:text-xl">
                  <Shield className="h-5 w-5" />
                  <span>Security & Risk Management</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 p-3 lg:p-6 pt-0">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="multisig" className="text-sm font-medium">
                      Multi-signature Required
                    </Label>
                    <Switch id="multisig" />
                  </div>
                  <p className="text-xs text-gray-400">
                    Require multiple approvals for large trades
                  </p>
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="hardware-wallet" className="text-sm font-medium">
                      Hardware Wallet Confirmation
                    </Label>
                    <Switch id="hardware-wallet" />
                  </div>
                  <p className="text-xs text-gray-400">
                    Confirm automation rules on hardware wallet
                  </p>
                </div>
                
                <div className="space-y-3">
                  <Label htmlFor="trade-threshold" className="text-sm font-medium">
                    Large Trade Threshold (USD)
                  </Label>
                  <Input
                    id="trade-threshold"
                    type="number"
                    defaultValue="10000"
                    className="bg-dark-bg border-dark-border"
                  />
                  <p className="text-xs text-gray-400">
                    Require additional confirmation above this amount
                  </p>
                </div>
                
                <div className="space-y-3">
                  <Label htmlFor="cooldown" className="text-sm font-medium">
                    Execution Cool-down (minutes)
                  </Label>
                  <Input
                    id="cooldown"
                    type="number"
                    defaultValue="60"
                    className="bg-dark-bg border-dark-border"
                  />
                  <p className="text-xs text-gray-400">
                    Minimum time between rule executions
                  </p>
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="pause-volatility" className="text-sm font-medium">
                      Pause on High Volatility
                    </Label>
                    <Switch id="pause-volatility" defaultChecked />
                  </div>
                  <p className="text-xs text-gray-400">
                    Temporarily pause automation during extreme market volatility
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Action Buttons for Advanced Settings */}
          <div className="flex flex-col sm:flex-row justify-between space-y-2 sm:space-y-0 sm:space-x-4">
            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
              <Button variant="outline" className="border-dark-border text-sm">
                <Settings className="h-4 w-4 mr-2" />
                Export Settings
              </Button>
              <Button variant="outline" className="border-dark-border text-sm">
                <Activity className="h-4 w-4 mr-2" />
                Test Automation
              </Button>
            </div>
            <Button className="bg-gradient-to-r from-crypto-blue to-crypto-green">
              Save All Settings
            </Button>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
