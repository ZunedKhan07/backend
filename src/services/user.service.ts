import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from '../models/user.model';
import { Model } from 'mongoose';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async follow(currentUserId: string, targetUserId: string) {
    await this.userModel.findByIdAndUpdate(currentUserId, {
      $addToSet: { following: targetUserId },
    });
    await this.userModel.findByIdAndUpdate(targetUserId, {
      $addToSet: { followers: currentUserId },
    });
    return true;
  }

  async unfollow(currentUserId: string, targetUserId: string) {
    await this.userModel.findByIdAndUpdate(currentUserId, {
      $pull: { following: targetUserId },
    });
    await this.userModel.findByIdAndUpdate(targetUserId, {
      $pull: { followers: currentUserId },
    });
    return true;
  }

  async findById(userId: string) {
    return this.userModel.findById(userId);
  }
}
