import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertWaitlistSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  
  // Waitlist signup endpoint
  app.post("/api/waitlist", async (req, res) => {
    try {
      const validatedData = insertWaitlistSchema.parse(req.body);
      
      // Check if email already exists
      const emailExists = await storage.isEmailInWaitlist(validatedData.email);
      if (emailExists) {
        return res.status(400).json({ 
          message: "This email is already on our waitlist! 🎉" 
        });
      }

      const waitlistEntry = await storage.addToWaitlist(validatedData);
      const totalCount = await storage.getWaitlistCount();
      
      res.json({ 
        success: true,
        message: "Welcome to the waitlist! 🚀",
        waitlistEntry,
        totalCount
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ 
          message: "Please enter a valid email address 📧" 
        });
      }
      res.status(500).json({ 
        message: "Something went wrong. Please try again! 😅" 
      });
    }
  });

  // Get waitlist count
  app.get("/api/waitlist/count", async (req, res) => {
    try {
      const count = await storage.getWaitlistCount();
      res.json({ count });
    } catch (error) {
      res.status(500).json({ message: "Failed to get waitlist count" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
