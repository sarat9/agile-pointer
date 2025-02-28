// app/api/socket/route.js
import { Server } from "socket.io";
import { NextResponse } from 'next/server';

let io;

export function GET() {
    console.log('outio', io);
    console.log('globalThis.socketServer', globalThis.socketServer);
    let response  = NextResponse.json();

  // Check if the Socket.IO server is already initialized
  if (!globalThis.socketServer) {
    console.log("Initializing Socket.IO server...");
    io = new Server({
      cors: {
        origin: "*", // Adjust as per your frontend URL in production
      },
    });


    console.log('io', io);

    // Handle WebSocket connections
    io.on("connection", (socket) => {
      console.log("User connected:", socket.id);

      // Handle events
      socket.on("join-room", ({ roomId, userName }) => {
        socket.join(roomId);
        console.log(`${userName} joined room: ${roomId}`);

        // Broadcast updated user list to the room
        const room = io.sockets.adapter.rooms.get(roomId) || [];
        const users = Array.from(room).map((socketId) => ({
          id: socketId,
          name: userName,
        }));
        io.to(roomId).emit("user-joined", users);
      });

      socket.on("select-points", ({ roomId, userId, points }) => {
        io.to(roomId).emit("update-points", { userId, points });
      });

      socket.on("reveal-points", ({ roomId }) => {
        io.to(roomId).emit("points-revealed");
      });

      socket.on("disconnect", () => {
        console.log("User disconnected:", socket.id);
      });
    });

    // Attach the Socket.IO server to the existing HTTP server
    globalThis.socketServer = io;
    response.socket.server.io = io;
    // io(globalThis.server);
  }
//   response.socket.server.io = io;
//   return new Response.end()
//   return new Response.end()
  return response
}
