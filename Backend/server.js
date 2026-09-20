import express from "express";
import "dotenv/config";
import cors from "cors";
import dbConnect from "./config/db.js";
import routes from "./routes/Routes.js";

const app = express();
const PORT = process.env.PORT || 8000;
app.use(express.json());
app.use(cors());

app.listen(PORT, () => {
  console.log(`server is running at PORT:${PORT}`);
});
dbConnect();

app.use("/api", routes);
