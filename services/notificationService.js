// services/notificationService.js
const WebSocket = require("ws");
const { EventEmitter } = require("events");

class NotificationService {
  constructor() {
    this.eventEmitter = new EventEmitter();
    this.connections = new Map();
  }

  initialize(server) {
    this.wss = new WebSocket.Server({ server });

    this.wss.on("connection", (ws, req) => {
      const userId = this.getUserIdFromRequest(req);
      if (userId) {
        this.connections.set(userId, ws);

        ws.on("close", () => {
          this.connections.delete(userId);
        });
      }
    });
  }

  getUserIdFromRequest(req) {
    // Extract user ID from authentication token
    // Implementation depends on your auth strategy
    return req.userId;
  }

  async notifyUser(userId, notification) {
    const connection = this.connections.get(userId);
    if (connection) {
      connection.send(JSON.stringify(notification));
    }
  }

  async notifyAll(notification) {
    this.connections.forEach((connection) => {
      connection.send(JSON.stringify(notification));
    });
  }

  async createNotification(type, data) {
    const notification = {
      type,
      data,
      timestamp: new Date(),
    };

    // Emit event for internal handling
    this.eventEmitter.emit("notification", notification);

    return notification;
  }
}
