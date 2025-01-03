// require("dotenv").config({ path: "./.env" });
import dotenv from "dotenv";
import connectDB from "./db/index.js";
import { app, server } from "./app.js";
import { Server } from "socket.io";

// Load environment variables from .env file
dotenv.config({
  path: "./.env", // Ensure this is the correct path
});

connectDB()
  .then(() => {
    app.listen(process.env.PORT || 8000, () => {
      console.log(`Server is running at port: ${process.env.PORT || 8000} `);
    });
  })
  .catch((err) => {
    console.log("MONGO DB CONNECTION FAILED!!!", err);
  });

app.get("/", (req, res) => {
  res.send("Hello World!");
});

const io = new Server(server);
io.on("connection", (socket) => {
  console.log("A user connected");
  socket.on("customization", (data) => {
    io.emit("customizationUpdate", data); // Broadcast to all connected clients
  });
  socket.on("disconnect", () => {
    console.log("A user disconnected");
  });
});

// import express from "express";
// const app = express();

// (async () => {
//   try {
//     await mongoose.connect(`${process.env.MONGODB_URL}/${DB_NAME}`);
//     app.on("error", (error) => {
//       console.error("ERROR:", error);
//       throw error;
//     });

//     app.listen(process.env.PORT, () => {
//       console.log(`Server is running on port ${process.env.PORT}`);
//     });
//   } catch (error) {
//     console.error("ERROR:", error);
//     throw error;
//   }
// })();
