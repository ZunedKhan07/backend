import {
  Controller,
  Post,
  Body,
  UseGuards,
  Req,
  Get,
  NotFoundException,
} from '@nestjs/common';
import { JwtAuthGuard } from '../middlewares/jwt-auth.guard';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { UserService } from '../services/user.service'; // Import UserService
import { PostService } from '../services/post.service'; // Import PostService
import { Throttle } from '@nestjs/throttler';
import { Request } from 'express'; // Import Request from express if using it for type `req`

@Controller('posts')
@UseGuards(JwtAuthGuard) // Apply JwtAuthGuard to all routes in this controller
export class PostController {
  constructor(
    @InjectQueue('post-queue') private readonly postQueue: Queue,
    private readonly userService: UserService, // Correctly typed UserService
    private readonly postService: PostService,
  ) {}

  @Post()
  // Apply throttling: 5 requests within 60 seconds for this endpoint
  @Throttle({ limit: 5, ttl: 60 }) 
  async create(@Req() req: Request, @Body() body: any) {
    // Use the findById method from UserService
    const user = await this.userService.findById(req.user['userId']);
    
    // Handle case where user is not found
    if (!user) {
      throw new NotFoundException('User not found.');
    }

    // Map followers (Mongoose ObjectIds) to string IDs, ensuring it's an array
    const followers: string[] = user.followers?.map((f) => f.toString()) || [];

    await this.postQueue.add(
      'create-post',
      {
        authorId: req.user['userId'],
        title: body.title,
        description: body.description,
        followers,
      },
      { delay: 5000 }, // Delay adding the job to the queue by 5 seconds
    );

    return { message: 'Post scheduled successfully' };
  }

  @Get('timeline')
  // Apply throttling: 3 requests within 60 seconds for this endpoint
  @Throttle({ limit: 3, ttl: 60 })
  async getTimeline(@Req() req: Request) {
    // Use the findById method from UserService
    const user = await this.userService.findById(req.user['userId']);
    
    // Handle case where user is not found
    if (!user) {
      throw new NotFoundException('User not found.');
    }

    // Map following (Mongoose ObjectIds) to string IDs, ensuring it's an array
    const followingIds: string[] = user.following?.map((id) => id.toString()) || [];

    // Call PostService's getTimeline with an array of string IDs
    return this.postService.getTimeline(followingIds);
  }
}