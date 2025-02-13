import { User, InsertUser, DataPackage, Purchase, mockDataPackages } from "@shared/schema";
import session from "express-session";
import createMemoryStore from "memorystore";

const MemoryStore = createMemoryStore(session);

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  getDataPackages(): Promise<DataPackage[]>;
  getPurchasesByUserId(userId: number): Promise<Purchase[]>;
  createPurchase(purchase: Omit<Purchase, "id">): Promise<Purchase>;
  sessionStore: session.Store;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private purchases: Map<number, Purchase>;
  private currentUserId: number;
  private currentPurchaseId: number;
  sessionStore: session.Store;

  constructor() {
    this.users = new Map();
    this.purchases = new Map();
    this.currentUserId = 1;
    this.currentPurchaseId = 1;
    this.sessionStore = new MemoryStore({
      checkPeriod: 86400000,
    });
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = { ...insertUser, id, balance: 0 };
    this.users.set(id, user);
    return user;
  }

  async getDataPackages(): Promise<DataPackage[]> {
    return mockDataPackages;
  }

  async getPurchasesByUserId(userId: number): Promise<Purchase[]> {
    return Array.from(this.purchases.values()).filter(
      (purchase) => purchase.userId === userId,
    );
  }

  async createPurchase(purchase: Omit<Purchase, "id">): Promise<Purchase> {
    const id = this.currentPurchaseId++;
    const newPurchase = { ...purchase, id };
    this.purchases.set(id, newPurchase);
    return newPurchase;
  }
}

export const storage = new MemStorage();
