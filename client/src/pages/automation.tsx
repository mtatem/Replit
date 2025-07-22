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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { Bot, TrendingUp, AlertTriangle, Settings, Activity, Zap, Target, Shield, Laugh, Gem, Star, Play, Pause, RotateCcw, Plus, Edit3, Trash2, Clock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { getAutomationRuleDescription } from "@/lib/mock-data";
import { cn } from "@/lib/utils";
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

interface CustomRule {
  id?: number;
  name: string;
  cryptoSymbol: string;
  triggerType: 'price_above' | 'price_below' | 'percentage_gain' | 'percentage_loss' | 'volume_spike';
  triggerValue: string;
  actionType: 'sell_percentage' | 'buy_amount' | 'send_alert';
  actionValue: string;
  enabled: boolean;
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
  const [showCustomRuleDialog, setShowCustomRuleDialog] = useState(false);
  const [editingCustomRule, setEditingCustomRule] = useState<CustomRule | null>(null);
  const [customRules, setCustomRules] = useState<CustomRule[]>([
    {
      id: 1,
      name: "BTC Price Alert",
      cryptoSymbol: "BTC",
      triggerType: "price_above",
      triggerValue: "100000",
      actionType: "send_alert",
      actionValue: "Price alert triggered",
      enabled: true
    },
    {
      id: 2,
      name: "ETH Stop Loss",
      cryptoSymbol: "ETH",
      triggerType: "percentage_loss",
      triggerValue: "15",
      actionType: "sell_percentage",
      actionValue: "50",
      enabled: false
    }
  ]);
  
  const [newCustomRule, setNewCustomRule] = useState<Omit<CustomRule, 'id'>>({
    name: "",
    cryptoSymbol: "BTC",
    triggerType: "price_above",
    triggerValue: "",
    actionType: "send_alert",
    actionValue: "",
    enabled: true
  });

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

  const handleCreateCustomRule = () => {
    if (!newCustomRule.name || !newCustomRule.triggerValue || !newCustomRule.actionValue) {
      toast({
        title: "Invalid Rule",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    const rule: CustomRule = {
      id: Math.max(...customRules.map(r => r.id || 0)) + 1,
      ...newCustomRule
    };

    setCustomRules(prev => [...prev, rule]);
    setNewCustomRule({
      name: "",
      cryptoSymbol: "BTC",
      triggerType: "price_above",
      triggerValue: "",
      actionType: "send_alert",
      actionValue: "",
      enabled: true
    });
    setShowCustomRuleDialog(false);
    
    toast({
      title: "Rule Created",
      description: `Custom rule "${rule.name}" has been created successfully`,
    });
  };

  const handleEditCustomRule = (rule: CustomRule) => {
    setEditingCustomRule(rule);
    setNewCustomRule(rule);
    setShowCustomRuleDialog(true);
  };

  const handleUpdateCustomRule = () => {
    if (!editingCustomRule) return;

    setCustomRules(prev => prev.map(r => 
      r.id === editingCustomRule.id ? { ...newCustomRule, id: editingCustomRule.id } : r
    ));
    
    setEditingCustomRule(null);
    setNewCustomRule({
      name: "",
      cryptoSymbol: "BTC", 
      triggerType: "price_above",
      triggerValue: "",
      actionType: "send_alert",
      actionValue: "",
      enabled: true
    });
    setShowCustomRuleDialog(false);

    toast({
      title: "Rule Updated",
      description: "Custom rule has been updated successfully",
    });
  };

  const handleDeleteCustomRule = (ruleId: number) => {
    setCustomRules(prev => prev.filter(r => r.id !== ruleId));
    toast({
      title: "Rule Deleted",
      description: "Custom rule has been deleted",
    });
  };

  const toggleCustomRule = (ruleId: number) => {
    setCustomRules(prev => prev.map(r => 
      r.id === ruleId ? { ...r, enabled: !r.enabled } : r
    ));
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

  const resetDialog = () => {
    setEditingCustomRule(null);
    setNewCustomRule({
      name: "",
      cryptoSymbol: "BTC",
      triggerType: "price_above",
      triggerValue: "",
      actionType: "send_alert", 
      actionValue: "",
      enabled: true
    });
  };

  return (
    <div className="p-3 lg:p-6 max-w-7xl mx-auto">
      <div className="space-y-4 lg:space-y-6">
        {/* Header */}
        <div className="text-center lg:text-left">
          <h1 className="text-2xl lg:text-3xl font-bold mb-2">Smart Automation</h1>
          <p className="text-gray-400">Automate your crypto trading with intelligent rules and custom triggers</p>
        </div>

        {/* Automation Overview */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
          <Card className="bg-gradient-to-r from-crypto-blue/20 to-crypto-green/20 border-crypto-blue/30">
            <CardContent className="p-4 lg:p-6">
              <div className="flex items-center justify-between mb-3 lg:mb-4">
                <div className="flex items-center space-x-2">
                  <Bot className="h-4 lg:h-5 w-4 lg:w-5 text-crypto-blue" />
                  <h3 className="text-sm lg:text-lg font-semibold">Active Rules</h3>
                </div>
              </div>
              <div className="space-y-1 lg:space-y-2">
                <p className="text-2xl lg:text-3xl font-bold text-neon-green">{mockStats.totalAutomations}</p>
                <p className="text-xs lg:text-sm text-gray-400">Protecting portfolio</p>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-dark-surface border-dark-border">
            <CardContent className="p-4 lg:p-6">
              <div className="flex items-center justify-between mb-3 lg:mb-4">
                <div className="flex items-center space-x-2">
                  <Activity className="h-4 lg:h-5 w-4 lg:w-5 text-neon-orange" />
                  <h3 className="text-sm lg:text-lg font-semibold">Active Triggers</h3>
                </div>
              </div>
              <div className="space-y-1 lg:space-y-2">
                <p className="text-2xl lg:text-3xl font-bold text-neon-orange">{mockStats.activeTriggers}</p>
                <p className="text-xs lg:text-sm text-gray-400">Ready to execute</p>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-dark-surface border-dark-border">
            <CardContent className="p-4 lg:p-6">
              <div className="flex items-center justify-between mb-3 lg:mb-4">
                <div className="flex items-center space-x-2">
                  <TrendingUp className="h-4 lg:h-5 w-4 lg:w-5 text-profit-green" />
                  <h3 className="text-sm lg:text-lg font-semibold">Profits Secured</h3>
                </div>
              </div>
              <div className="space-y-1 lg:space-y-2">
                <p className="text-2xl lg:text-3xl font-bold text-profit-green">${mockStats.profitsSaved.toLocaleString()}</p>
                <p className="text-xs lg:text-sm text-gray-400">This year</p>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-dark-surface border-dark-border">
            <CardContent className="p-4 lg:p-6">
              <div className="flex items-center justify-between mb-3 lg:mb-4">
                <div className="flex items-center space-x-2">
                  <Shield className="h-4 lg:h-5 w-4 lg:w-5 text-red-400" />
                  <h3 className="text-sm lg:text-lg font-semibold">Losses Prevented</h3>
                </div>
              </div>
              <div className="space-y-1 lg:space-y-2">
                <p className="text-2xl lg:text-3xl font-bold text-red-400">${mockStats.lossesPrevented.toLocaleString()}</p>
                <p className="text-xs lg:text-sm text-gray-400">This year</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="strategies" className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-dark-bg h-12 lg:h-14">
            <TabsTrigger value="strategies" className="text-sm lg:text-base">Smart Strategies</TabsTrigger>
            <TabsTrigger value="custom" className="text-sm lg:text-base">Custom Rules</TabsTrigger>
            <TabsTrigger value="history" className="text-sm lg:text-base">Execution History</TabsTrigger>
          </TabsList>
          
          <TabsContent value="strategies" className="mt-4 lg:mt-6">
            <div className="space-y-4 lg:space-y-6">
              {/* Global Controls */}
              <Card className="bg-dark-surface border-dark-border">
                <CardContent className="p-4 lg:p-6">
                  <div className="flex flex-col lg:flex-row justify-between lg:items-center space-y-4 lg:space-y-0">
                    <div>
                      <h3 className="text-lg font-semibold mb-1">Quick Controls</h3>
                      <p className="text-sm text-gray-400">Manage all automation rules at once</p>
                    </div>
                    <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
                      <Button
                        onClick={() => pauseAllMutation.mutate()}
                        variant="outline"
                        className="border-dark-border"
                        disabled={pauseAllMutation.isPending}
                      >
                        <Pause className="h-4 w-4 mr-2" />
                        Pause All
                      </Button>
                      <Button
                        onClick={() => enableAllMutation.mutate()}
                        variant="outline" 
                        className="border-dark-border"
                        disabled={enableAllMutation.isPending}
                      >
                        <Play className="h-4 w-4 mr-2" />
                        Enable All
                      </Button>
                      <Button
                        onClick={() => resetDefaultsMutation.mutate()}
                        variant="outline"
                        className="border-dark-border"
                        disabled={resetDefaultsMutation.isPending}
                      >
                        <RotateCcw className="h-4 w-4 mr-2" />
                        Reset Defaults
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Smart Strategy Rules */}
              <div className="space-y-4 lg:space-y-6">
                {ruleConfigs.map((config) => {
                  const rule = localRules[config.type];
                  const ruleDescription = getAutomationRuleDescription(config.type);
                  const Icon = config.icon;
                  
                  if (!rule) return null;
                  
                  return (
                    <Card key={config.type} className="bg-dark-surface border-dark-border">
                      <CardContent className="p-4 lg:p-6">
                        <div className="flex flex-col lg:flex-row lg:items-center justify-between space-y-4 lg:space-y-0 lg:space-x-6">
                          <div className="flex items-center space-x-3 flex-1">
                            <div className={cn("w-10 lg:w-12 h-10 lg:h-12 bg-gradient-to-r rounded-xl flex items-center justify-center", config.color)}>
                              <Icon className="w-5 lg:w-6 h-5 lg:h-6 text-white" />
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center space-x-2 mb-1">
                                <h3 className="text-base lg:text-lg font-semibold">{config.title}</h3>
                                <Badge variant="secondary" className={cn("text-xs", 
                                  rule.enabled ? 'bg-neon-green/20 text-neon-green' : 'bg-gray-500/20 text-gray-500'
                                )}>
                                  {rule.enabled ? 'Active' : 'Inactive'}
                                </Badge>
                              </div>
                              <p className="text-xs lg:text-sm text-gray-400">{ruleDescription.description}</p>
                            </div>
                          </div>
                          
                          <div className="flex items-center space-x-2">
                            <Switch
                              checked={rule.enabled || false}
                              onCheckedChange={(enabled) => handleRuleUpdate(config.type, 'enabled', enabled)}
                            />
                          </div>
                        </div>
                        
                        <Separator className="my-4 bg-dark-border" />
                        
                        {/* Rule Settings */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                          <div className="space-y-2">
                            <Label className="text-xs lg:text-sm text-gray-400">Profit Target (%)</Label>
                            <Input
                              type="number"
                              placeholder="0"
                              value={rule.profitTarget || ''}
                              onChange={(e) => handleRuleUpdate(config.type, 'profitTarget', e.target.value)}
                              className="bg-dark-bg border-dark-border h-10"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label className="text-xs lg:text-sm text-gray-400">Stop Loss (%)</Label>
                            <Input
                              type="number"
                              placeholder="0"
                              value={rule.stopLoss || ''}
                              onChange={(e) => handleRuleUpdate(config.type, 'stopLoss', e.target.value)}
                              className="bg-dark-bg border-dark-border h-10"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label className="text-xs lg:text-sm text-gray-400">Sell Amount (%)</Label>
                            <Input
                              type="number"
                              placeholder="0"
                              value={rule.sellPercentage || ''}
                              onChange={(e) => handleRuleUpdate(config.type, 'sellPercentage', e.target.value)}
                              className="bg-dark-bg border-dark-border h-10"
                            />
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
              
              <div className="flex justify-center">
                <Button 
                  onClick={handleSave}
                  className="bg-gradient-to-r from-crypto-blue to-crypto-green px-8"
                  disabled={updateRuleMutation.isPending}
                >
                  {updateRuleMutation.isPending ? "Saving..." : "Save All Changes"}
                </Button>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="custom" className="mt-4 lg:mt-6">
            <div className="space-y-4 lg:space-y-6">
              {/* Header with Add Button */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
                <div>
                  <h2 className="text-xl lg:text-2xl font-bold mb-1">Custom Automation Rules</h2>
                  <p className="text-sm text-gray-400">Create personalized trading rules with custom triggers and actions</p>
                </div>
                <Dialog open={showCustomRuleDialog} onOpenChange={(open) => {
                  setShowCustomRuleDialog(open);
                  if (!open) resetDialog();
                }}>
                  <DialogTrigger asChild>
                    <Button className="bg-gradient-to-r from-crypto-blue to-crypto-green">
                      <Plus className="h-4 w-4 mr-2" />
                      Add Custom Rule
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-lg bg-dark-surface border-dark-border">
                    <DialogHeader>
                      <DialogTitle>{editingCustomRule ? 'Edit Custom Rule' : 'Create Custom Rule'}</DialogTitle>
                      <DialogDescription>
                        Set up automated triggers and actions for your cryptocurrency portfolio
                      </DialogDescription>
                    </DialogHeader>
                    
                    <div className="space-y-4">
                      <div>
                        <Label className="text-sm">Rule Name</Label>
                        <Input
                          placeholder="My Custom Rule"
                          value={newCustomRule.name}
                          onChange={(e) => setNewCustomRule({...newCustomRule, name: e.target.value})}
                          className="bg-dark-bg border-dark-border mt-1"
                        />
                      </div>
                      
                      <div>
                        <Label className="text-sm">Cryptocurrency</Label>
                        <Select value={newCustomRule.cryptoSymbol} onValueChange={(value) => setNewCustomRule({...newCustomRule, cryptoSymbol: value})}>
                          <SelectTrigger className="bg-dark-bg border-dark-border mt-1">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="bg-dark-surface border-dark-border">
                            <SelectItem value="BTC">Bitcoin (BTC)</SelectItem>
                            <SelectItem value="ETH">Ethereum (ETH)</SelectItem>
                            <SelectItem value="SOL">Solana (SOL)</SelectItem>
                            <SelectItem value="ADA">Cardano (ADA)</SelectItem>
                            <SelectItem value="DOT">Polkadot (DOT)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label className="text-sm">Trigger Type</Label>
                          <Select value={newCustomRule.triggerType} onValueChange={(value) => setNewCustomRule({...newCustomRule, triggerType: value as any})}>
                            <SelectTrigger className="bg-dark-bg border-dark-border mt-1">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="bg-dark-surface border-dark-border">
                              <SelectItem value="price_above">Price Above</SelectItem>
                              <SelectItem value="price_below">Price Below</SelectItem>
                              <SelectItem value="percentage_gain">% Gain</SelectItem>
                              <SelectItem value="percentage_loss">% Loss</SelectItem>
                              <SelectItem value="volume_spike">Volume Spike</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        
                        <div>
                          <Label className="text-sm">Trigger Value</Label>
                          <Input
                            placeholder="1000"
                            value={newCustomRule.triggerValue}
                            onChange={(e) => setNewCustomRule({...newCustomRule, triggerValue: e.target.value})}
                            className="bg-dark-bg border-dark-border mt-1"
                          />
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label className="text-sm">Action Type</Label>
                          <Select value={newCustomRule.actionType} onValueChange={(value) => setNewCustomRule({...newCustomRule, actionType: value as any})}>
                            <SelectTrigger className="bg-dark-bg border-dark-border mt-1">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="bg-dark-surface border-dark-border">
                              <SelectItem value="sell_percentage">Sell %</SelectItem>
                              <SelectItem value="buy_amount">Buy Amount</SelectItem>
                              <SelectItem value="send_alert">Send Alert</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        
                        <div>
                          <Label className="text-sm">Action Value</Label>
                          <Input
                            placeholder={newCustomRule.actionType === 'send_alert' ? 'Alert message' : '50'}
                            value={newCustomRule.actionValue}
                            onChange={(e) => setNewCustomRule({...newCustomRule, actionValue: e.target.value})}
                            className="bg-dark-bg border-dark-border mt-1"
                          />
                        </div>
                      </div>
                    </div>
                    
                    <DialogFooter>
                      <Button
                        variant="outline"
                        onClick={() => {
                          setShowCustomRuleDialog(false);
                          resetDialog();
                        }}
                        className="border-dark-border"
                      >
                        Cancel
                      </Button>
                      <Button
                        onClick={editingCustomRule ? handleUpdateCustomRule : handleCreateCustomRule}
                        className="bg-gradient-to-r from-crypto-blue to-crypto-green"
                      >
                        {editingCustomRule ? 'Update Rule' : 'Create Rule'}
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>

              {/* Custom Rules List */}
              <div className="space-y-4">
                {customRules.map((rule) => (
                  <Card key={rule.id} className="bg-dark-surface border-dark-border">
                    <CardContent className="p-4 lg:p-6">
                      <div className="flex flex-col lg:flex-row justify-between space-y-4 lg:space-y-0 lg:space-x-4">
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center space-x-3">
                              <h3 className="font-semibold text-base lg:text-lg">{rule.name}</h3>
                              <Badge variant="outline" className="text-xs">
                                {rule.cryptoSymbol}
                              </Badge>
                              <Badge variant="secondary" className={cn("text-xs",
                                rule.enabled ? 'bg-neon-green/20 text-neon-green' : 'bg-gray-500/20 text-gray-500'
                              )}>
                                {rule.enabled ? 'Active' : 'Inactive'}
                              </Badge>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Switch
                                checked={rule.enabled}
                                onCheckedChange={() => toggleCustomRule(rule.id!)}
                                size="sm"
                              />
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-sm">
                            <div className="p-2 bg-dark-bg rounded">
                              <p className="text-gray-400 text-xs">Trigger</p>
                              <p className="font-medium">
                                {rule.triggerType.replace('_', ' ').toUpperCase()}: {rule.triggerValue}
                                {rule.triggerType.includes('percentage') ? '%' : rule.triggerType.includes('price') ? ' USD' : ''}
                              </p>
                            </div>
                            <div className="p-2 bg-dark-bg rounded">
                              <p className="text-gray-400 text-xs">Action</p>
                              <p className="font-medium">
                                {rule.actionType.replace('_', ' ').toUpperCase()}: {rule.actionValue}
                                {rule.actionType.includes('percentage') ? '%' : ''}
                              </p>
                            </div>
                            <div className="p-2 bg-dark-bg rounded">
                              <p className="text-gray-400 text-xs">Status</p>
                              <p className={cn("font-medium", rule.enabled ? 'text-neon-green' : 'text-gray-500')}>
                                {rule.enabled ? 'Monitoring' : 'Paused'}
                              </p>
                            </div>
                            <div className="p-2 bg-dark-bg rounded">
                              <p className="text-gray-400 text-xs">Last Check</p>
                              <p className="font-medium text-gray-400">Just now</p>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-start space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEditCustomRule(rule)}
                            className="border-dark-border"
                          >
                            <Edit3 className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDeleteCustomRule(rule.id!)}
                            className="border-dark-border text-red-400 hover:text-red-300"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
                
                {customRules.length === 0 && (
                  <Card className="bg-dark-surface border-dark-border border-dashed">
                    <CardContent className="p-8 text-center">
                      <Target className="h-12 w-12 text-gray-500 mx-auto mb-4" />
                      <h3 className="text-lg font-semibold mb-2">No Custom Rules Yet</h3>
                      <p className="text-gray-400 mb-4">Create your first custom automation rule to get started</p>
                      <Button
                        onClick={() => setShowCustomRuleDialog(true)}
                        className="bg-gradient-to-r from-crypto-blue to-crypto-green"
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Add Your First Rule
                      </Button>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="history" className="mt-4 lg:mt-6">
            <Card className="bg-dark-surface border-dark-border">
              <CardHeader className="p-4 lg:p-6">
                <CardTitle className="flex items-center space-x-2">
                  <Clock className="h-5 w-5" />
                  <span>Automation Execution History</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 lg:p-6 pt-0">
                {executionsLoading ? (
                  <div className="text-center py-8">
                    <div className="animate-spin w-6 h-6 border-2 border-crypto-blue border-t-transparent rounded-full mx-auto mb-2" />
                    <p className="text-gray-400">Loading execution history...</p>
                  </div>
                ) : executions && executions.length > 0 ? (
                  <div className="space-y-4">
                    {executions.map((execution) => (
                      <div key={execution.id} className="flex items-center justify-between p-4 border border-dark-border rounded-xl">
                        <div className="flex items-center space-x-4">
                          <div className="w-10 h-10 bg-gradient-to-r from-crypto-blue to-crypto-green rounded-full flex items-center justify-center">
                            <Bot className="h-5 w-5 text-white" />
                          </div>
                          <div>
                            <h4 className="font-semibold">{execution.crypto.name} ({execution.crypto.symbol})</h4>
                            <p className="text-sm text-gray-400">
                              {execution.type.toUpperCase()} • {execution.amount} {execution.crypto.symbol}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold">${parseFloat(execution.totalValue).toLocaleString()}</p>
                          <p className="text-sm text-gray-400">
                            {new Date(execution.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Activity className="h-12 w-12 text-gray-500 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No Executions Yet</h3>
                    <p className="text-gray-400">Your automation rules haven't triggered any actions yet</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
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
