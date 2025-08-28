import mongoose from "mongoose";

export const connect = async () => {
  try {
    await mongoose.connect(process.env.MONGO_DB_URI);
    console.log("connected to: ", mongoose.connection.host);
  } catch (error) {
    console.log("db connection error: ", error);
    process.exit(1);
  }
};
