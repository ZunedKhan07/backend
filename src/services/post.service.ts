import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Post } from '../models/post.model';
import { Model } from 'mongoose';

@Injectable()
export class PostService {
  constructor(@InjectModel(Post.name) private postModel: Model<Post>) {}

  async createPost(authorId: string, title: string, description: string) {
    return await this.postModel.create({ title, description, author: authorId });
  }

  async getTimeline(userIds: string[]) {
    return await this.postModel
      .find({ author: { $in: userIds } })
      .sort({ createdAt: -1 });
  }
}
