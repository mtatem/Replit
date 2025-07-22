import {
  users,
  cryptocurrencies,
  portfolioHoldings,
  automationRules,
  transactions,
  portfolioHistory,
  type User,
  type InsertUser,
  type Cryptocurrency,
  type InsertCryptocurrency,
  type PortfolioHolding,
  type InsertPortfolioHolding,
  type AutomationRule,
  type InsertAutomationRule,
  type Transaction,
  type InsertTransaction,
  type PortfolioHistory,
  type InsertPortfolioHistory,
} from "@shared/schema";

export interface IStorage {
  // Users
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Cryptocurrencies
  getAllCryptocurrencies(): Promise<Cryptocurrency[]>;
  getCryptocurrency(id: number): Promise<Cryptocurrency | undefined>;
  getCryptocurrencyBySymbol(symbol: string): Promise<Cryptocurrency | undefined>;
  createCryptocurrency(crypto: InsertCryptocurrency): Promise<Cryptocurrency>;
  updateCryptocurrencyPrice(id: number, price: string, priceChange24h: string): Promise<void>;

  // Portfolio Holdings
  getUserPortfolio(userId: number): Promise<PortfolioHolding[]>;
  getPortfolioHolding(userId: number, cryptoId: number): Promise<PortfolioHolding | undefined>;
  createPortfolioHolding(holding: InsertPortfolioHolding): Promise<PortfolioHolding>;
  updatePortfolioHolding(id: number, updates: Partial<PortfolioHolding>): Promise<void>;

  // Automation Rules
  getUserAutomationRules(userId: number): Promise<AutomationRule[]>;
  getAutomationRuleByType(userId: number, cryptoType: string): Promise<AutomationRule | undefined>;
  createAutomationRule(rule: InsertAutomationRule): Promise<AutomationRule>;
  updateAutomationRule(id: number, updates: Partial<AutomationRule>): Promise<void>;

  // Transactions
  getUserTransactions(userId: number): Promise<Transaction[]>;
  createTransaction(transaction: InsertTransaction): Promise<Transaction>;

  // Portfolio History
  getUserPortfolioHistory(userId: number): Promise<PortfolioHistory[]>;
  createPortfolioHistory(history: InsertPortfolioHistory): Promise<PortfolioHistory>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private cryptocurrencies: Map<number, Cryptocurrency>;
  private portfolioHoldings: Map<number, PortfolioHolding>;
  private automationRules: Map<number, AutomationRule>;
  private transactions: Map<number, Transaction>;
  private portfolioHistory: Map<number, PortfolioHistory>;
  private currentUserId: number;
  private currentCryptoId: number;
  private currentHoldingId: number;
  private currentRuleId: number;
  private currentTransactionId: number;
  private currentHistoryId: number;

  constructor() {
    this.users = new Map();
    this.cryptocurrencies = new Map();
    this.portfolioHoldings = new Map();
    this.automationRules = new Map();
    this.transactions = new Map();
    this.portfolioHistory = new Map();
    this.currentUserId = 1;
    this.currentCryptoId = 1;
    this.currentHoldingId = 1;
    this.currentRuleId = 1;
    this.currentTransactionId = 1;
    this.currentHistoryId = 1;

    this.initializeData();
  }

  private initializeData() {
    // Create default user
    const user: User = {
      id: this.currentUserId++,
      username: "alex",
      password: "password",
      name: "Alex Smith",
      status: "Premium Member",
    };
    this.users.set(user.id, user);

    // Initialize cryptocurrencies
    const cryptos: Cryptocurrency[] = [
      {
        id: this.currentCryptoId++,
        symbol: "BTC",
        name: "Bitcoin",
        type: "major",
        icon: "₿",
        blockchain: "Bitcoin",
        currentPrice: "42156.78",
        priceChange24h: "3.45",
        marketCap: "823000000000",
        volume24h: "28500000000",
      },
      {
        id: this.currentCryptoId++,
        symbol: "ETH",
        name: "Ethereum",
        type: "major",
        icon: "Ξ",
        blockchain: "Ethereum",
        currentPrice: "2843.67",
        priceChange24h: "-1.23",
        marketCap: "342000000000",
        volume24h: "15800000000",
      },
      {
        id: this.currentCryptoId++,
        symbol: "SOL",
        name: "Solana",
        type: "major",
        icon: "◎",
        blockchain: "Solana",
        currentPrice: "89.43",
        priceChange24h: "7.89",
        marketCap: "38500000000",
        volume24h: "2100000000",
      },
      {
        id: this.currentCryptoId++,
        symbol: "DOGE",
        name: "Dogecoin",
        type: "meme",
        icon: "🐕",
        blockchain: "Dogecoin",
        currentPrice: "0.0847",
        priceChange24h: "12.34",
        marketCap: "12100000000",
        volume24h: "890000000",
      },
    ];

    cryptos.forEach(crypto => this.cryptocurrencies.set(crypto.id, crypto));

    // Initialize portfolio holdings
    const holdings: PortfolioHolding[] = [
      {
        id: this.currentHoldingId++,
        userId: 1,
        cryptoId: 1, // BTC
        balance: "2.54891",
        averageBuyPrice: "35000.00",
        totalInvested: "89236.85",
        isStaked: false,
        stakedAmount: "0",
        stakingApy: "0",
      },
      {
        id: this.currentHoldingId++,
        userId: 1,
        cryptoId: 2, // ETH
        balance: "8.7532",
        averageBuyPrice: "2200.00",
        totalInvested: "19257.04",
        isStaked: true,
        stakedAmount: "2.5",
        stakingApy: "4.5",
      },
      {
        id: this.currentHoldingId++,
        userId: 1,
        cryptoId: 3, // SOL
        balance: "234.78",
        averageBuyPrice: "65.00",
        totalInvested: "15260.70",
        isStaked: true,
        stakedAmount: "50",
        stakingApy: "6.8",
      },
      {
        id: this.currentHoldingId++,
        userId: 1,
        cryptoId: 4, // DOGE
        balance: "15432.89",
        averageBuyPrice: "0.0642",
        totalInvested: "990.79",
        isStaked: false,
        stakedAmount: "0",
        stakingApy: "0",
      },
    ];

    holdings.forEach(holding => this.portfolioHoldings.set(holding.id, holding));

    // Initialize automation rules
    const rules: AutomationRule[] = [
      {
        id: this.currentRuleId++,
        userId: 1,
        cryptoType: "major",
        enabled: true,
        profitTarget: "200",
        stopLoss: "50",
        sellPercentage: "10",
      },
      {
        id: this.currentRuleId++,
        userId: 1,
        cryptoType: "altcoin",
        enabled: true,
        profitTarget: "100",
        stopLoss: "30",
        sellPercentage: "25",
      },
      {
        id: this.currentRuleId++,
        userId: 1,
        cryptoType: "meme",
        enabled: true,
        profitTarget: "50",
        stopLoss: "20",
        sellPercentage: "50",
      },
    ];

    rules.forEach(rule => this.automationRules.set(rule.id, rule));
  }

  // Users
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.username === username);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = { ...insertUser, id, status: "Premium Member" };
    this.users.set(id, user);
    return user;
  }

  // Cryptocurrencies
  async getAllCryptocurrencies(): Promise<Cryptocurrency[]> {
    return Array.from(this.cryptocurrencies.values());
  }

  async getCryptocurrency(id: number): Promise<Cryptocurrency | undefined> {
    return this.cryptocurrencies.get(id);
  }

  async getCryptocurrencyBySymbol(symbol: string): Promise<Cryptocurrency | undefined> {
    return Array.from(this.cryptocurrencies.values()).find(crypto => crypto.symbol === symbol);
  }

  async createCryptocurrency(crypto: InsertCryptocurrency): Promise<Cryptocurrency> {
    const id = this.currentCryptoId++;
    const newCrypto: Cryptocurrency = { 
      ...crypto, 
      id,
      marketCap: crypto.marketCap || null,
      volume24h: crypto.volume24h || null
    };
    this.cryptocurrencies.set(id, newCrypto);
    return newCrypto;
  }

  async updateCryptocurrencyPrice(id: number, price: string, priceChange24h: string): Promise<void> {
    const crypto = this.cryptocurrencies.get(id);
    if (crypto) {
      crypto.currentPrice = price;
      crypto.priceChange24h = priceChange24h;
      this.cryptocurrencies.set(id, crypto);
    }
  }

  // Portfolio Holdings
  async getUserPortfolio(userId: number): Promise<PortfolioHolding[]> {
    return Array.from(this.portfolioHoldings.values()).filter(holding => holding.userId === userId);
  }

  async getPortfolioHolding(userId: number, cryptoId: number): Promise<PortfolioHolding | undefined> {
    return Array.from(this.portfolioHoldings.values()).find(
      holding => holding.userId === userId && holding.cryptoId === cryptoId
    );
  }

  async createPortfolioHolding(holding: InsertPortfolioHolding): Promise<PortfolioHolding> {
    const id = this.currentHoldingId++;
    const newHolding: PortfolioHolding = { 
      ...holding, 
      id,
      isStaked: holding.isStaked || false,
      stakedAmount: holding.stakedAmount || "0",
      stakingApy: holding.stakingApy || "0"
    };
    this.portfolioHoldings.set(id, newHolding);
    return newHolding;
  }

  async updatePortfolioHolding(id: number, updates: Partial<PortfolioHolding>): Promise<void> {
    const holding = this.portfolioHoldings.get(id);
    if (holding) {
      Object.assign(holding, updates);
      this.portfolioHoldings.set(id, holding);
    }
  }

  // Automation Rules
  async getUserAutomationRules(userId: number): Promise<AutomationRule[]> {
    return Array.from(this.automationRules.values()).filter(rule => rule.userId === userId);
  }

  async getAutomationRuleByType(userId: number, cryptoType: string): Promise<AutomationRule | undefined> {
    return Array.from(this.automationRules.values()).find(
      rule => rule.userId === userId && rule.cryptoType === cryptoType
    );
  }

  async createAutomationRule(rule: InsertAutomationRule): Promise<AutomationRule> {
    const id = this.currentRuleId++;
    const newRule: AutomationRule = { 
      ...rule, 
      id,
      enabled: rule.enabled !== undefined ? rule.enabled : true
    };
    this.automationRules.set(id, newRule);
    return newRule;
  }

  async updateAutomationRule(id: number, updates: Partial<AutomationRule>): Promise<void> {
    const rule = this.automationRules.get(id);
    if (rule) {
      Object.assign(rule, updates);
      this.automationRules.set(id, rule);
    }
  }

  // Transactions
  async getUserTransactions(userId: number): Promise<Transaction[]> {
    return Array.from(this.transactions.values()).filter(tx => tx.userId === userId);
  }

  async createTransaction(transaction: InsertTransaction): Promise<Transaction> {
    const id = this.currentTransactionId++;
    const newTransaction: Transaction = { 
      ...transaction, 
      id, 
      createdAt: new Date(),
      fromCrypto: transaction.fromCrypto || null,
      toCrypto: transaction.toCrypto || null,
      automationTriggered: transaction.automationTriggered || false
    };
    this.transactions.set(id, newTransaction);
    return newTransaction;
  }

  // Portfolio History
  async getUserPortfolioHistory(userId: number): Promise<PortfolioHistory[]> {
    return Array.from(this.portfolioHistory.values()).filter(history => history.userId === userId);
  }

  async createPortfolioHistory(history: InsertPortfolioHistory): Promise<PortfolioHistory> {
    const id = this.currentHistoryId++;
    const newHistory: PortfolioHistory = { 
      ...history, 
      id, 
      createdAt: new Date() 
    };
    this.portfolioHistory.set(id, newHistory);
    return newHistory;
  }
}

export const storage = new MemStorage();
