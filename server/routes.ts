import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertTransactionSchema, insertAutomationRuleSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Portfolio endpoints
  app.get("/api/portfolio/:userId", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const holdings = await storage.getUserPortfolio(userId);
      const cryptos = await storage.getAllCryptocurrencies();
      
      const portfolioWithCrypto = holdings.map(holding => {
        const crypto = cryptos.find(c => c.id === holding.cryptoId);
        return { ...holding, crypto };
      });

      res.json(portfolioWithCrypto);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch portfolio" });
    }
  });

  app.get("/api/portfolio/:userId/summary", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const holdings = await storage.getUserPortfolio(userId);
      const cryptos = await storage.getAllCryptocurrencies();
      
      let totalValue = 0;
      let totalInvested = 0;
      
      holdings.forEach(holding => {
        const crypto = cryptos.find(c => c.id === holding.cryptoId);
        if (crypto) {
          const currentValue = parseFloat(holding.balance) * parseFloat(crypto.currentPrice);
          totalValue += currentValue;
          totalInvested += parseFloat(holding.totalInvested);
        }
      });

      const totalPnl = totalValue - totalInvested;
      const totalPnlPercent = totalInvested > 0 ? (totalPnl / totalInvested) * 100 : 0;

      res.json({
        totalValue,
        totalInvested,
        totalPnl,
        totalPnlPercent,
      });
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch portfolio summary" });
    }
  });

  // Cryptocurrency endpoints
  app.get("/api/cryptocurrencies", async (req, res) => {
    try {
      const cryptos = await storage.getAllCryptocurrencies();
      res.json(cryptos);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch cryptocurrencies" });
    }
  });

  app.get("/api/cryptocurrencies/:symbol", async (req, res) => {
    try {
      const symbol = req.params.symbol.toUpperCase();
      const crypto = await storage.getCryptocurrencyBySymbol(symbol);
      if (!crypto) {
        return res.status(404).json({ message: "Cryptocurrency not found" });
      }
      res.json(crypto);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch cryptocurrency" });
    }
  });

  // Automation rules endpoints
  app.get("/api/automation/:userId", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const rules = await storage.getUserAutomationRules(userId);
      res.json(rules);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch automation rules" });
    }
  });

  app.put("/api/automation/:ruleId", async (req, res) => {
    try {
      const ruleId = parseInt(req.params.ruleId);
      const updates = req.body;
      await storage.updateAutomationRule(ruleId, updates);
      res.json({ message: "Automation rule updated successfully" });
    } catch (error) {
      res.status(500).json({ message: "Failed to update automation rule" });
    }
  });

  // Automation execution history endpoints
  app.get("/api/automation/:userId/executions", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const transactions = await storage.getUserTransactions(userId);
      const cryptos = await storage.getAllCryptocurrencies();
      
      // Filter for automation-triggered transactions
      const automationTransactions = transactions
        .filter(tx => tx.automationTriggered === true)
        .map(tx => {
          const crypto = cryptos.find(c => c.id === tx.cryptoId);
          return { ...tx, crypto };
        })
        .sort((a, b) => new Date(b.createdAt!).getTime() - new Date(a.createdAt!).getTime());

      res.json(automationTransactions);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch automation executions" });
    }
  });

  // Automation control endpoints
  app.post("/api/automation/:userId/pause-all", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const rules = await storage.getUserAutomationRules(userId);
      
      for (const rule of rules) {
        await storage.updateAutomationRule(rule.id, { enabled: false });
      }
      
      res.json({ message: "All automation rules paused successfully" });
    } catch (error) {
      res.status(500).json({ message: "Failed to pause automation rules" });
    }
  });

  app.post("/api/automation/:userId/enable-all", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const rules = await storage.getUserAutomationRules(userId);
      
      for (const rule of rules) {
        await storage.updateAutomationRule(rule.id, { enabled: true });
      }
      
      res.json({ message: "All automation rules enabled successfully" });
    } catch (error) {
      res.status(500).json({ message: "Failed to enable automation rules" });
    }
  });

  app.post("/api/automation/:userId/reset-defaults", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const rules = await storage.getUserAutomationRules(userId);
      
      const defaults = {
        major: { profitTarget: "20.00", stopLoss: "10.00", sellPercentage: "25.00" },
        altcoin: { profitTarget: "30.00", stopLoss: "15.00", sellPercentage: "50.00" },
        meme: { profitTarget: "100.00", stopLoss: "25.00", sellPercentage: "75.00" }
      };
      
      for (const rule of rules) {
        const defaultValues = defaults[rule.cryptoType as keyof typeof defaults];
        if (defaultValues) {
          await storage.updateAutomationRule(rule.id, {
            ...defaultValues,
            enabled: true
          });
        }
      }
      
      res.json({ message: "All automation rules reset to defaults" });
    } catch (error) {
      res.status(500).json({ message: "Failed to reset automation rules" });
    }
  });

  // Transaction endpoints
  app.get("/api/transactions/:userId", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const transactions = await storage.getUserTransactions(userId);
      const cryptos = await storage.getAllCryptocurrencies();
      
      const transactionsWithCrypto = transactions.map(tx => {
        const crypto = cryptos.find(c => c.id === tx.cryptoId);
        const fromCrypto = tx.fromCrypto ? cryptos.find(c => c.id === tx.fromCrypto) : null;
        const toCrypto = tx.toCrypto ? cryptos.find(c => c.id === tx.toCrypto) : null;
        return { ...tx, crypto, fromCrypto, toCrypto };
      });

      res.json(transactionsWithCrypto);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch transactions" });
    }
  });

  app.post("/api/transactions", async (req, res) => {
    try {
      const transaction = insertTransactionSchema.parse(req.body);
      const newTransaction = await storage.createTransaction(transaction);
      res.json(newTransaction);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid transaction data", errors: error.errors });
      } else {
        res.status(500).json({ message: "Failed to create transaction" });
      }
    }
  });

  // Swap endpoint
  app.post("/api/swap", async (req, res) => {
    try {
      const { userId, fromCryptoId, toCryptoId, amount } = req.body;
      
      const fromCrypto = await storage.getCryptocurrency(fromCryptoId);
      const toCrypto = await storage.getCryptocurrency(toCryptoId);
      
      if (!fromCrypto || !toCrypto) {
        return res.status(404).json({ message: "Cryptocurrency not found" });
      }

      // Simulate swap calculation
      const fromValue = parseFloat(amount) * parseFloat(fromCrypto.currentPrice);
      const toAmount = fromValue / parseFloat(toCrypto.currentPrice);
      const fee = fromValue * 0.003; // 0.3% fee

      // Create swap transaction
      await storage.createTransaction({
        userId,
        cryptoId: fromCryptoId,
        type: "swap",
        amount: `-${amount}`,
        price: fromCrypto.currentPrice,
        totalValue: `-${fromValue}`,
        fromCrypto: fromCryptoId,
        toCrypto: toCryptoId,
        automationTriggered: false,
      });

      await storage.createTransaction({
        userId,
        cryptoId: toCryptoId,
        type: "swap",
        amount: toAmount.toString(),
        price: toCrypto.currentPrice,
        totalValue: (fromValue - fee).toString(),
        fromCrypto: fromCryptoId,
        toCrypto: toCryptoId,
        automationTriggered: false,
      });

      res.json({
        fromAmount: amount,
        toAmount: toAmount.toFixed(8),
        fee: fee.toFixed(2),
        rate: (parseFloat(fromCrypto.currentPrice) / parseFloat(toCrypto.currentPrice)).toFixed(8),
      });
    } catch (error) {
      res.status(500).json({ message: "Failed to execute swap" });
    }
  });

  // Mock staking APY data
  app.get("/api/staking/rates", async (req, res) => {
    try {
      const stakingRates = [
        { cryptoId: 2, symbol: "ETH", apy: "4.5", minimumStake: "0.1" },
        { cryptoId: 3, symbol: "SOL", apy: "6.8", minimumStake: "1" },
        { cryptoId: 1, symbol: "BTC", apy: "2.1", minimumStake: "0.001" },
      ];
      res.json(stakingRates);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch staking rates" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
