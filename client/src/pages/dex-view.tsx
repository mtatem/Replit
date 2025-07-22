import { useState, useEffect, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ArrowUpIcon, ArrowDownIcon, TrendingUp, BarChart3, Activity, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import { generateCandlestickData, generateOrderBookData, generateRecentTrades, marketStats, tradingPairs } from "@/lib/mock-data";
import type { Cryptocurrency } from "@shared/schema";

export default function DexView() {
  const [selectedPair, setSelectedPair] = useState("BTC/USD");
  const [orderType, setOrderType] = useState("market");
  const [buyAmount, setBuyAmount] = useState("");
  const [sellAmount, setSellAmount] = useState("");
  const [buyPrice, setBuyPrice] = useState("");
  const [sellPrice, setSellPrice] = useState("");
  
  const chartRef = useRef<HTMLCanvasElement>(null);

  const { data: cryptocurrencies } = useQuery<Cryptocurrency[]>({
    queryKey: ['/api/cryptocurrencies'],
  });

  // Generate mock trading data
  const candlestickData = generateCandlestickData(42000, 100, 0.02);
  const orderBook = generateOrderBookData();
  const recentTrades = generateRecentTrades();

  // Simple candlestick chart implementation
  useEffect(() => {
    const canvas = chartRef.current;
    if (!canvas || !candlestickData.length) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    canvas.width = canvas.offsetWidth * devicePixelRatio;
    canvas.height = canvas.offsetHeight * devicePixelRatio;
    ctx.scale(devicePixelRatio, devicePixelRatio);

    // Clear canvas
    ctx.clearRect(0, 0, canvas.offsetWidth, canvas.offsetHeight);

    const padding = 40;
    const chartWidth = canvas.offsetWidth - padding * 2;
    const chartHeight = canvas.offsetHeight - padding * 2;

    // Calculate price range
    const prices = candlestickData.flatMap(d => [d.high, d.low]);
    const maxPrice = Math.max(...prices);
    const minPrice = Math.min(...prices);
    const priceRange = maxPrice - minPrice;

    // Draw candlesticks
    const candleWidth = chartWidth / candlestickData.length * 0.6;
    
    candlestickData.forEach((candle, index) => {
      const x = padding + (index / candlestickData.length) * chartWidth;
      const openY = padding + ((maxPrice - candle.open) / priceRange) * chartHeight;
      const closeY = padding + ((maxPrice - candle.close) / priceRange) * chartHeight;
      const highY = padding + ((maxPrice - candle.high) / priceRange) * chartHeight;
      const lowY = padding + ((maxPrice - candle.low) / priceRange) * chartHeight;

      const isGreen = candle.close > candle.open;
      ctx.strokeStyle = isGreen ? '#10B981' : '#EF4444';
      ctx.fillStyle = isGreen ? '#10B981' : '#EF4444';
      ctx.lineWidth = 1;

      // Draw wick
      ctx.beginPath();
      ctx.moveTo(x, highY);
      ctx.lineTo(x, lowY);
      ctx.stroke();

      // Draw body
      const bodyTop = Math.min(openY, closeY);
      const bodyHeight = Math.abs(closeY - openY);
      
      if (isGreen) {
        ctx.fillRect(x - candleWidth / 2, bodyTop, candleWidth, bodyHeight);
      } else {
        ctx.strokeRect(x - candleWidth / 2, bodyTop, candleWidth, bodyHeight);
      }
    });

    // Draw grid lines
    ctx.strokeStyle = '#374151';
    ctx.lineWidth = 1;
    for (let i = 0; i <= 5; i++) {
      const y = padding + (i / 5) * chartHeight;
      ctx.beginPath();
      ctx.moveTo(padding, y);
      ctx.lineTo(padding + chartWidth, y);
      ctx.stroke();
    }

  }, [candlestickData]);

  const currentCrypto = cryptocurrencies?.find(c => selectedPair.startsWith(c.symbol));

  return (
    <div className="p-3 lg:p-6 space-y-4 lg:space-y-6">
      {/* Trading Pair Selector & Stats */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
        <div className="flex flex-col sm:flex-row sm:items-center space-y-3 sm:space-y-0 sm:space-x-4">
          <Select value={selectedPair} onValueChange={setSelectedPair}>
            <SelectTrigger className="w-full sm:w-48 bg-dark-surface border-dark-border">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {tradingPairs.map((pair) => (
                <SelectItem key={pair.symbol} value={pair.symbol}>
                  <div className="flex items-center justify-between w-full">
                    <span>{pair.symbol}</span>
                    <Badge variant={pair.change >= 0 ? "default" : "destructive"} className="ml-2">
                      {pair.change >= 0 ? '+' : ''}{pair.change}%
                    </Badge>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          {currentCrypto && (
            <div className="flex items-center space-x-4 lg:space-x-6">
              <div>
                <p className="text-xl lg:text-2xl font-bold">${parseFloat(currentCrypto.currentPrice).toLocaleString()}</p>
                <div className="flex items-center space-x-2">
                  <Badge
                    variant="secondary"
                    className={cn(
                      "text-xs",
                      parseFloat(currentCrypto.priceChange24h) >= 0
                        ? "bg-profit-green/20 text-profit-green"
                        : "bg-loss-red/20 text-loss-red"
                    )}
                  >
                    {parseFloat(currentCrypto.priceChange24h) >= 0 ? (
                      <ArrowUpIcon className="w-3 h-3 mr-1" />
                    ) : (
                      <ArrowDownIcon className="w-3 h-3 mr-1" />
                    )}
                    {Math.abs(parseFloat(currentCrypto.priceChange24h)).toFixed(2)}%
                  </Badge>
                  <span className="text-sm text-gray-400">24h</span>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="flex items-center space-x-2 lg:space-x-4">
          <Button variant="outline" size="sm" className="border-dark-border flex-1 sm:flex-none">
            <BarChart3 className="h-4 w-4 mr-2" />
            <span className="hidden sm:inline">Advanced</span>
          </Button>
          <Button variant="outline" size="sm" className="border-dark-border flex-1 sm:flex-none">
            <Activity className="h-4 w-4 mr-2" />
            <span className="hidden sm:inline">Indicators</span>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 lg:gap-6">
        {/* Chart Section */}
        <div className="lg:col-span-3 space-y-4 lg:space-y-6">
          {/* Price Chart */}
          <Card className="bg-dark-surface border-dark-border">
            <CardHeader className="p-3 lg:p-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
                <CardTitle className="flex items-center space-x-2 text-lg lg:text-xl">
                  <TrendingUp className="h-4 lg:h-5 w-4 lg:w-5" />
                  <span>{selectedPair} Chart</span>
                </CardTitle>
                <div className="flex space-x-1 lg:space-x-2 overflow-x-auto pb-2 sm:pb-0">
                  {["1m", "5m", "15m", "1h", "4h", "1d"].map((timeframe) => (
                    <Button
                      key={timeframe}
                      variant={timeframe === "15m" ? "default" : "ghost"}
                      size="sm"
                      className={cn(
                        "text-xs lg:text-sm px-2 lg:px-3 whitespace-nowrap",
                        timeframe === "15m" ? "bg-crypto-blue" : ""
                      )}
                    >
                      {timeframe}
                    </Button>
                  ))}
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-3 lg:p-6 pt-0">
              <div className="h-64 lg:h-96">
                <canvas
                  ref={chartRef}
                  className="w-full h-full"
                  style={{ width: '100%', height: '100%' }}
                />
              </div>
            </CardContent>
          </Card>

          {/* Market Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4">
            <Card className="bg-dark-surface border-dark-border">
              <CardContent className="p-3 lg:p-4">
                <p className="text-xs lg:text-sm text-gray-400">24h Volume</p>
                <p className="text-sm lg:text-lg font-semibold">{marketStats['24hVolume']}</p>
              </CardContent>
            </Card>
            <Card className="bg-dark-surface border-dark-border">
              <CardContent className="p-3 lg:p-4">
                <p className="text-xs lg:text-sm text-gray-400">24h High</p>
                <p className="text-sm lg:text-lg font-semibold">{marketStats['24hHigh']}</p>
              </CardContent>
            </Card>
            <Card className="bg-dark-surface border-dark-border">
              <CardContent className="p-3 lg:p-4">
                <p className="text-xs lg:text-sm text-gray-400">24h Low</p>
                <p className="text-sm lg:text-lg font-semibold">{marketStats['24hLow']}</p>
              </CardContent>
            </Card>
            <Card className="bg-dark-surface border-dark-border">
              <CardContent className="p-3 lg:p-4">
                <p className="text-xs lg:text-sm text-gray-400">Market Cap</p>
                <p className="text-sm lg:text-lg font-semibold">{marketStats.marketCap}</p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Trading Panel */}
        <div className="space-y-4 lg:space-y-6">
          {/* Buy/Sell Orders */}
          <Card className="bg-dark-surface border-dark-border">
            <CardHeader className="p-3 lg:p-6">
              <CardTitle className="text-lg lg:text-xl">Trade {selectedPair.split('/')[0]}</CardTitle>
            </CardHeader>
            <CardContent className="p-3 lg:p-6 pt-0">
              <Tabs defaultValue="buy" className="w-full">
                <TabsList className="grid w-full grid-cols-2 bg-dark-bg h-10 lg:h-11">
                  <TabsTrigger value="buy" className="text-sm lg:text-base">Buy</TabsTrigger>
                  <TabsTrigger value="sell" className="text-sm lg:text-base">Sell</TabsTrigger>
                </TabsList>
                
                <div className="mt-4 space-y-4">
                  <div className="flex space-x-2">
                    <Button
                      variant={orderType === "market" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setOrderType("market")}
                      className="flex-1 text-xs lg:text-sm"
                    >
                      Market
                    </Button>
                    <Button
                      variant={orderType === "limit" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setOrderType("limit")}
                      className="flex-1 text-xs lg:text-sm"
                    >
                      Limit
                    </Button>
                  </div>

                  <TabsContent value="buy" className="space-y-4 mt-4">
                    {orderType === "limit" && (
                      <div>
                        <label className="text-xs lg:text-sm text-gray-400 block mb-2">Buy Price (USD)</label>
                        <Input
                          type="number"
                          placeholder="0.00"
                          value={buyPrice}
                          onChange={(e) => setBuyPrice(e.target.value)}
                          className="bg-dark-bg border-dark-border h-10 lg:h-11"
                        />
                      </div>
                    )}
                    <div>
                      <label className="text-xs lg:text-sm text-gray-400 block mb-2">Amount (USD)</label>
                      <Input
                        type="number"
                        placeholder="0.00"
                        value={buyAmount}
                        onChange={(e) => setBuyAmount(e.target.value)}
                        className="bg-dark-bg border-dark-border h-10 lg:h-11"
                      />
                    </div>
                    <Button className="w-full bg-profit-green hover:bg-profit-green/80 h-10 lg:h-11 text-sm lg:text-base">
                      Buy {selectedPair.split('/')[0]}
                    </Button>
                  </TabsContent>

                  <TabsContent value="sell" className="space-y-4 mt-4">
                    {orderType === "limit" && (
                      <div>
                        <label className="text-xs lg:text-sm text-gray-400 block mb-2">Sell Price (USD)</label>
                        <Input
                          type="number"
                          placeholder="0.00"
                          value={sellPrice}
                          onChange={(e) => setSellPrice(e.target.value)}
                          className="bg-dark-bg border-dark-border h-10 lg:h-11"
                        />
                      </div>
                    )}
                    <div>
                      <label className="text-xs lg:text-sm text-gray-400 block mb-2">Amount ({selectedPair.split('/')[0]})</label>
                      <Input
                        type="number"
                        placeholder="0.00000000"
                        value={sellAmount}
                        onChange={(e) => setSellAmount(e.target.value)}
                        className="bg-dark-bg border-dark-border h-10 lg:h-11"
                      />
                    </div>
                    <Button className="w-full bg-loss-red hover:bg-loss-red/80 h-10 lg:h-11 text-sm lg:text-base">
                      Sell {selectedPair.split('/')[0]}
                    </Button>
                  </TabsContent>
                </div>
              </Tabs>
            </CardContent>
          </Card>

          {/* Order Book */}
          <Card className="bg-dark-surface border-dark-border">
            <CardHeader className="p-3 lg:p-6">
              <CardTitle className="text-sm lg:text-base font-medium">Order Book</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="space-y-2">
                {/* Asks (Sell Orders) */}
                <div className="px-3 lg:px-4">
                  <div className="text-xs text-gray-400 grid grid-cols-3 gap-1 lg:gap-2 mb-2">
                    <span>Price</span>
                    <span className="text-right">Amount</span>
                    <span className="text-right">Total</span>
                  </div>
                  {orderBook.asks.slice(0, 5).reverse().map((ask, index) => (
                    <div key={index} className="text-xs grid grid-cols-3 gap-1 lg:gap-2 py-1">
                      <span className="text-loss-red">{ask.price.toFixed(2)}</span>
                      <span className="text-right">{ask.amount.toFixed(6)}</span>
                      <span className="text-right">{ask.total.toFixed(2)}</span>
                    </div>
                  ))}
                </div>

                {/* Current Price */}
                <div className="px-3 lg:px-4 py-2 bg-dark-bg">
                  <div className="text-center">
                    <span className="text-base lg:text-lg font-semibold">
                      {currentCrypto ? `$${parseFloat(currentCrypto.currentPrice).toFixed(2)}` : '$42,156.78'}
                    </span>
                  </div>
                </div>

                {/* Bids (Buy Orders) */}
                <div className="px-3 lg:px-4">
                  {orderBook.bids.slice(0, 5).map((bid, index) => (
                    <div key={index} className="text-xs grid grid-cols-3 gap-1 lg:gap-2 py-1">
                      <span className="text-profit-green">{bid.price.toFixed(2)}</span>
                      <span className="text-right">{bid.amount.toFixed(6)}</span>
                      <span className="text-right">{bid.total.toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Recent Trades */}
      <Card className="bg-dark-surface border-dark-border">
        <CardHeader className="p-3 lg:p-6">
          <CardTitle className="flex items-center space-x-2 text-lg lg:text-xl">
            <Clock className="h-4 lg:h-5 w-4 lg:w-5" />
            <span>Recent Trades</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0 lg:p-6">
          {/* Desktop Table View */}
          <div className="hidden lg:block">
            <Table>
              <TableHeader>
                <TableRow className="border-dark-border">
                  <TableHead>Time</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Side</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentTrades.slice(0, 10).map((trade, index) => (
                  <TableRow key={index} className="border-dark-border">
                    <TableCell className="text-gray-400">
                      {new Date(trade.time).toLocaleTimeString()}
                    </TableCell>
                    <TableCell className={trade.side === 'buy' ? 'text-profit-green' : 'text-loss-red'}>
                      ${trade.price.toFixed(2)}
                    </TableCell>
                    <TableCell>{trade.amount.toFixed(6)}</TableCell>
                    <TableCell>${trade.total.toFixed(2)}</TableCell>
                    <TableCell>
                      <Badge
                        variant="secondary"
                        className={trade.side === 'buy' ? 'bg-profit-green/20 text-profit-green' : 'bg-loss-red/20 text-loss-red'}
                      >
                        {trade.side}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Mobile Card View */}
          <div className="lg:hidden divide-y divide-dark-border">
            {recentTrades.slice(0, 10).map((trade, index) => (
              <div key={index} className="p-3 hover:bg-dark-bg/50 transition-colors">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <Badge
                      variant="secondary"
                      className={cn(
                        "text-xs font-medium",
                        trade.side === 'buy' ? 'bg-profit-green/20 text-profit-green' : 'bg-loss-red/20 text-loss-red'
                      )}
                    >
                      {trade.side.toUpperCase()}
                    </Badge>
                    <span className="text-xs text-gray-400">
                      {new Date(trade.time).toLocaleTimeString()}
                    </span>
                  </div>
                  <div className={cn(
                    "font-semibold text-sm",
                    trade.side === 'buy' ? 'text-profit-green' : 'text-loss-red'
                  )}>
                    ${trade.price.toFixed(2)}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 text-xs">
                  <div>
                    <p className="text-gray-400">Amount</p>
                    <p className="font-medium">{trade.amount.toFixed(6)} {selectedPair.split('/')[0]}</p>
                  </div>
                  <div>
                    <p className="text-gray-400">Total</p>
                    <p className="font-medium">${trade.total.toFixed(2)}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
