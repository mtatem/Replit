import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { CreditCard, DollarSign, TrendingUp, ArrowUpIcon, ArrowDownIcon } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import type { Cryptocurrency } from "@shared/schema";
import { cn } from "@/lib/utils";

export default function BuyCrypto() {
  const { toast } = useToast();
  const [selectedCrypto, setSelectedCrypto] = useState<string>("");
  const [amount, setAmount] = useState<string>("");
  const [paymentMethod, setPaymentMethod] = useState<string>("card");

  const { data: cryptocurrencies } = useQuery<Cryptocurrency[]>({
    queryKey: ['/api/cryptocurrencies'],
  });

  const handleBuy = () => {
    if (!selectedCrypto || !amount) {
      toast({
        title: "Invalid Input",
        description: "Please select a cryptocurrency and enter an amount",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Purchase Initiated",
      description: `Buying $${amount} worth of ${selectedCrypto}`,
    });
  };

  const getCryptoAmount = () => {
    if (!selectedCrypto || !amount || !cryptocurrencies) return "0";
    
    const crypto = cryptocurrencies.find(c => c.symbol === selectedCrypto);
    if (!crypto) return "0";
    
    return (parseFloat(amount) / parseFloat(crypto.currentPrice)).toFixed(6);
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Buy Form */}
        <div className="lg:col-span-2">
          <Card className="bg-dark-surface border-dark-border">
            <CardHeader>
              <CardTitle className="text-2xl font-bold">Buy Cryptocurrency</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <Tabs defaultValue="amount" className="w-full">
                <TabsList className="grid w-full grid-cols-2 bg-dark-bg">
                  <TabsTrigger value="amount">Buy by Amount</TabsTrigger>
                  <TabsTrigger value="quantity">Buy by Quantity</TabsTrigger>
                </TabsList>
                
                <TabsContent value="amount" className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">I want to spend</label>
                    <div className="flex space-x-2">
                      <div className="flex-1">
                        <Input
                          type="number"
                          placeholder="0.00"
                          value={amount}
                          onChange={(e) => setAmount(e.target.value)}
                          className="bg-dark-bg border-dark-border text-xl h-14"
                        />
                      </div>
                      <div className="w-20 bg-dark-bg border border-dark-border rounded-lg flex items-center justify-center text-lg font-semibold">
                        USD
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium">To buy</label>
                    <div className="flex space-x-2">
                      <div className="flex-1">
                        <Input
                          type="text"
                          placeholder="0.000000"
                          value={getCryptoAmount()}
                          readOnly
                          className="bg-dark-bg border-dark-border text-xl h-14"
                        />
                      </div>
                      <Select value={selectedCrypto} onValueChange={setSelectedCrypto}>
                        <SelectTrigger className="w-32 bg-dark-bg border-dark-border h-14">
                          <SelectValue placeholder="Select" />
                        </SelectTrigger>
                        <SelectContent>
                          {cryptocurrencies?.map((crypto) => (
                            <SelectItem key={crypto.symbol} value={crypto.symbol}>
                              <div className="flex items-center space-x-2">
                                <span className="font-mono">{crypto.icon}</span>
                                <span>{crypto.symbol}</span>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="quantity" className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">I want to buy</label>
                    <div className="flex space-x-2">
                      <div className="flex-1">
                        <Input
                          type="number"
                          placeholder="0.000000"
                          className="bg-dark-bg border-dark-border text-xl h-14"
                        />
                      </div>
                      <Select value={selectedCrypto} onValueChange={setSelectedCrypto}>
                        <SelectTrigger className="w-32 bg-dark-bg border-dark-border h-14">
                          <SelectValue placeholder="Select" />
                        </SelectTrigger>
                        <SelectContent>
                          {cryptocurrencies?.map((crypto) => (
                            <SelectItem key={crypto.symbol} value={crypto.symbol}>
                              <div className="flex items-center space-x-2">
                                <span className="font-mono">{crypto.icon}</span>
                                <span>{crypto.symbol}</span>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>

              {/* Payment Method */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Payment Method</label>
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    variant={paymentMethod === "card" ? "default" : "outline"}
                    onClick={() => setPaymentMethod("card")}
                    className="h-12 justify-start"
                  >
                    <CreditCard className="h-4 w-4 mr-2" />
                    Credit/Debit Card
                  </Button>
                  <Button
                    variant={paymentMethod === "bank" ? "default" : "outline"}
                    onClick={() => setPaymentMethod("bank")}
                    className="h-12 justify-start"
                  >
                    <DollarSign className="h-4 w-4 mr-2" />
                    Bank Transfer
                  </Button>
                </div>
              </div>

              {/* Transaction Details */}
              {selectedCrypto && amount && (
                <Card className="bg-dark-bg border-dark-border">
                  <CardContent className="p-4 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Subtotal</span>
                      <span>${amount}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Fee (2.5%)</span>
                      <span>${(parseFloat(amount) * 0.025).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm font-semibold border-t border-dark-border pt-2">
                      <span>Total</span>
                      <span>${(parseFloat(amount) * 1.025).toFixed(2)}</span>
                    </div>
                  </CardContent>
                </Card>
              )}

              <Button
                onClick={handleBuy}
                disabled={!selectedCrypto || !amount}
                className="w-full h-12 bg-gradient-to-r from-crypto-blue to-crypto-green font-semibold text-lg"
              >
                Buy {selectedCrypto || "Crypto"}
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Market Overview */}
        <div className="space-y-6">
          <Card className="bg-dark-surface border-dark-border">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <TrendingUp className="h-5 w-5" />
                <span>Top Cryptocurrencies</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {cryptocurrencies?.map((crypto) => {
                const priceChange = parseFloat(crypto.priceChange24h);
                return (
                  <div
                    key={crypto.symbol}
                    className="flex items-center justify-between p-3 rounded-lg hover:bg-dark-bg/50 cursor-pointer transition-colors"
                    onClick={() => setSelectedCrypto(crypto.symbol)}
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-gradient-to-r from-orange-400 to-orange-600 rounded-full flex items-center justify-center text-sm font-bold">
                        {crypto.icon}
                      </div>
                      <div>
                        <p className="font-medium">{crypto.symbol}</p>
                        <p className="text-xs text-gray-400">{crypto.name}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">${parseFloat(crypto.currentPrice).toLocaleString()}</p>
                      <Badge
                        variant="secondary"
                        className={cn(
                          "text-xs",
                          priceChange >= 0
                            ? "bg-profit-green/20 text-profit-green"
                            : "bg-loss-red/20 text-loss-red"
                        )}
                      >
                        {priceChange >= 0 ? (
                          <ArrowUpIcon className="w-3 h-3 mr-1" />
                        ) : (
                          <ArrowDownIcon className="w-3 h-3 mr-1" />
                        )}
                        {Math.abs(priceChange).toFixed(2)}%
                      </Badge>
                    </div>
                  </div>
                );
              })}
            </CardContent>
          </Card>

          <Card className="bg-dark-surface border-dark-border">
            <CardHeader>
              <CardTitle>Why Buy Crypto with Woosa?</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-crypto-blue rounded-full mt-2"></div>
                <div>
                  <p className="font-medium">Instant Purchase</p>
                  <p className="text-sm text-gray-400">Get your crypto immediately</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-crypto-green rounded-full mt-2"></div>
                <div>
                  <p className="font-medium">Low Fees</p>
                  <p className="text-sm text-gray-400">Competitive rates starting at 2.5%</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-neon-green rounded-full mt-2"></div>
                <div>
                  <p className="font-medium">Smart Automation</p>
                  <p className="text-sm text-gray-400">Auto-investing features included</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
