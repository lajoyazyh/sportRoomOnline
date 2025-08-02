import {
  Controller,
  Post,
  Body,
  Inject,
  Get,
  Headers,
  Put,
  Files,
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

  @Post('/upload-photos')
  async uploadPhotos(
    @Headers('authorization') authHeader: string,
    @Files() files
  ) {
    console.log('🚀 [uploadPhotos] 接收到照片上传请求');
    console.log('🚀 [uploadPhotos] authHeader存在:', !!authHeader);
    console.log('🚀 [uploadPhotos] files:', files);

    try {
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        console.error('❌ [uploadPhotos] 缺少认证令牌');
        return {
          success: false,
          message: '缺少认证令牌',
        };
      }

      const token = authHeader.substring(7);
      const payload = await this.userService.validateToken(token);
      console.log('✅ [uploadPhotos] 用户验证成功:', payload);

      if (!files || files.length === 0) {
        console.error('❌ [uploadPhotos] 没有上传的文件');
        return {
          success: false,
          message: '没有上传的文件',
        };
      }

      // 保存照片并更新用户photos字段
      console.log('🚀 [uploadPhotos] 调用saveUserPhotos方法...');
      const photoUrls = await this.userService.saveUserPhotos(
        payload.userid,
        files
      );
      console.log(
        '✅ [uploadPhotos] saveUserPhotos执行完成，返回数据:',
        photoUrls
      );

      return {
        success: true,
        message: '照片上传成功',
        data: photoUrls,
      };
    } catch (error) {
      console.error('❌ [uploadPhotos] 上传失败:', error);
      return {
        success: false,
        message: error.message || '照片上传失败',
      };
    }
  }

  @Post('/upload-avatar')
  async uploadAvatar(
    @Headers('authorization') authHeader: string,
    @Files() files
  ) {
    console.log('🚀 [uploadAvatar] 接收到头像上传请求');
    console.log('🚀 [uploadAvatar] authHeader存在:', !!authHeader);
    console.log('🚀 [uploadAvatar] files:', files);

    try {
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        console.error('❌ [uploadAvatar] 缺少认证令牌');
        return {
          success: false,
          message: '缺少认证令牌',
        };
      }

      const token = authHeader.substring(7);
      const payload = await this.userService.validateToken(token);
      console.log('✅ [uploadAvatar] 用户验证成功:', payload);

      if (!files || files.length === 0) {
        console.error('❌ [uploadAvatar] 没有上传的文件');
        return {
          success: false,
          message: '没有上传的文件',
        };
      }

      // 只处理第一个文件作为头像
      const avatarFile = files[0];
      console.log('🚀 [uploadAvatar] 调用saveUserAvatar方法...');
      const avatarBase64 = await this.userService.saveUserAvatar(
        payload.userid,
        avatarFile
      );
      console.log('✅ [uploadAvatar] saveUserAvatar执行完成');

      return {
        success: true,
        message: '头像上传成功',
        data: { avatar: avatarBase64 },
      };
    } catch (error) {
      console.error('❌ [uploadAvatar] 上传失败:', error);
      return {
        success: false,
        message: error.message || '头像上传失败',
      };
    }
  }

  @Post('/delete-photo')
  async deletePhoto(
    @Headers('authorization') authHeader: string,
    @Body() body: { photoIndex: number }
  ) {
    console.log('🚀 [deletePhoto] 接收到删除照片请求');
    console.log('🚀 [deletePhoto] photoIndex:', body.photoIndex);

    try {
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        console.error('❌ [deletePhoto] 缺少认证令牌');
        return {
          success: false,
          message: '缺少认证令牌',
        };
      }

      const token = authHeader.substring(7);
      const payload = await this.userService.validateToken(token);
      console.log('✅ [deletePhoto] 用户验证成功:', payload);

      if (typeof body.photoIndex !== 'number' || body.photoIndex < 0) {
        console.error('❌ [deletePhoto] 无效的照片索引');
        return {
          success: false,
          message: '无效的照片索引',
        };
      }

      // 删除指定索引的照片
      console.log('🚀 [deletePhoto] 调用deleteUserPhoto方法...');
      const result = await this.userService.deleteUserPhoto(
        payload.userid,
        body.photoIndex
      );
      console.log('✅ [deletePhoto] deleteUserPhoto执行完成');

      return {
        success: true,
        message: '照片删除成功',
        data: result,
      };
    } catch (error) {
      console.error('❌ [deletePhoto] 删除失败:', error);
      return {
        success: false,
        message: error.message || '照片删除失败',
      };
    }
  }
}
