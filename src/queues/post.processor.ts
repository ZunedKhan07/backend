import { Processor, Process } from '@nestjs/bull';
import { Job } from 'bull';
import { PostService } from '../services/post.service';
import { WsGateway } from '../gateway/ws.gateway';

@Processor('post-queue')
export class PostProcessor {
  constructor(
    private postService: PostService,
    private wsGateway: WsGateway,
  ) {}

  @Process('create-post')
  async handleCreatePost(job: Job) {
    const { authorId, title, description, followers } = job.data;
    const post = await this.postService.createPost(authorId, title, description);
    followers.forEach((followerId) =>
      this.wsGateway.sendNotification(followerId, `User created a new post: ${title}`),
    );
    return post;
  }
}
