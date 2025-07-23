// src/modules/post.module.ts
import { Module } from '@nestjs/common';
import { PostService } from '../services/post.service';
import { PostController } from '../controllers/post.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Post, PostSchema } from '../models/post.model';
import { User, UserSchema } from '../models/user.model';
import { NotificationService } from '../services/notification.service';
import { BullModule } from '@nestjs/bull';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Post.name, schema: PostSchema },
      { name: User.name, schema: UserSchema },
    ]),
    BullModule.registerQueue({ name: 'notification-queue' }),
  ],
  providers: [PostService, NotificationService],
  controllers: [PostController],
})
export class PostModule {}
