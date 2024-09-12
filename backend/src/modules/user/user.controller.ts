import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CurrentUser } from '../auth/decorator/current-user.decorator';
import { CurrentUserModel } from '../auth/models/current-user.model';
import { ApiGetMyProfile } from './api.decorator';
import { UserService } from './user.service';

@ApiTags('User')
@Controller('/user')
export class UserController {
  constructor(private servuce: UserService) {}

  @ApiGetMyProfile()
  async myProfile(
    @CurrentUser() currentUser: CurrentUserModel,
  ): Promise<CurrentUserModel> {
    return currentUser;
  }
}
