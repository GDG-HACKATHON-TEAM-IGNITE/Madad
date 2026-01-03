import express from 'express';
import cors from 'cors';
import { decodeToken } from './middleware/auth.js';
import  user from './controllers/user.js';
import connectDB from './config/db.js';
import { Server } from "socket.io";
import http from "http";
const port = process.env.PORT || 5000;
import initSockets from './sockets/index.js';
const app = express();
app.use(express.json());
app.use(cors());



app.post('/api/user', decodeToken, user);
//routes










const server = http.createServer(app);
const io = new Server(server, {
    pingInterval: 5000, // 5 sec
  pingTimeout: 3000 ,  // 3 sec
   cors: {
    origin: process.env.port,
    methods: ["GET", "POST"],
    credentials: true
  }
});

initSockets(io);








try {
await connectDB();
server.listen(port, () => {
	console.log(`server is running on port ${port}`);
});  
} catch (error) {
	console.log(error)
}



