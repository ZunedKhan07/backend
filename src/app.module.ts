import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ThrottlerModule } from '@nestjs/throttler';
import { BullModule } from '@nestjs/bull';
import { AuthModule } from './modules/auth.module';
import { UserModule } from './modules/user.module';
import { PostModule } from './modules/post.module';
import { NotificationModule } from './modules/notification.module';
import { WsGateway } from './gateway/ws.gateway';
import * as dotenv from 'dotenv';

dotenv.config();

@Module({
  imports: [
    // Mongoose connection to your MongoDB
    MongooseModule.forRoot(process.env.MONGO_URI || 'mongodb://localhost/social'),
    
    // ThrottlerModule configuration: 10 requests within 60 seconds globally
    ThrottlerModule.forRoot([{
      ttl: 60000, // Time to live in milliseconds (60 seconds)
      limit: 10,  // Max number of requests
    }]),

    // BullModule configuration for Redis queue
    BullModule.forRoot({
      redis: {
        host: 'localhost',
        port: 6379 // Default Redis port
      }
    }),

    // Your application modules
    AuthModule,
    UserModule,
    PostModule,
    NotificationModule,
  ],
  providers: [WsGateway], // Your WebSocket Gateway provider
})
export class AppModule {}