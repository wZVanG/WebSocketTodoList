import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { WebSocketServer, WebSocket } from "ws";
import { insertTodoSchema, type TodoEvent } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  const httpServer = createServer(app);
  const wss = new WebSocketServer({ server: httpServer, path: '/ws' });

  const broadcast = (event: TodoEvent) => {
    wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify(event));
      }
    });
  };

  app.get("/api/todos", async (_req, res) => {
    const todos = await storage.getTodos();
    res.json(todos);
  });

  app.post("/api/todos", async (req, res) => {
    const result = insertTodoSchema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({ error: "Invalid todo data" });
    }

    const todo = await storage.createTodo(result.data);
    broadcast({ type: 'create', todo });
    res.json(todo);
  });

  app.patch("/api/todos/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    const updates = req.body;
    
    const todo = await storage.updateTodo(id, updates);
    if (!todo) {
      return res.status(404).json({ error: "Todo not found" });
    }

    broadcast({ type: 'update', todo });
    res.json(todo);
  });

  app.delete("/api/todos/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    const todo = await storage.deleteTodo(id);
    
    if (!todo) {
      return res.status(404).json({ error: "Todo not found" });
    }

    broadcast({ type: 'delete', todo });
    res.json(todo);
  });

  return httpServer;
}
