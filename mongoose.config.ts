import mongoose from "mongoose";
import { ConnectionOptions } from "tls";
import { environment, isProd } from "./utils/environment";

export const connectMongoDB = () => {
  const uri = isProd ? process.env.MONGODB_URI : process.env.MONGODB_URI;
  if (!uri) {
    console.log("MONGODB_URI not present");
    return;
  }
  mongoose
    .connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      dbName:environment.dbName
    } as ConnectionOptions)
    .then(() => console.log("MongoDB connected"))
    .catch((err) => console.error(err));
};
