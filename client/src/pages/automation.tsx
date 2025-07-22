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
import { Bot, TrendingUp, AlertTriangle, Settings, Activity, Zap, Target, Shield, Laugh, Gem, Star } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { getAutomationRuleDescription } from "@/lib/mock-data";
import type { AutomationRule } from "@shared/schema";

export default function Automation() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const { data: rules, isLoading } = useQuery<AutomationRule[]>({
    queryKey: ['/api/automation/1'],
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
    <div className="p-6 space-y-8">
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
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className={`w-12 h-12 bg-gradient-to-r ${config.color} rounded-xl flex items-center justify-center`}>
                          <Icon className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <CardTitle className="text-xl">{config.title}</CardTitle>
                          <p className="text-sm text-gray-400">{ruleDescription.description}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <Badge variant="secondary" className={`${rule.enabled ? 'bg-neon-green/20 text-neon-green' : 'bg-gray-500/20 text-gray-500'}`}>
                          {rule.enabled ? 'Active' : 'Inactive'}
                        </Badge>
                        <Switch
                          checked={rule.enabled}
                          onCheckedChange={(enabled) => handleRuleUpdate(config.type, 'enabled', enabled)}
                        />
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
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

          <div className="flex justify-end space-x-4">
            <Button
              variant="outline"
              className="border-dark-border"
            >
              Reset to Defaults
            </Button>
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
            <CardHeader>
              <CardTitle>Recent Automation Executions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { asset: 'DOGE', action: 'Profit Taking', amount: '50%', value: '$1,247.89', time: '2 hours ago', type: 'meme' },
                  { asset: 'SOL', action: 'Partial Sell', amount: '25%', value: '$3,456.21', time: '1 day ago', type: 'major' },
                  { asset: 'MATIC', action: 'Stop Loss', amount: '100%', value: '$892.34', time: '3 days ago', type: 'altcoin' },
                  { asset: 'ETH', action: 'Profit Taking', amount: '10%', value: '$2,134.56', time: '1 week ago', type: 'major' },
                ].map((execution, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border border-dark-border rounded-xl">
                    <div className="flex items-center space-x-4">
                      <div className={`w-10 h-10 bg-gradient-to-r ${
                        execution.type === 'meme' ? 'from-yellow-400 to-orange-500' :
                        execution.type === 'altcoin' ? 'from-purple-500 to-pink-500' :
                        'from-crypto-blue to-crypto-green'
                      } rounded-full flex items-center justify-center font-bold text-white`}>
                        {execution.asset.slice(0, 2)}
                      </div>
                      <div>
                        <p className="font-semibold">{execution.asset} - {execution.action}</p>
                        <p className="text-sm text-gray-400">Sold {execution.amount} of holdings</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-profit-green">{execution.value}</p>
                      <p className="text-sm text-gray-400">{execution.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="bg-dark-surface border-dark-border">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Settings className="h-5 w-5" />
                  <span>Global Settings</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Gas Fee Optimization</p>
                    <p className="text-sm text-gray-400">Wait for lower gas fees before executing</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Smart Timing</p>
                    <p className="text-sm text-gray-400">Analyze market conditions before selling</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Email Notifications</p>
                    <p className="text-sm text-gray-400">Get notified when rules are triggered</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="space-y-2">
                  <Label>Maximum Daily Executions</Label>
                  <Input type="number" defaultValue="10" className="bg-dark-bg border-dark-border" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-dark-surface border-dark-border">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Shield className="h-5 w-5" />
                  <span>Security Settings</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Multi-sig Required</p>
                    <p className="text-sm text-gray-400">Require multiple approvals for large trades</p>
                  </div>
                  <Switch />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Hardware Wallet Confirmation</p>
                    <p className="text-sm text-gray-400">Confirm automation rules on hardware wallet</p>
                  </div>
                  <Switch />
                </div>
                <div className="space-y-2">
                  <Label>Large Trade Threshold (USD)</Label>
                  <Input type="number" defaultValue="10000" className="bg-dark-bg border-dark-border" />
                </div>
                <div className="space-y-2">
                  <Label>Cool-down Period (minutes)</Label>
                  <Input type="number" defaultValue="60" className="bg-dark-bg border-dark-border" />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
