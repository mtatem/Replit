import { pgTable, text, serial, integer, boolean, decimal, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  name: text("name").notNull(),
  status: text("status").notNull().default("Premium Member"),
});

export const cryptocurrencies = pgTable("cryptocurrencies", {
  id: serial("id").primaryKey(),
  symbol: text("symbol").notNull().unique(),
  name: text("name").notNull(),
  type: text("type").notNull(), // 'major', 'altcoin', 'meme'
  icon: text("icon").notNull(),
  blockchain: text("blockchain").notNull(),
  currentPrice: decimal("current_price", { precision: 18, scale: 8 }).notNull(),
  priceChange24h: decimal("price_change_24h", { precision: 8, scale: 4 }).notNull(),
  marketCap: decimal("market_cap", { precision: 20, scale: 2 }),
  volume24h: decimal("volume_24h", { precision: 20, scale: 2 }),
});

export const portfolioHoldings = pgTable("portfolio_holdings", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  cryptoId: integer("crypto_id").notNull(),
  balance: decimal("balance", { precision: 18, scale: 8 }).notNull(),
  averageBuyPrice: decimal("average_buy_price", { precision: 18, scale: 8 }).notNull(),
  totalInvested: decimal("total_invested", { precision: 20, scale: 2 }).notNull(),
  isStaked: boolean("is_staked").default(false),
  stakedAmount: decimal("staked_amount", { precision: 18, scale: 8 }).default("0"),
  stakingApy: decimal("staking_apy", { precision: 5, scale: 2 }).default("0"),
});

export const automationRules = pgTable("automation_rules", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  cryptoType: text("crypto_type").notNull(), // 'major', 'altcoin', 'meme'
  enabled: boolean("enabled").default(true),
  profitTarget: decimal("profit_target", { precision: 5, scale: 2 }).notNull(),
  stopLoss: decimal("stop_loss", { precision: 5, scale: 2 }).notNull(),
  sellPercentage: decimal("sell_percentage", { precision: 5, scale: 2 }).notNull(),
});

export const transactions = pgTable("transactions", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  cryptoId: integer("crypto_id").notNull(),
  type: text("type").notNull(), // 'buy', 'sell', 'swap', 'stake', 'unstake', 'auto_sell'
  amount: decimal("amount", { precision: 18, scale: 8 }).notNull(),
  price: decimal("price", { precision: 18, scale: 8 }).notNull(),
  totalValue: decimal("total_value", { precision: 20, scale: 2 }).notNull(),
  fromCrypto: integer("from_crypto_id"),
  toCrypto: integer("to_crypto_id"),
  automationTriggered: boolean("automation_triggered").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

export const portfolioHistory = pgTable("portfolio_history", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  totalValue: decimal("total_value", { precision: 20, scale: 2 }).notNull(),
  totalPnl: decimal("total_pnl", { precision: 20, scale: 2 }).notNull(),
  totalPnlPercent: decimal("total_pnl_percent", { precision: 8, scale: 4 }).notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  name: true,
});

export const insertCryptocurrencySchema = createInsertSchema(cryptocurrencies).omit({
  id: true,
});

export const insertPortfolioHoldingSchema = createInsertSchema(portfolioHoldings).omit({
  id: true,
});

export const insertAutomationRuleSchema = createInsertSchema(automationRules).omit({
  id: true,
});

export const insertTransactionSchema = createInsertSchema(transactions).omit({
  id: true,
  createdAt: true,
});

export const insertPortfolioHistorySchema = createInsertSchema(portfolioHistory).omit({
  id: true,
  createdAt: true,
});

export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type Cryptocurrency = typeof cryptocurrencies.$inferSelect;
export type InsertCryptocurrency = z.infer<typeof insertCryptocurrencySchema>;
export type PortfolioHolding = typeof portfolioHoldings.$inferSelect;
export type InsertPortfolioHolding = z.infer<typeof insertPortfolioHoldingSchema>;
export type AutomationRule = typeof automationRules.$inferSelect;
export type InsertAutomationRule = z.infer<typeof insertAutomationRuleSchema>;
export type Transaction = typeof transactions.$inferSelect;
export type InsertTransaction = z.infer<typeof insertTransactionSchema>;
export type PortfolioHistory = typeof portfolioHistory.$inferSelect;
export type InsertPortfolioHistory = z.infer<typeof insertPortfolioHistorySchema>;
