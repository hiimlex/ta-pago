import dotenv from "dotenv";
import { Server } from "./core";
import supertest from "supertest";

dotenv.config();

const PORT = process.env.PORT || 8080;
const server = new Server(PORT);

server.start();

export const test_agent = supertest(server.app);
