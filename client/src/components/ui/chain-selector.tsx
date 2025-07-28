import { useState } from "react";
import { ChevronDown, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

interface Chain {
  id: string;
  name: string;
  symbol: string;
  color: string;
  icon: string;
  rpcUrl: string;
  explorer: string;
  nativeCurrency: {
    name: string;
    symbol: string;
    decimals: number;
  };
}

const availableChains: Chain[] = [
  {
    id: "ethereum",
    name: "Ethereum",
    symbol: "ETH",
    color: "from-blue-400 to-blue-600",
    icon: "Ξ",
    rpcUrl: "https://mainnet.infura.io/v3/",
    explorer: "https://etherscan.io",
    nativeCurrency: {
      name: "Ether",
      symbol: "ETH",
      decimals: 18,
    },
  },
  {
    id: "bitcoin",
    name: "Bitcoin",
    symbol: "BTC",
    color: "from-orange-400 to-orange-600",
    icon: "₿",
    rpcUrl: "https://bitcoin.mainnet.com",
    explorer: "https://blockstream.info",
    nativeCurrency: {
      name: "Bitcoin",
      symbol: "BTC",
      decimals: 8,
    },
  },
  {
    id: "solana",
    name: "Solana",
    symbol: "SOL",
    color: "from-purple-400 to-purple-600",
    icon: "◎",
    rpcUrl: "https://api.mainnet-beta.solana.com",
    explorer: "https://solscan.io",
    nativeCurrency: {
      name: "Solana",
      symbol: "SOL",
      decimals: 9,
    },
  },
  {
    id: "polygon",
    name: "Polygon",
    symbol: "MATIC",
    color: "from-purple-500 to-indigo-500",
    icon: "⬟",
    rpcUrl: "https://polygon-rpc.com/",
    explorer: "https://polygonscan.com",
    nativeCurrency: {
      name: "MATIC",
      symbol: "MATIC",
      decimals: 18,
    },
  },
  {
    id: "binance",
    name: "Binance Smart Chain",
    symbol: "BNB",
    color: "from-yellow-400 to-yellow-600",
    icon: "⬢",
    rpcUrl: "https://bsc-dataseed1.binance.org/",
    explorer: "https://bscscan.com",
    nativeCurrency: {
      name: "BNB",
      symbol: "BNB",
      decimals: 18,
    },
  },
  {
    id: "avalanche",
    name: "Avalanche",
    symbol: "AVAX",
    color: "from-red-400 to-red-600",
    icon: "❄",
    rpcUrl: "https://api.avax.network/ext/bc/C/rpc",
    explorer: "https://snowtrace.io",
    nativeCurrency: {
      name: "AVAX",
      symbol: "AVAX",
      decimals: 18,
    },
  },
  {
    id: "arbitrum",
    name: "Arbitrum One",
    symbol: "ARB",
    color: "from-blue-500 to-cyan-500",
    icon: "◆",
    rpcUrl: "https://arb1.arbitrum.io/rpc",
    explorer: "https://arbiscan.io",
    nativeCurrency: {
      name: "Ether",
      symbol: "ETH",
      decimals: 18,
    },
  },
  {
    id: "optimism",
    name: "Optimism",
    symbol: "OP",
    color: "from-red-500 to-pink-500",
    icon: "◉",
    rpcUrl: "https://mainnet.optimism.io",
    explorer: "https://optimistic.etherscan.io",
    nativeCurrency: {
      name: "Ether",
      symbol: "ETH",
      decimals: 18,
    },
  },
];

interface ChainSelectorProps {
  className?: string;
}

export default function ChainSelector({ className }: ChainSelectorProps) {
  const [selectedChain, setSelectedChain] = useState<Chain>(availableChains[0]);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className={cn(
            "flex items-center space-x-2 px-3 lg:px-4 py-2 bg-dark-bg border border-dark-border rounded-xl hover:bg-dark-surface",
            className
          )}
        >
          <div className={cn("w-4 lg:w-6 h-4 lg:h-6 bg-gradient-to-r rounded-full flex items-center justify-center text-white text-xs lg:text-sm font-bold", selectedChain.color)}>
            {selectedChain.icon}
          </div>
          <span className="font-medium text-sm lg:text-base">{selectedChain.name}</span>
          <ChevronDown className="text-gray-400 w-3 lg:w-4 h-3 lg:h-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-64 bg-dark-surface border border-dark-border">
        <div className="p-2">
          <div className="text-xs text-gray-400 mb-2 px-2">Select Network</div>
          {availableChains.map((chain) => (
            <DropdownMenuItem
              key={chain.id}
              className={cn(
                "flex items-center space-x-3 px-2 py-3 rounded-lg cursor-pointer hover:bg-dark-border",
                selectedChain.id === chain.id && "bg-crypto-blue/20 border border-crypto-blue/30"
              )}
              onClick={() => setSelectedChain(chain)}
            >
              <div className={cn("w-8 h-8 bg-gradient-to-r rounded-full flex items-center justify-center text-white text-sm font-bold", chain.color)}>
                {chain.icon}
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-sm">{chain.name}</span>
                  {selectedChain.id === chain.id && (
                    <Check className="w-4 h-4 text-crypto-blue" />
                  )}
                </div>
                <div className="text-xs text-gray-400">{chain.symbol}</div>
              </div>
            </DropdownMenuItem>
          ))}
        </div>
        <div className="border-t border-dark-border p-2">
          <div className="text-xs text-gray-400 px-2">
            Connected to {selectedChain.name} • {selectedChain.explorer.replace('https://', '')}
          </div>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}