import dotenv from "dotenv";
import {pool,testConnection} from "./db/index.js";
import { app } from "./app.js";

dotenv.config();

const startServer = async () => {
  try {
    await testConnection(); 

    const port = process.env.PORT || 9000;
    const server = app.listen(port, () => {
      console.log(`🚀 Server running on port ${port}`);
    });

    server.on("error", (err) => {
      console.error("❌ Server failed to start:", err);
    });
  } catch (err) {
    console.error("💥 Database connection failed, aborting server start.");
    process.exit(1); // stop the process
  }
};

startServer();