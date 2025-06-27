import dotenv from 'dotenv';
dotenv.config();
import { Server } from 'http';

import app from './app';
import mongoose from 'mongoose';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
let server: Server;


const port = process.env.PORT || 5000;
dotenv.config();

async function main() {
  try {
    
    await mongoose.connect(process.env.MONGODB_URI as string);
    console.log('✅ Mongoose is connected');

    
    server = app.listen(port, () => {
      console.log(`🚀 Server is running on port ${port}`);
    });
  } catch (error) {
    console.error('❌ Error starting server or connecting to DB:', error);
  }
}

main();
