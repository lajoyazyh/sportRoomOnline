import {
  Controller,
  Post,
  Body,
  Inject,
  Get,
  Headers,
  Put,
} from '@midwayjs/core';
import { UserService } from '../service/user.service';
import { RegisterDTO, LoginDTO, UpdateProfileDTO } from '../dto/user.dto';

@Controller('/api/user')
export class UserController {
  @Inject()
  userService: UserService;

  @Post('/register')
  async register(@Body() userData: RegisterDTO) {
    try {
      const user = await this.userService.register(userData);
      if (user === false) {
        return {
          success: false,
          message: '用户名已存在',
        };
      }
      return {
        success: true,
        message: '注册成功',
        data: user,
      };
    } catch (error) {
      return {
        success: false,
        message: error.message || '注册失败',
      };
    }
  }

  @Post('/login')
  async login(@Body() loginData: LoginDTO) {
    try {
      const result = await this.userService.login(loginData);
      return {
        success: true,
        message: '登录成功',
        data: result,
      };
    } catch (error) {
      return {
        success: false,
        message: error.message || '登录失败',
      };
    }
  }

  @Get('/profile')
  async getProfile(@Headers('authorization') authHeader: string) {
    try {
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return {
          success: false,
          message: '缺少认证令牌',
        };
      }

      const token = authHeader.substring(7); // 去掉 'Bearer ' 前缀
      const payload = await this.userService.validateToken(token);

      // 根据 userid 获取用户信息
      const user = await this.userService.getUser({ uid: payload.userid });

      return {
        success: true,
        message: '获取用户信息成功',
        data: user,
      };
    } catch (error) {
      return {
        success: false,
        message: error.message || '获取用户信息失败',
      };
    }
  }

  @Put('/profile')
  async updateProfile(
    @Headers('authorization') authHeader: string,
    @Body() profileData: UpdateProfileDTO
  ) {
    try {
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return {
          success: false,
          message: '缺少认证令牌',
        };
      }

      const token = authHeader.substring(7);
      const payload = await this.userService.validateToken(token);

      // 更新用户Profile信息
      const updatedUser = await this.userService.updateProfile(
        payload.userid,
        profileData
      );

      return {
        success: true,
        message: '更新用户信息成功',
        data: updatedUser,
      };
    } catch (error) {
      return {
        success: false,
        message: error.message || '更新用户信息失败',
      };
    }
  }
}
