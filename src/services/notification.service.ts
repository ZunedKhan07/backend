import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Notification, NotificationDocument } from '../models/notification.model';
import { Model } from 'mongoose';

@Injectable()
export class NotificationService {
  constructor(
    @InjectModel(Notification.name) private notificationModel: Model<NotificationDocument>,
  ) {}

  async createNotification(userId: string, type: string, message: string): Promise<Notification> {
    const notification = new this.notificationModel({ userId, type, message });
    return notification.save();
  }

  async getUserNotifications(userId: string): Promise<Notification[]> {
    return this.notificationModel.find({ userId }).sort({ createdAt: -1 });
  }
}
