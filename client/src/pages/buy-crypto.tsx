import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { CreditCard, DollarSign, TrendingUp, ArrowUpIcon, ArrowDownIcon, Shield, Zap, CheckCircle, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import type { Cryptocurrency } from "@shared/schema";
import { cn } from "@/lib/utils";

export default function BuyCrypto() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedCrypto, setSelectedCrypto] = useState<string>("");
  const [amount, setAmount] = useState<string>("");
  const [cryptoQuantity, setCryptoQuantity] = useState<string>("");
  const [paymentMethod, setPaymentMethod] = useState<string>("card");
  const [buyMethod, setBuyMethod] = useState<string>("amount");
  const [isProcessing, setIsProcessing] = useState(false);

  const { data: cryptocurrencies } = useQuery<Cryptocurrency[]>({
    queryKey: ['/api/cryptocurrencies'],
  });

  const createPaymentMutation = useMutation({
    mutationFn: async (paymentData: { amount: number, cryptoSymbol: string, paymentMethod: string }) => {
      // This will be implemented when Stripe keys are available
      const response = await apiRequest('POST', '/api/create-payment-intent', paymentData);
      return response.json();
    },
    onSuccess: (data) => {
      // Redirect to Stripe checkout or handle payment
      toast({
        title: "Payment Processing",
        description: "Redirecting to secure payment...",
      });
      // This will handle the actual Stripe payment flow
    },
    onError: () => {
      toast({
        title: "Payment Error",
        description: "Unable to process payment. Please try again.",
        variant: "destructive",
      });
      setIsProcessing(false);
    }
  });

  const handleBuy = () => {
    if (!selectedCrypto || (!amount && !cryptoQuantity)) {
      toast({
        title: "Invalid Input",
        description: "Please select a cryptocurrency and enter an amount",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);
    
    const finalAmount = buyMethod === "amount" 
      ? parseFloat(amount) 
      : parseFloat(cryptoQuantity) * getCurrentPrice();

    // For now, show a placeholder until Stripe is integrated
    toast({
      title: "Payment Setup Required",
      description: "Stripe integration will be available when API keys are configured",
      variant: "default",
    });
    
    setTimeout(() => setIsProcessing(false), 2000);
  };

  const getCurrentPrice = () => {
    if (!selectedCrypto || !cryptocurrencies) return 0;
    const crypto = cryptocurrencies.find(c => c.symbol === selectedCrypto);
    return crypto ? parseFloat(crypto.currentPrice) : 0;
  };

  const getCryptoAmount = () => {
    if (!selectedCrypto || !amount || !cryptocurrencies) return "0";
    return (parseFloat(amount) / getCurrentPrice()).toFixed(6);
  };

  const getUSDAmount = () => {
    if (!selectedCrypto || !cryptoQuantity || !cryptocurrencies) return "0";
    return (parseFloat(cryptoQuantity) * getCurrentPrice()).toFixed(2);
  };

  const calculateFees = (baseAmount: number) => {
    const processingFee = baseAmount * 0.025; // 2.5% processing fee
    const networkFee = paymentMethod === "card" ? 0.30 : 1.00; // Card: $0.30, Bank: $1.00
    return { processingFee, networkFee, total: processingFee + networkFee };
  };

  const getFinalAmount = () => {
    const baseAmount = buyMethod === "amount" 
      ? parseFloat(amount) || 0
      : parseFloat(getUSDAmount()) || 0;
    return baseAmount;
  };

  const getTotalCost = () => {
    const baseAmount = getFinalAmount();
    const fees = calculateFees(baseAmount);
    return baseAmount + fees.total;
  };

  return (
    <div className="p-3 lg:p-6 max-w-6xl mx-auto">
      <div className="space-y-4 lg:space-y-6">
        {/* Header */}
        <div className="text-center lg:text-left">
          <h1 className="text-2xl lg:text-3xl font-bold mb-2">Buy Cryptocurrency</h1>
          <p className="text-gray-400">Purchase crypto instantly with your credit card or bank transfer</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6">
          {/* Buy Form */}
          <div className="lg:col-span-2">
            <Card className="bg-dark-surface border-dark-border">
              <CardHeader className="p-4 lg:p-6">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-xl lg:text-2xl font-bold">Purchase Details</CardTitle>
                  <Badge variant="secondary" className="bg-crypto-blue/20 text-crypto-blue">
                    Instant
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-6 p-4 lg:p-6 pt-0">
                <Tabs value={buyMethod} onValueChange={setBuyMethod} className="w-full">
                  <TabsList className="grid w-full grid-cols-2 bg-dark-bg h-11 lg:h-12">
                    <TabsTrigger value="amount" className="text-sm lg:text-base">Buy by Amount</TabsTrigger>
                    <TabsTrigger value="quantity" className="text-sm lg:text-base">Buy by Quantity</TabsTrigger>
                  </TabsList>
                
                  <TabsContent value="amount" className="space-y-6 mt-6">
                    <div className="space-y-3">
                      <Label className="text-sm font-medium">I want to spend</Label>
                      <div className="flex space-x-3">
                        <div className="flex-1">
                          <Input
                            type="number"
                            placeholder="0.00"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            className="bg-dark-bg border-dark-border text-lg lg:text-xl h-12 lg:h-14"
                          />
                        </div>
                        <div className="w-16 lg:w-20 bg-dark-bg border border-dark-border rounded-lg flex items-center justify-center text-sm lg:text-lg font-semibold">
                          USD
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        {["$50", "$100", "$250", "$500"].map((preset) => (
                          <Button
                            key={preset}
                            variant="outline"
                            size="sm"
                            onClick={() => setAmount(preset.replace("$", ""))}
                            className="border-dark-border text-xs lg:text-sm flex-1"
                          >
                            {preset}
                          </Button>
                        ))}
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <Label className="text-sm font-medium">To buy</Label>
                      <div className="flex space-x-3">
                        <div className="flex-1">
                          <Input
                            type="text"
                            placeholder="0.000000"
                            value={getCryptoAmount()}
                            readOnly
                            className="bg-dark-bg/50 border-dark-border text-lg lg:text-xl h-12 lg:h-14"
                          />
                        </div>
                        <Select value={selectedCrypto} onValueChange={setSelectedCrypto}>
                          <SelectTrigger className="w-24 lg:w-32 bg-dark-bg border-dark-border h-12 lg:h-14">
                            <SelectValue placeholder="Select" />
                          </SelectTrigger>
                          <SelectContent>
                            {cryptocurrencies?.map((crypto) => (
                              <SelectItem key={crypto.symbol} value={crypto.symbol}>
                                <div className="flex items-center space-x-2">
                                  <span className="font-mono text-lg">{crypto.icon}</span>
                                  <span>{crypto.symbol}</span>
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="quantity" className="space-y-6 mt-6">
                    <div className="space-y-3">
                      <Label className="text-sm font-medium">I want to buy</Label>
                      <div className="flex space-x-3">
                        <div className="flex-1">
                          <Input
                            type="number"
                            placeholder="0.000000"
                            value={cryptoQuantity}
                            onChange={(e) => setCryptoQuantity(e.target.value)}
                            className="bg-dark-bg border-dark-border text-lg lg:text-xl h-12 lg:h-14"
                          />
                        </div>
                        <Select value={selectedCrypto} onValueChange={setSelectedCrypto}>
                          <SelectTrigger className="w-24 lg:w-32 bg-dark-bg border-dark-border h-12 lg:h-14">
                            <SelectValue placeholder="Select" />
                          </SelectTrigger>
                          <SelectContent>
                            {cryptocurrencies?.map((crypto) => (
                              <SelectItem key={crypto.symbol} value={crypto.symbol}>
                                <div className="flex items-center space-x-2">
                                  <span className="font-mono text-lg">{crypto.icon}</span>
                                  <span>{crypto.symbol}</span>
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <Label className="text-sm font-medium">Total cost</Label>
                      <div className="flex space-x-3">
                        <div className="flex-1">
                          <Input
                            type="text"
                            placeholder="0.00"
                            value={getUSDAmount()}
                            readOnly
                            className="bg-dark-bg/50 border-dark-border text-lg lg:text-xl h-12 lg:h-14"
                          />
                        </div>
                        <div className="w-16 lg:w-20 bg-dark-bg border border-dark-border rounded-lg flex items-center justify-center text-sm lg:text-lg font-semibold">
                          USD
                        </div>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>

                {/* Payment Method */}
                <div className="space-y-3">
                  <Label className="text-sm font-medium">Payment Method</Label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <Button
                      variant={paymentMethod === "card" ? "default" : "outline"}
                      onClick={() => setPaymentMethod("card")}
                      className="h-12 lg:h-14 justify-start text-sm lg:text-base"
                    >
                      <CreditCard className="h-4 w-4 mr-3" />
                      <div className="text-left">
                        <div>Credit/Debit Card</div>
                        <div className="text-xs text-gray-400">Instant • $0.30 fee</div>
                      </div>
                    </Button>
                    <Button
                      variant={paymentMethod === "bank" ? "default" : "outline"}
                      onClick={() => setPaymentMethod("bank")}
                      className="h-12 lg:h-14 justify-start text-sm lg:text-base"
                    >
                      <DollarSign className="h-4 w-4 mr-3" />
                      <div className="text-left">
                        <div>Bank Transfer</div>
                        <div className="text-xs text-gray-400">1-2 days • $1.00 fee</div>
                      </div>
                    </Button>
                  </div>
                </div>

                {/* Transaction Details */}
                {selectedCrypto && (amount || cryptoQuantity) && (
                  <Card className="bg-dark-bg border-dark-border">
                    <CardContent className="p-4 space-y-3">
                      <div className="flex items-center space-x-2 mb-3">
                        <CheckCircle className="h-4 w-4 text-crypto-green" />
                        <span className="text-sm font-medium">Order Summary</span>
                      </div>
                      
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-400">Crypto Amount</span>
                          <span>{buyMethod === "amount" ? getCryptoAmount() : cryptoQuantity} {selectedCrypto}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Subtotal</span>
                          <span>${getFinalAmount().toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Processing Fee (2.5%)</span>
                          <span>${calculateFees(getFinalAmount()).processingFee.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Network Fee</span>
                          <span>${calculateFees(getFinalAmount()).networkFee.toFixed(2)}</span>
                        </div>
                        <Separator className="bg-dark-border" />
                        <div className="flex justify-between font-semibold">
                          <span>Total</span>
                          <span>${getTotalCost().toFixed(2)}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}

                <Button
                  onClick={handleBuy}
                  disabled={!selectedCrypto || (!amount && !cryptoQuantity) || isProcessing}
                  className="w-full h-12 lg:h-14 bg-gradient-to-r from-crypto-blue to-crypto-green font-semibold text-sm lg:text-lg"
                >
                  {isProcessing ? (
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Processing...</span>
                    </div>
                  ) : (
                    `Buy ${selectedCrypto || "Crypto"} • $${getTotalCost().toFixed(2)}`
                  )}
                </Button>

                {/* Security Notice */}
                <div className="flex items-center space-x-2 text-xs text-gray-400 bg-dark-bg/50 p-3 rounded-lg">
                  <Shield className="h-4 w-4 text-crypto-blue flex-shrink-0" />
                  <span>
                    Payments are secured with 256-bit SSL encryption. Your crypto will be added to your wallet immediately after payment confirmation.
                  </span>
                </div>
            </CardContent>
          </Card>
        </div>

        {/* Market Overview & Features */}
        <div className="space-y-4 lg:space-y-6">
          <Card className="bg-dark-surface border-dark-border">
            <CardHeader className="p-4 lg:p-6">
              <CardTitle className="flex items-center space-x-2 text-lg lg:text-xl">
                <TrendingUp className="h-4 lg:h-5 w-4 lg:w-5" />
                <span>Top Cryptocurrencies</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 p-4 lg:p-6 pt-0">
              {cryptocurrencies?.map((crypto) => {
                const priceChange = parseFloat(crypto.priceChange24h);
                return (
                  <div
                    key={crypto.symbol}
                    className={cn(
                      "flex items-center justify-between p-3 rounded-lg hover:bg-dark-bg/50 cursor-pointer transition-colors",
                      selectedCrypto === crypto.symbol && "bg-crypto-blue/10 border border-crypto-blue/30"
                    )}
                    onClick={() => setSelectedCrypto(crypto.symbol)}
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 lg:w-10 lg:h-10 bg-gradient-to-r from-orange-400 to-orange-600 rounded-full flex items-center justify-center text-sm lg:text-base font-bold">
                        {crypto.icon}
                      </div>
                      <div>
                        <p className="font-medium text-sm lg:text-base">{crypto.symbol}</p>
                        <p className="text-xs text-gray-400">{crypto.name}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-sm lg:text-base">
                        ${parseFloat(crypto.currentPrice).toLocaleString()}
                      </p>
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
            <CardHeader className="p-4 lg:p-6">
              <CardTitle className="text-lg lg:text-xl">Why Buy Crypto with Woosa?</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 p-4 lg:p-6 pt-0">
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-crypto-blue rounded-full mt-2 flex-shrink-0"></div>
                <div>
                  <p className="font-medium text-sm lg:text-base">Instant Purchase</p>
                  <p className="text-xs lg:text-sm text-gray-400">Get your crypto immediately after payment</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-crypto-green rounded-full mt-2 flex-shrink-0"></div>
                <div>
                  <p className="font-medium text-sm lg:text-base">Low Fees</p>
                  <p className="text-xs lg:text-sm text-gray-400">Competitive rates starting at 2.5%</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-neon-green rounded-full mt-2 flex-shrink-0"></div>
                <div>
                  <p className="font-medium text-sm lg:text-base">Smart Automation</p>
                  <p className="text-xs lg:text-sm text-gray-400">Auto-investing features included</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-purple-400 rounded-full mt-2 flex-shrink-0"></div>
                <div>
                  <p className="font-medium text-sm lg:text-base">Secure & Insured</p>
                  <p className="text-xs lg:text-sm text-gray-400">Your funds are protected by industry-leading security</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        </div>
      </div>
    </div>
  );
}
