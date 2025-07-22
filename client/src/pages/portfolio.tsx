import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Eye, TrendingUp, Bot } from "lucide-react";
import PortfolioChart from "@/components/portfolio/portfolio-chart";
import HoldingsTable from "@/components/portfolio/holdings-table";
import QuickActions from "@/components/portfolio/quick-actions";

interface PortfolioSummary {
  totalValue: number;
  totalInvested: number;
  totalPnl: number;
  totalPnlPercent: number;
}

export default function Portfolio() {
  const { data: summary } = useQuery<PortfolioSummary>({
    queryKey: ['/api/portfolio/1/summary'],
  });

  const mockChartData = [
    { label: 'Jan', value: 85000 },
    { label: 'Feb', value: 92000 },
    { label: 'Mar', value: 88000 },
    { label: 'Apr', value: 103000 },
    { label: 'May', value: 118000 },
    { label: 'Jun', value: 125000 },
    { label: 'Jul', value: 127845 },
  ];

  return (
    <div className="p-6 space-y-8">
      {/* Portfolio Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-gradient-to-r from-crypto-blue/20 to-crypto-green/20 border-crypto-blue/30">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Total Balance</h3>
              <Eye className="h-5 w-5 text-gray-400" />
            </div>
            <div className="space-y-2">
              <p className="text-3xl font-bold">
                ${summary?.totalValue.toLocaleString(undefined, { maximumFractionDigits: 2 }) || '127,845.32'}
              </p>
              <div className="flex items-center space-x-2">
                <span className="text-profit-green font-medium">
                  +${Math.abs(summary?.totalPnl || 8234.12).toLocaleString(undefined, { maximumFractionDigits: 2 })}
                </span>
                <Badge variant="secondary" className="bg-profit-green/20 text-profit-green">
                  +{summary?.totalPnlPercent.toFixed(2) || '6.87'}%
                </Badge>
                <span className="text-xs text-gray-400">24h</span>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-dark-surface border-dark-border">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Smart Automations</h3>
              <div className="w-3 h-3 bg-neon-green rounded-full animate-pulse"></div>
            </div>
            <div className="space-y-2">
              <p className="text-2xl font-bold text-neon-green">12 Active</p>
              <p className="text-sm text-gray-400">Protecting your investments</p>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-dark-surface border-dark-border">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Auto-Sells Today</h3>
              <TrendingUp className="h-5 w-5 text-profit-green" />
            </div>
            <div className="space-y-2">
              <p className="text-2xl font-bold text-profit-green">$3,247.89</p>
              <p className="text-sm text-gray-400">From 7 transactions</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Portfolio & Chart Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <PortfolioChart data={mockChartData} />
        <QuickActions />
      </div>

      {/* Holdings Table */}
      <HoldingsTable />
    </div>
  );
}
