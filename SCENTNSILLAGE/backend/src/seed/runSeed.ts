import mongoose from "mongoose";
import {env} from "../config/env.js";
import {seedProducts} from "./products.js";
await mongoose.connect(env.MONGODB_URI);
try{await seedProducts();}finally{await mongoose.disconnect();}
