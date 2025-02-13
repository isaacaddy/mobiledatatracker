import type { Express } from "express";
import { createServer, type Server } from "http";
import { setupAuth } from "./auth";
import { storage } from "./storage";

export function registerRoutes(app: Express): Server {
  setupAuth(app);

  app.get("/api/packages", async (_req, res) => {
    const packages = await storage.getDataPackages();
    res.json(packages);
  });

  app.get("/api/purchases", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    const purchases = await storage.getPurchasesByUserId(req.user.id);
    res.json(purchases);
  });

  app.post("/api/purchases", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);

    const purchase = await storage.createPurchase({
      userId: req.user.id,
      packageId: req.body.packageId,
      phoneNumber: req.body.phoneNumber,
      purchaseDate: new Date(),
      paymentMethod: req.body.paymentMethod,
      status: "completed",
    });

    res.status(201).json(purchase);
  });

  const httpServer = createServer(app);
  return httpServer;
}