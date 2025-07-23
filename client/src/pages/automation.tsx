import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Settings, TrendingUp, TrendingDown, DollarSign, Zap, AlertTriangle } from 'lucide-react';

interface AutomationRule {
  id: string;
  name: string;
  type: 'buy' | 'sell' | 'rebalance';
  crypto: string;
  condition: string;
  amount: string;
  enabled: boolean;
  status: 'active' | 'triggered' | 'paused';
}

const mockRules: AutomationRule[] = [
  {
    id: '1',
    name: 'BTC DCA Strategy',
    type: 'buy',
    crypto: 'BTC',
    condition: 'Every Monday at 9:00 AM',
    amount: '$100',
    enabled: true,
    status: 'active'
  },
  {
    id: '2',
    name: 'ETH Profit Taking',
    type: 'sell',
    crypto: 'ETH',
    condition: 'When price > $4,000',
    amount: '25%',
    enabled: true,
    status: 'active'
  },
  {
    id: '3',
    name: 'SOL Stop Loss',
    type: 'sell',
    crypto: 'SOL',
    condition: 'When price < $180',
    amount: '50%',
    enabled: false,
    status: 'paused'
  }
];

export default function Automation() {
  const [rules, setRules] = useState<AutomationRule[]>(mockRules);

  const toggleRule = (id: string) => {
    setRules(rules.map(rule => 
      rule.id === id 
        ? { ...rule, enabled: !rule.enabled, status: !rule.enabled ? 'active' : 'paused' }
        : rule
    ));
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'buy':
        return <TrendingUp className="h-4 w-4 text-green-400" />;
      case 'sell':
        return <TrendingDown className="h-4 w-4 text-red-400" />;
      case 'rebalance':
        return <DollarSign className="h-4 w-4 text-blue-400" />;
      default:
        return <Zap className="h-4 w-4 text-yellow-400" />;
    }
  };

  const getStatusBadge = (status: string, enabled: boolean) => {
    if (!enabled) {
      return <Badge variant="secondary" className="bg-gray-600">Paused</Badge>;
    }
    
    switch (status) {
      case 'active':
        return <Badge className="bg-green-600">Active</Badge>;
      case 'triggered':
        return <Badge className="bg-yellow-600">Triggered</Badge>;
      default:
        return <Badge variant="secondary">Unknown</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Smart Automation</h1>
          <p className="text-gray-400 mt-1">Set up automated trading rules to maximize your gains</p>
        </div>
        <Button className="bg-primary hover:bg-primary/90">
          <Settings className="h-4 w-4 mr-2" />
          Create Rule
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-card border-border">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-400">Active Rules</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">
              {rules.filter(rule => rule.enabled).length}
            </div>
            <p className="text-xs text-gray-400 mt-1">
              {rules.length} total rules
            </p>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-400">This Month</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-400">
              +$2,847
            </div>
            <p className="text-xs text-gray-400 mt-1">
              Automated profits
            </p>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-400">Success Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-400">
              87%
            </div>
            <p className="text-xs text-gray-400 mt-1">
              Profitable trades
            </p>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-white">Automation Rules</CardTitle>
          <CardDescription>
            Manage your automated trading strategies
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {rules.map((rule) => (
            <div
              key={rule.id}
              className="flex items-center justify-between p-4 bg-dark-card rounded-lg border border-border"
            >
              <div className="flex items-center space-x-4">
                {getTypeIcon(rule.type)}
                <div>
                  <h3 className="font-medium text-white">{rule.name}</h3>
                  <p className="text-sm text-gray-400">
                    {rule.condition} • {rule.amount}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                <Badge className="bg-blue-600/20 text-blue-400 border-blue-600/30">
                  {rule.crypto}
                </Badge>
                {getStatusBadge(rule.status, rule.enabled)}
                <Switch
                  checked={rule.enabled}
                  onCheckedChange={() => toggleRule(rule.id)}
                />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card className="bg-orange-950/20 border-orange-900/30">
        <CardContent className="pt-6">
          <div className="flex items-start space-x-3">
            <AlertTriangle className="h-5 w-5 text-orange-400 mt-0.5" />
            <div>
              <h3 className="font-medium text-orange-400">Risk Warning</h3>
              <p className="text-sm text-orange-300/80 mt-1">
                Automated trading involves significant risk. Past performance does not guarantee future results. 
                Only use funds you can afford to lose and always monitor your positions.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}