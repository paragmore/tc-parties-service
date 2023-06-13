import mongoose from "mongoose";
import { ConnectionOptions } from "tls";
import { isProd } from "./utils/environment";

export const connectMongoDB = () => {
  const uri = isProd ? process.env.MONGODB_URI : process.env.MONGODB_LOCAL_URI;
  if (!uri) {
    console.log("MONGODB_URI not present");
    return;
  }
  mongoose
    .connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    } as ConnectionOptions)
    .then(() => console.log("MongoDB connected"))
    .catch((err) => console.error(err));
};
