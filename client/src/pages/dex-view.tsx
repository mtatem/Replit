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
    <div className="p-6 space-y-6">
      {/* Trading Pair Selector & Stats */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Select value={selectedPair} onValueChange={setSelectedPair}>
            <SelectTrigger className="w-48 bg-dark-surface border-dark-border">
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
            <div className="flex items-center space-x-6">
              <div>
                <p className="text-2xl font-bold">${parseFloat(currentCrypto.currentPrice).toLocaleString()}</p>
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

        <div className="flex items-center space-x-4">
          <Button variant="outline" size="sm" className="border-dark-border">
            <BarChart3 className="h-4 w-4 mr-2" />
            Advanced
          </Button>
          <Button variant="outline" size="sm" className="border-dark-border">
            <Activity className="h-4 w-4 mr-2" />
            Indicators
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Chart Section */}
        <div className="lg:col-span-3 space-y-6">
          {/* Price Chart */}
          <Card className="bg-dark-surface border-dark-border">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center space-x-2">
                  <TrendingUp className="h-5 w-5" />
                  <span>{selectedPair} Chart</span>
                </CardTitle>
                <div className="flex space-x-2">
                  {["1m", "5m", "15m", "1h", "4h", "1d"].map((timeframe) => (
                    <Button
                      key={timeframe}
                      variant={timeframe === "15m" ? "default" : "ghost"}
                      size="sm"
                      className={timeframe === "15m" ? "bg-crypto-blue" : ""}
                    >
                      {timeframe}
                    </Button>
                  ))}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="h-96">
                <canvas
                  ref={chartRef}
                  className="w-full h-full"
                  style={{ width: '100%', height: '100%' }}
                />
              </div>
            </CardContent>
          </Card>

          {/* Market Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card className="bg-dark-surface border-dark-border">
              <CardContent className="p-4">
                <p className="text-sm text-gray-400">24h Volume</p>
                <p className="text-lg font-semibold">{marketStats['24hVolume']}</p>
              </CardContent>
            </Card>
            <Card className="bg-dark-surface border-dark-border">
              <CardContent className="p-4">
                <p className="text-sm text-gray-400">24h High</p>
                <p className="text-lg font-semibold">{marketStats['24hHigh']}</p>
              </CardContent>
            </Card>
            <Card className="bg-dark-surface border-dark-border">
              <CardContent className="p-4">
                <p className="text-sm text-gray-400">24h Low</p>
                <p className="text-lg font-semibold">{marketStats['24hLow']}</p>
              </CardContent>
            </Card>
            <Card className="bg-dark-surface border-dark-border">
              <CardContent className="p-4">
                <p className="text-sm text-gray-400">Market Cap</p>
                <p className="text-lg font-semibold">{marketStats.marketCap}</p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Trading Panel */}
        <div className="space-y-6">
          {/* Buy/Sell Orders */}
          <Card className="bg-dark-surface border-dark-border">
            <CardHeader>
              <CardTitle>Trade {selectedPair.split('/')[0]}</CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="buy" className="w-full">
                <TabsList className="grid w-full grid-cols-2 bg-dark-bg">
                  <TabsTrigger value="buy">Buy</TabsTrigger>
                  <TabsTrigger value="sell">Sell</TabsTrigger>
                </TabsList>
                
                <div className="mt-4 space-y-4">
                  <div className="flex space-x-2">
                    <Button
                      variant={orderType === "market" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setOrderType("market")}
                      className="flex-1"
                    >
                      Market
                    </Button>
                    <Button
                      variant={orderType === "limit" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setOrderType("limit")}
                      className="flex-1"
                    >
                      Limit
                    </Button>
                  </div>

                  <TabsContent value="buy" className="space-y-4 mt-4">
                    {orderType === "limit" && (
                      <div>
                        <label className="text-sm text-gray-400">Buy Price (USD)</label>
                        <Input
                          type="number"
                          placeholder="0.00"
                          value={buyPrice}
                          onChange={(e) => setBuyPrice(e.target.value)}
                          className="bg-dark-bg border-dark-border"
                        />
                      </div>
                    )}
                    <div>
                      <label className="text-sm text-gray-400">Amount (USD)</label>
                      <Input
                        type="number"
                        placeholder="0.00"
                        value={buyAmount}
                        onChange={(e) => setBuyAmount(e.target.value)}
                        className="bg-dark-bg border-dark-border"
                      />
                    </div>
                    <Button className="w-full bg-profit-green hover:bg-profit-green/80">
                      Buy {selectedPair.split('/')[0]}
                    </Button>
                  </TabsContent>

                  <TabsContent value="sell" className="space-y-4 mt-4">
                    {orderType === "limit" && (
                      <div>
                        <label className="text-sm text-gray-400">Sell Price (USD)</label>
                        <Input
                          type="number"
                          placeholder="0.00"
                          value={sellPrice}
                          onChange={(e) => setSellPrice(e.target.value)}
                          className="bg-dark-bg border-dark-border"
                        />
                      </div>
                    )}
                    <div>
                      <label className="text-sm text-gray-400">Amount ({selectedPair.split('/')[0]})</label>
                      <Input
                        type="number"
                        placeholder="0.00000000"
                        value={sellAmount}
                        onChange={(e) => setSellAmount(e.target.value)}
                        className="bg-dark-bg border-dark-border"
                      />
                    </div>
                    <Button className="w-full bg-loss-red hover:bg-loss-red/80">
                      Sell {selectedPair.split('/')[0]}
                    </Button>
                  </TabsContent>
                </div>
              </Tabs>
            </CardContent>
          </Card>

          {/* Order Book */}
          <Card className="bg-dark-surface border-dark-border">
            <CardHeader>
              <CardTitle className="text-sm font-medium">Order Book</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="space-y-2">
                {/* Asks (Sell Orders) */}
                <div className="px-4">
                  <div className="text-xs text-gray-400 grid grid-cols-3 gap-2 mb-2">
                    <span>Price</span>
                    <span className="text-right">Amount</span>
                    <span className="text-right">Total</span>
                  </div>
                  {orderBook.asks.slice(0, 5).reverse().map((ask, index) => (
                    <div key={index} className="text-xs grid grid-cols-3 gap-2 py-1">
                      <span className="text-loss-red">{ask.price.toFixed(2)}</span>
                      <span className="text-right">{ask.amount.toFixed(6)}</span>
                      <span className="text-right">{ask.total.toFixed(2)}</span>
                    </div>
                  ))}
                </div>

                {/* Current Price */}
                <div className="px-4 py-2 bg-dark-bg">
                  <div className="text-center">
                    <span className="text-lg font-semibold">
                      {currentCrypto ? `$${parseFloat(currentCrypto.currentPrice).toFixed(2)}` : '$42,156.78'}
                    </span>
                  </div>
                </div>

                {/* Bids (Buy Orders) */}
                <div className="px-4">
                  {orderBook.bids.slice(0, 5).map((bid, index) => (
                    <div key={index} className="text-xs grid grid-cols-3 gap-2 py-1">
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
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Clock className="h-5 w-5" />
            <span>Recent Trades</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
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
        </CardContent>
      </Card>
    </div>
  );
}
