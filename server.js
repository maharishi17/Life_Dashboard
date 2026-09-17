const { createServer } = require('http');
const { parse } = require('url');
const next = require('next');
const { Server } = require('socket.io');
const { PrismaClient } = require('@prisma/client');

const dev = process.env.NODE_ENV !== 'production';
const hostname = 'localhost';
const port = parseInt(process.env.PORT || '3000', 10);

const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();

const prisma = new PrismaClient();

app.prepare().then(() => {
  const server = createServer(async (req, res) => {
    try {
      const parsedUrl = parse(req.url, true);
      await handle(req, res, parsedUrl);
    } catch (err) {
      console.error('Error occurred handling', req.url, err);
      res.statusCode = 500;
      res.end('internal server error');
    }
  });

  const io = new Server(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"]
    }
  });

  // Track online users: { socketId: { userId, name } }
  const onlineUsers = new Map();

  io.on('connection', (socket) => {
    console.log(`Socket connected: ${socket.id}`);

    // When a client connects and identifies itself
    socket.on('user_connected', async (userData) => {
      if (userData && userData.userId) {
        onlineUsers.set(socket.id, userData);
        
        // Update Prisma DB
        try {
          await prisma.user.update({
            where: { id: userData.userId },
            data: { lastActiveAt: new Date() }
          });
        } catch(e) {
          console.error("Failed to update lastActiveAt on connect:", e);
        }

        // Broadcast to everyone the updated online users
        io.emit('status_update', Array.from(onlineUsers.values()));
      }
    });

    // When a client explicitly pings to stay alive
    socket.on('ping_active', async (userData) => {
      if (userData && userData.userId) {
         try {
            await prisma.user.update({
              where: { id: userData.userId },
              data: { lastActiveAt: new Date() }
            });
         } catch(e) {}
      }
    });

    socket.on('disconnect', async () => {
      console.log(`Socket disconnected: ${socket.id}`);
      const userData = onlineUsers.get(socket.id);
      
      if (userData && userData.userId) {
        try {
          await prisma.user.update({
            where: { id: userData.userId },
            data: { lastActiveAt: new Date() }
          });
        } catch(e) {}
        
        onlineUsers.delete(socket.id);
        io.emit('status_update', Array.from(onlineUsers.values()));
      }
    });
  });

  server.once('error', (err) => {
    console.error(err);
    process.exit(1);
  });

  server.listen(port, () => {
    console.log(`> Ready on http://${hostname}:${port}`);
  });
});
