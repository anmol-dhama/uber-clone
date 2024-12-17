import { Server } from "http";
import { Server as SocketIOServer, Socket } from "socket.io";
import { User } from "./models/user.model";
import { Captain } from "./models/captain.model";

interface Msg {
    event: string; // Event should be a string
    data?: any;    // Data can be any type, but you can refine it based on use case
}

let io: SocketIOServer | null = null;

/**
 * Initializes the Socket.IO server with the provided HTTP server.
 * @param server - The HTTP server to attach the Socket.IO instance to.
 */
export function initializeSocket(server: Server): void {
  io = new SocketIOServer(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket: Socket) => {
    console.log(`Client connected: ${socket.id}`);

    socket.on("join", async (data: { userId: string; userType: "user" | "captain" }) => {
      const { userId, userType } = data;

      if (!userId || !userType) {
        console.error("Invalid join data:", data);
        return;
      }

      try {
        if (userType === "user") {
          await User.findByIdAndUpdate(userId, { socketId: socket.id });
        } else if (userType === "captain") {
          await Captain.findByIdAndUpdate(userId, { socketId: socket.id });
        }
        console.log(`Socket ID updated for ${userType}: ${userId}`);
        socket.emit("join-ack", { success: true });
      } catch (error:any) {
        console.error(`Error updating socketId for ${userType}: ${error.message}`);
        socket.emit("join-ack", { success: false, error: error.message });
      }
    });

    socket.on('update-location-captain', async (data)=>{
        const {userId, location} = data;
        if(!location || !location.ltd || !location.lng){
            return socket.emit('error',{message: "Invalid location"})
        }

        await Captain.findByIdAndUpdate(userId, {
            $set: {
                location: {
                    type: "Point",  // GeoJSON type for points
                    coordinates: [location.lng, location.ltd]  // [longitude, latitude]
                }
            }
        });
    })

    socket.on("disconnect", () => {
      console.log(`Client disconnected: ${socket.id}`);
    });
  });
}

/**
 * Sends a message to a specific socket by its ID.
 * @param socketId - The ID of the socket to send the message to.
 * @param message - The message to send.
 */
export function sendMessageToSocketId(socketId: string, message: Msg): void {
    if (!message.event) {
        console.error("Message event is required!");
        return;
    }

    if (io) {
        io.to(socketId).emit(message.event, message.data._doc || {});
    } else {
        console.error("Socket.io not initialized!");
    }
}
