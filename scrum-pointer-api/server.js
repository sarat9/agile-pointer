const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const { v4: uuidv4 } = require('uuid');
const cors = require('cors');
const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: '*', 
    methods: ['GET', 'POST'],
  },
});

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// In-memory storage for rooms and users
const rooms = {};

// Endpoint to create a new room
app.post('/api/rooms', (req, res) => {
  const roomId = uuidv4();
  rooms[roomId] = { users: {}, pointsRevealed: false };
  console.log(`Room Created: ${roomId}`);
  res.json({ roomId });
});

// WebSocket connections
io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);

  socket.on('reload-users', ({ roomId, userId, userName }) => {
    if (rooms[roomId]) {
      console.log(`Reloading users for room ${roomId}`);

      // Check if the user already exists in the room
      if (!rooms[roomId].users[userId]) {
        rooms[roomId].users[userId] = {
          userId,
          name: userName,
          points: null,
          socketId: socket.id,
        };
      } else {
        // Update socketId if user is reloading
        rooms[roomId].users[userId].socketId = socket.id;
      }

      socket.join(roomId);

      // Notify all users in the room
      io.to(roomId).emit('users-reloaded', {
        users: Object.values(rooms[roomId].users),
        isPointsRevealed: rooms[roomId].pointsRevealed,
      });
    }
  });

  socket.on('join-room', ({ roomId, userName }) => {
    if (!rooms[roomId]) {
      socket.emit('error', { message: 'Room does not exist' });
      return;
    }

    // Assign a unique user ID
    const userId = uuidv4();
    rooms[roomId].users[userId] = { userId: userId, name: userName, points: null, socketId: socket.id };
    socket.join(roomId);

    console.log(`👤 ${userName} joined room ${roomId} (User ID: ${userId})`);

    // Notify all users in the room
    io.to(roomId).emit('user-joined', {
      users: Object.values(rooms[roomId].users),
    });

    // Send back the userId to the client
    socket.emit('joined-room', { userId });
  });

  socket.on('select-points', ({ roomId, userId, points }) => {
    if (rooms[roomId]?.users[userId]) {
      rooms[roomId].users[userId].points = points;
      console.log(`User ${userId} selected points: ${points}`);

      io.to(roomId).emit('points-updated', {
        users: Object.values(rooms[roomId].users),
      });
    }
  });

  socket.on('reveal-points', ({ roomId }) => {
    if (rooms[roomId]) {
      rooms[roomId].pointsRevealed = true;
      console.log(`Points revealed for room: ${roomId}`);

      io.to(roomId).emit('points-revealed', {
        users: Object.values(rooms[roomId].users),
      });
    }
  });


  socket.on('hide-points', ({ roomId }) => {
    if (rooms[roomId]) {
      rooms[roomId].pointsRevealed = false;
      console.log(`Points Hidden for room: ${roomId}`);

      io.to(roomId).emit('points-hidden', {
        users: Object.values(rooms[roomId].users),
      });
    }
  });


  socket.on('restart-pointing', ({ roomId }) => {
    if (rooms[roomId]) {
      rooms[roomId].pointsRevealed = false;
      console.log(`Points revealed for room: ${roomId}`);

      const hashMap = rooms[roomId].users
      Object.keys(hashMap).forEach(userId =>{
        rooms[roomId].users[userId].points = undefined;
      });

      io.to(roomId).emit('points-restarted', {
        users: Object.values(rooms[roomId].users),
        pointsRevealed: rooms[roomId].pointsRevealed,
      });
    }
  });

  socket.on('disconnect', () => {
    console.log(`User disconnected: ${socket.id}`);

    for (const roomId in rooms) {
      const roomUsers = rooms[roomId].users;
      for (const userId in roomUsers) {
        if (roomUsers[userId].socketId === socket.id) {
          console.log(`Removed user ${roomUsers[userId].name} (${userId}) from room ${roomId}`);
          delete roomUsers[userId];

          io.to(roomId).emit('user-joined', {
            users: Object.values(roomUsers),
          });
          break;
        }
      }
    }
  });
});


server.listen(5000, () => {
  console.log('Server is running on http://localhost:5000');
});
