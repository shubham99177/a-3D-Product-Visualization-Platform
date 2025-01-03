import cookieParser from "cookie-parser";
import express from "express";
import cors from "cors";
import http from "http";
import  productrouter  from "./routes/product.route.js";
import  customizationrouter  from "./routes/customizationroute.js";
import path from "path";
import { fileURLToPath } from 'url';

import dotenv from "dotenv";
dotenv.config({
  path: "./.env", // Ensure this is the correct path
});

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname( __filename );

const app = express();
const server = http.createServer(app);
console.log(process.env.CORS_ORIGIN)

app.use(
  cors({
    origin: process.env.CORS_ORIGIN || "http://localhost:5173" ,
    credentials: true,
  }),
);

app.use(
  express.json({
    limit: "50mb",
  }),
);

app.use(
  express.urlencoded({
    limit: "50mb",
    extended: true,
  }),
);

// app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static("./public"))

app.use(cookieParser());

app.get('/api/models', (req, res) => {
  res.json([
    { id: 1, name: 'Chair', url: '/models/painted_wooden/painted_wooden.gltf' },
    { id: 2, name: 'Table', url: '/models/table.glb' },
  ]);
});
app.use("/api/v1/product", productrouter)
app.use("/api/v1/customization", customizationrouter)

export { app, server };
