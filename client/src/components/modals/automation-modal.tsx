import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent } from "@/components/ui/card";
import { Laugh, Gem, Star } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

interface AutomationRule {
  id: number;
  userId: number;
  cryptoType: string;
  enabled: boolean;
  profitTarget: string;
  stopLoss: string;
  sellPercentage: string;
}

interface AutomationModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function AutomationModal({ open, onOpenChange }: AutomationModalProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const { data: rules, isLoading } = useQuery<AutomationRule[]>({
    queryKey: ['/api/automation/1'],
    enabled: open,
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
    onOpenChange(false);
  };

  const ruleConfigs = [
    {
      type: 'meme',
      title: 'Meme Coin Strategy',
      icon: Laugh,
      color: 'from-yellow-400 to-orange-500',
      description: 'Aggressive profit-taking for volatile meme coins',
    },
    {
      type: 'altcoin',
      title: 'Altcoin Strategy',
      icon: Gem,
      color: 'from-purple-500 to-pink-500',
      description: 'Balanced approach for alternative cryptocurrencies',
    },
    {
      type: 'major',
      title: 'Major Coins (BTC/ETH/SOL)',
      icon: Star,
      color: 'from-crypto-blue to-crypto-green',
      description: 'Conservative strategy for established cryptocurrencies',
    },
  ];

  if (isLoading) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="bg-dark-surface border-dark-border max-w-2xl">
          <div className="p-6">Loading automation rules...</div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-dark-surface border-dark-border max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Smart Automation Rules</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {ruleConfigs.map((config) => {
            const rule = localRules[config.type];
            const Icon = config.icon;
            
            if (!rule) return null;
            
            return (
              <Card key={config.type} className="border-dark-border">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className={`w-8 h-8 bg-gradient-to-r ${config.color} rounded-lg flex items-center justify-center`}>
                        <Icon className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <h4 className="text-lg font-semibold">{config.title}</h4>
                        <p className="text-sm text-gray-400">{config.description}</p>
                      </div>
                    </div>
                    <Switch
                      checked={rule.enabled}
                      onCheckedChange={(enabled) => handleRuleUpdate(config.type, 'enabled', enabled)}
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor={`${config.type}-profit`} className="text-sm font-medium">
                        Profit Target (%)
                      </Label>
                      <Input
                        id={`${config.type}-profit`}
                        type="number"
                        value={rule.profitTarget}
                        onChange={(e) => handleRuleUpdate(config.type, 'profitTarget', e.target.value)}
                        className="mt-1 bg-dark-bg border-dark-border"
                      />
                      <p className="text-xs text-gray-400 mt-1">
                        Sell {rule.sellPercentage}% when this profit is reached
                      </p>
                    </div>
                    
                    <div>
                      <Label htmlFor={`${config.type}-stop`} className="text-sm font-medium">
                        Stop Loss (%)
                      </Label>
                      <Input
                        id={`${config.type}-stop`}
                        type="number"
                        value={rule.stopLoss}
                        onChange={(e) => handleRuleUpdate(config.type, 'stopLoss', e.target.value)}
                        className="mt-1 bg-dark-bg border-dark-border"
                      />
                      <p className="text-xs text-gray-400 mt-1">
                        Sell {rule.sellPercentage}% when loss exceeds this
                      </p>
                    </div>
                    
                    <div>
                      <Label htmlFor={`${config.type}-sell`} className="text-sm font-medium">
                        Sell Percentage (%)
                      </Label>
                      <Input
                        id={`${config.type}-sell`}
                        type="number"
                        value={rule.sellPercentage}
                        onChange={(e) => handleRuleUpdate(config.type, 'sellPercentage', e.target.value)}
                        className="mt-1 bg-dark-bg border-dark-border"
                      />
                      <p className="text-xs text-gray-400 mt-1">
                        Percentage of holdings to sell when triggered
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
        
        <div className="flex space-x-4 mt-6">
          <Button
            onClick={handleSave}
            disabled={updateRuleMutation.isPending}
            className="flex-1 bg-gradient-to-r from-crypto-blue to-crypto-green"
          >
            {updateRuleMutation.isPending ? "Saving..." : "Save Rules"}
          </Button>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="border-dark-border"
          >
            Cancel
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
