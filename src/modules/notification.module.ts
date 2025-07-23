import { Module } from '@nestjs/common';
import { NotificationService } from '../services/notification.service';
import { NotificationController } from '../controllers/notification.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Notification, NotificationSchema } from '../models/notification.model';
import { BullModule } from '@nestjs/bull';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Notification.name, schema: NotificationSchema }]),
    BullModule.registerQueue({ name: 'notification-queue' }),
  ],
  providers: [NotificationService],
  controllers: [NotificationController],
})
export class NotificationModule {}
