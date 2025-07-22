import { storage } from "./storage";

export async function seedDatabase() {
  try {
    // Check if data already exists
    const existingCryptos = await storage.getAllCryptocurrencies();
    if (existingCryptos.length > 0) {
      console.log("Database already seeded");
      return;
    }

    console.log("Seeding database...");

    // Seed cryptocurrencies
    const cryptos = [
      {
        symbol: "BTC",
        name: "Bitcoin",
        type: "major",
        icon: "bitcoin",
        blockchain: "Bitcoin",
        currentPrice: "67432.50",
        priceChange24h: "2.45",
        marketCap: "1337000000000",
        volume24h: "28500000000"
      },
      {
        symbol: "ETH",
        name: "Ethereum",
        type: "major",
        icon: "ethereum",
        blockchain: "Ethereum",
        currentPrice: "3842.75",
        priceChange24h: "1.82",
        marketCap: "462000000000",
        volume24h: "15200000000"
      },
      {
        symbol: "SOL",
        name: "Solana",
        type: "altcoin",
        icon: "solana",
        blockchain: "Solana",
        currentPrice: "178.92",
        priceChange24h: "5.67",
        marketCap: "84500000000",
        volume24h: "3400000000"
      },
      {
        symbol: "MATIC",
        name: "Polygon",
        type: "altcoin",
        icon: "polygon",
        blockchain: "Polygon",
        currentPrice: "0.9234",
        priceChange24h: "-1.23",
        marketCap: "9200000000",
        volume24h: "420000000"
      },
      {
        symbol: "DOGE",
        name: "Dogecoin",
        type: "meme",
        icon: "dogecoin",
        blockchain: "Dogecoin",
        currentPrice: "0.1456",
        priceChange24h: "8.92",
        marketCap: "21000000000",
        volume24h: "1800000000"
      },
      {
        symbol: "SHIB",
        name: "Shiba Inu",
        type: "meme",
        icon: "shib",
        blockchain: "Ethereum",
        currentPrice: "0.000024",
        priceChange24h: "-3.45",
        marketCap: "14200000000",
        volume24h: "890000000"
      }
    ];

    for (const crypto of cryptos) {
      await storage.createCryptocurrency(crypto);
    }

    // Create a demo user
    const demoUser = await storage.createUser({
      username: "demo",
      password: "demo123",
      name: "Demo User"
    });

    // Seed portfolio holdings for demo user
    const holdings = [
      {
        userId: demoUser.id,
        cryptoId: 1, // BTC
        balance: "0.25",
        averageBuyPrice: "65000.00",
        totalInvested: "16250.00",
        isStaked: false,
        stakedAmount: "0",
        stakingApy: "0"
      },
      {
        userId: demoUser.id,
        cryptoId: 2, // ETH
        balance: "2.5",
        averageBuyPrice: "3600.00",
        totalInvested: "9000.00",
        isStaked: true,
        stakedAmount: "1.0",
        stakingApy: "4.5"
      },
      {
        userId: demoUser.id,
        cryptoId: 3, // SOL
        balance: "50",
        averageBuyPrice: "150.00",
        totalInvested: "7500.00",
        isStaked: false,
        stakedAmount: "0",
        stakingApy: "0"
      }
    ];

    for (const holding of holdings) {
      await storage.createPortfolioHolding(holding);
    }

    // Seed automation rules for demo user
    const automationRules = [
      {
        userId: demoUser.id,
        cryptoType: "major",
        enabled: true,
        profitTarget: "20.00",
        stopLoss: "10.00",
        sellPercentage: "25.00"
      },
      {
        userId: demoUser.id,
        cryptoType: "altcoin",
        enabled: true,
        profitTarget: "30.00",
        stopLoss: "15.00",
        sellPercentage: "50.00"
      },
      {
        userId: demoUser.id,
        cryptoType: "meme",
        enabled: false,
        profitTarget: "100.00",
        stopLoss: "25.00",
        sellPercentage: "75.00"
      }
    ];

    for (const rule of automationRules) {
      await storage.createAutomationRule(rule);
    }

    // Seed some transaction history
    const transactions = [
      {
        userId: demoUser.id,
        cryptoId: 1,
        type: "buy",
        amount: "0.25",
        price: "65000.00",
        totalValue: "16250.00",
        fromCrypto: null,
        toCrypto: null,
        automationTriggered: false
      },
      {
        userId: demoUser.id,
        cryptoId: 2,
        type: "buy",
        amount: "2.5",
        price: "3600.00",
        totalValue: "9000.00",
        fromCrypto: null,
        toCrypto: null,
        automationTriggered: false
      },
      {
        userId: demoUser.id,
        cryptoId: 3,
        type: "buy",
        amount: "50",
        price: "150.00",
        totalValue: "7500.00",
        fromCrypto: null,
        toCrypto: null,
        automationTriggered: false
      }
    ];

    for (const transaction of transactions) {
      await storage.createTransaction(transaction);
    }

    console.log("Database seeded successfully!");
  } catch (error) {
    console.error("Error seeding database:", error);
    throw error;
  }
}