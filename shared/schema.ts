import { pgTable, text, serial, integer, boolean, jsonb, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  phoneNumber: text("phone_number").notNull(),
  balance: integer("balance").notNull().default(0),
});

export const dataPackages = pgTable("data_packages", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  provider: text("provider").notNull(),
  size: text("size").notNull(),
  validity: text("validity").notNull(),
  price: integer("price").notNull(),
});

export const purchases = pgTable("purchases", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  packageId: integer("package_id").notNull(),
  phoneNumber: text("phone_number").notNull(),
  purchaseDate: timestamp("purchase_date").notNull().defaultNow(),
  paymentMethod: text("payment_method").notNull(),
  status: text("status").notNull(),
});

export const insertUserSchema = createInsertSchema(users).extend({
  phoneNumber: z.string()
    .min(10, "Phone number must be at least 10 digits")
    .max(15, "Phone number must not exceed 15 digits")
    .regex(/^\d+$/, "Phone number must contain only digits"),
}).pick({
  username: true,
  password: true,
  phoneNumber: true,
});

export const insertDataPackageSchema = createInsertSchema(dataPackages);
export const insertPurchaseSchema = createInsertSchema(purchases);

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type DataPackage = typeof dataPackages.$inferSelect;
export type Purchase = typeof purchases.$inferSelect;

export const mockDataPackages: DataPackage[] = [
  {
    id: 1,
    name: "Basic Bundle",
    provider: "MTN",
    size: "1GB",
    validity: "30 days",
    price: 1000,
  },
  {
    id: 2,
    name: "Standard Bundle",
    provider: "Vodafone",
    size: "3GB",
    validity: "30 days",
    price: 2500,
  },
  {
    id: 3,
    name: "Premium Bundle",
    provider: "AirtelTigo",
    size: "10GB",
    validity: "30 days",
    price: 5000,
  },
];