import mongoose from "mongoose";

const dbConnect = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    console.log("Database is successfully connected!");
    console.log("Database:", conn.connection.name);
    console.log("Host:", conn.connection.host);
  } catch (err) {
    console.log("Connection Failed:", err.message);
    process.exit(1);
  }
};

export default dbConnect;
