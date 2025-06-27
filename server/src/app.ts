import dotenv from "dotenv";
import { Server } from "./core";

dotenv.config();

const PORT = process.env.PORT || 8080;
const server = new Server(PORT);

server.start();
