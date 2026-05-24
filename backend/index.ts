import { connectDb } from "./src/configs/database";
import app from "./src/app";

const port = process.env.HELLO_APP_PORT || 5001;

connectDb()
  .then(() => {
    app.listen(port, () => {
      console.log(`🚀 SERVER IS RUNNING ON PORT ${port}`);
    });
  })
  .catch((error) => {
    console.log("❌ SERVER STARTUP FAILED", error);
    process.exit(1);
  });
