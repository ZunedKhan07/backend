import { Module } from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { AuthController } from '../controllers/auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from '../utils/constants';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from '../models/user.model';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    JwtModule.register({ secret: jwtConstants.secret }),
  ],
  providers: [AuthService],
  controllers: [AuthController],
})
export class AuthModule {}
