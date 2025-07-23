import { Controller, Post, Param, UseGuards, Req } from '@nestjs/common';
import { UserService } from '../services/user.service';
import { JwtAuthGuard } from '../middlewares/jwt-auth.guard';
import { WsGateway } from '../gateway/ws.gateway';

@Controller('users')
@UseGuards(JwtAuthGuard)
export class UserController {
  constructor(
    private userService: UserService,
    private wsGateway: WsGateway,
  ) {}

  @Post('follow/:id')
  async follow(@Req() req, @Param('id') id: string) {
    await this.userService.follow(req.user.userId, id);
    this.wsGateway.sendNotification(id, `User ${req.user.username} followed you`);
    return { msg: 'Followed' };
  }

  @Post('unfollow/:id')
  async unfollow(@Req() req, @Param('id') id: string) {
    await this.userService.unfollow(req.user.userId, id);
    return { msg: 'Unfollowed' };
  }
}
