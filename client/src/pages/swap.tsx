import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowUpDown, Settings, Info } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import type { Cryptocurrency } from "@shared/schema";

export default function Swap() {
  const { toast } = useToast();
  const [fromCrypto, setFromCrypto] = useState<string>("");
  const [toCrypto, setToCrypto] = useState<string>("");
  const [amount, setAmount] = useState<string>("");
  const [slippage, setSlippage] = useState<string>("0.5");

  const { data: cryptocurrencies } = useQuery<Cryptocurrency[]>({
    queryKey: ['/api/cryptocurrencies'],
  });

  const swapMutation = useMutation({
    mutationFn: async ({ fromCryptoId, toCryptoId, amount }: { fromCryptoId: number; toCryptoId: number; amount: string }) => {
      const response = await apiRequest('POST', '/api/swap', {
        userId: 1,
        fromCryptoId,
        toCryptoId,
        amount,
      });
      return response.json();
    },
    onSuccess: (data) => {
      toast({
        title: "Swap Successful",
        description: `Swapped ${amount} ${fromCrypto} for ${data.toAmount} ${toCrypto}`,
      });
      setAmount("");
    },
    onError: () => {
      toast({
        title: "Swap Failed",
        description: "Unable to complete the swap. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleSwap = () => {
    if (!fromCrypto || !toCrypto || !amount) {
      toast({
        title: "Invalid Input",
        description: "Please select cryptocurrencies and enter an amount",
        variant: "destructive",
      });
      return;
    }

    const fromCryptoData = cryptocurrencies?.find(c => c.symbol === fromCrypto);
    const toCryptoData = cryptocurrencies?.find(c => c.symbol === toCrypto);

    if (!fromCryptoData || !toCryptoData) {
      toast({
        title: "Error",
        description: "Selected cryptocurrencies not found",
        variant: "destructive",
      });
      return;
    }

    swapMutation.mutate({
      fromCryptoId: fromCryptoData.id,
      toCryptoId: toCryptoData.id,
      amount,
    });
  };

  const handleFlipCurrencies = () => {
    const temp = fromCrypto;
    setFromCrypto(toCrypto);
    setToCrypto(temp);
  };

  const calculateEstimatedOutput = () => {
    if (!fromCrypto || !toCrypto || !amount || !cryptocurrencies) return "0";
    
    const fromCryptoData = cryptocurrencies.find(c => c.symbol === fromCrypto);
    const toCryptoData = cryptocurrencies.find(c => c.symbol === toCrypto);
    
    if (!fromCryptoData || !toCryptoData) return "0";
    
    const fromValue = parseFloat(amount) * parseFloat(fromCryptoData.currentPrice);
    const toAmount = fromValue / parseFloat(toCryptoData.currentPrice);
    const slippageAmount = toAmount * (parseFloat(slippage) / 100);
    
    return (toAmount - slippageAmount).toFixed(6);
  };

  return (
    <div className="py-4 lg:py-6 max-w-2xl mx-auto">
      <Card className="bg-dark-surface border-dark-border">
        <CardHeader className="p-4 lg:p-6">
          <CardTitle className="text-xl lg:text-2xl font-bold text-center">Swap Cryptocurrencies</CardTitle>
        </CardHeader>
        <CardContent className="p-4 lg:p-6 space-y-4 lg:space-y-6">
          {/* From Section */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-400">From</label>
            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
              <div className="flex-1">
                <Input
                  type="number"
                  placeholder="0.0"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="bg-dark-bg border-dark-border text-lg lg:text-xl h-12 lg:h-14"
                />
              </div>
              <Select value={fromCrypto} onValueChange={setFromCrypto}>
                <SelectTrigger className="w-full sm:w-32 bg-dark-bg border-dark-border h-12 lg:h-14">
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
            {fromCrypto && cryptocurrencies && (
              <div className="text-sm text-gray-400">
                Balance: 0 {fromCrypto} • $
                {(parseFloat(amount || "0") * parseFloat(cryptocurrencies.find(c => c.symbol === fromCrypto)?.currentPrice || "0")).toFixed(2)}
              </div>
            )}
          </div>

          {/* Swap Button */}
          <div className="flex justify-center">
            <Button
              variant="outline"
              size="icon"
              onClick={handleFlipCurrencies}
              className="rounded-full border-dark-border hover:bg-dark-border"
            >
              <ArrowUpDown className="h-4 w-4" />
            </Button>
          </div>

          {/* To Section */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-400">To</label>
            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
              <div className="flex-1">
                <Input
                  type="text"
                  placeholder="0.0"
                  value={calculateEstimatedOutput()}
                  readOnly
                  className="bg-dark-bg border-dark-border text-lg lg:text-xl h-12 lg:h-14 text-gray-300"
                />
              </div>
              <Select value={toCrypto} onValueChange={setToCrypto}>
                <SelectTrigger className="w-full sm:w-32 bg-dark-bg border-dark-border h-12 lg:h-14">
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
            {toCrypto && cryptocurrencies && (
              <div className="text-sm text-gray-400">
                Balance: 0 {toCrypto} • $
                {(parseFloat(calculateEstimatedOutput()) * parseFloat(cryptocurrencies.find(c => c.symbol === toCrypto)?.currentPrice || "0")).toFixed(2)}
              </div>
            )}
          </div>

          {/* Slippage Settings */}
          <Card className="bg-dark-bg border-dark-border">
            <CardContent className="p-3 lg:p-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-2">
                <div className="flex items-center space-x-2">
                  <Settings className="h-4 w-4" />
                  <span className="text-sm font-medium">Slippage Tolerance</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {["0.1", "0.5", "1.0"].map((value) => (
                    <Button
                      key={value}
                      variant={slippage === value ? "default" : "outline"}
                      size="sm"
                      onClick={() => setSlippage(value)}
                      className="h-8 px-3 text-xs"
                    >
                      {value}%
                    </Button>
                  ))}
                  <Input
                    type="number"
                    step="0.1"
                    value={slippage}
                    onChange={(e) => setSlippage(e.target.value)}
                    className="w-20 h-8 text-xs bg-dark-surface border-dark-border"
                  />
                </div>
              </div>
              <div className="flex items-center space-x-2 text-xs text-gray-400">
                <Info className="h-3 w-3" />
                <span>Your transaction will revert if the price changes unfavorably by more than this percentage.</span>
              </div>
            </CardContent>
          </Card>

          {/* Swap Details */}
          {fromCrypto && toCrypto && amount && cryptocurrencies && (
            <Card className="bg-dark-bg border-dark-border">
              <CardContent className="p-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Exchange Rate</span>
                  <span>
                    1 {fromCrypto} = {
                      (parseFloat(cryptocurrencies.find(c => c.symbol === fromCrypto)?.currentPrice || "0") /
                       parseFloat(cryptocurrencies.find(c => c.symbol === toCrypto)?.currentPrice || "1")).toFixed(6)
                    } {toCrypto}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Network Fee</span>
                  <span>≈ $2.50</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Price Impact</span>
                  <span className="text-green-400">{"<0.01%"}</span>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Swap Button */}
          <Button
            onClick={handleSwap}
            disabled={!fromCrypto || !toCrypto || !amount || swapMutation.isPending}
            className="w-full h-12 bg-gradient-to-r from-crypto-blue to-crypto-green font-semibold text-lg"
          >
            {swapMutation.isPending ? "Swapping..." : "Swap"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
