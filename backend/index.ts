import { connectDb } from "./src/configs/database";
import app from "./src/app";
import http from "http";
import { initializeSocket } from "./src/utils/socket";

const port = process.env.HELLO_APP_PORT || 5001;

const httpServer = http.createServer(app);
initializeSocket(httpServer);
connectDb()
  .then(() => {
    httpServer.listen(port, () => {
      console.log(`🚀 SERVER IS RUNNING ON PORT ${port}`);
    });
  })
  .catch((error) => {
    console.log("❌ SERVER STARTUP FAILED", error);
    process.exit(1);
  });
