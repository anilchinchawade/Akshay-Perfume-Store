import mongoose from "mongoose";
import {app} from "./app.js";
import {env} from "./config/env.js";
async function start(){
 await mongoose.connect(env.MONGODB_URI);
 console.info("Connected to MongoDB.");
 const server=app.listen(env.PORT,()=>console.info(`SCENTNSILLAGE API listening on http://localhost:${env.PORT}`));
 const shutdown=async(signal:string)=>{console.info(`${signal} received. Closing server.`);server.close(async()=>{await mongoose.disconnect();process.exit(0);});};
 process.on("SIGINT",()=>void shutdown("SIGINT"));process.on("SIGTERM",()=>void shutdown("SIGTERM"));
}
start().catch(error=>{console.error("Unable to start backend:",error);process.exit(1);});
