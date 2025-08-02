import { Provide, Inject } from '@midwayjs/core';
import { InjectEntityModel } from '@midwayjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@midwayjs/jwt';
import { User } from '../entity/user.entity';
import { RegisterDTO, LoginDTO, UpdateProfileDTO } from '../dto/user.dto';
import * as bcrypt from 'bcryptjs';
import * as fs from 'fs';

@Provide()
export class UserService {
  @InjectEntityModel(User)
  userModel: Repository<User>;
  // Repository提供的常用方法：
  // - find(): 查询多条记录
  // - findOne(): 查询单条记录
  // - save(): 保存记录
  // - update(): 更新记录
  // - delete(): 删除记录
  // - create(): 创建实体对象

  @Inject()
  jwtService: JwtService;

  async getUser(options: { uid: number }): Promise<any> {
    const user = await this.userModel.findOne({
      where: { userid: options.uid },
    });
    if (!user) return null;

    return {
      userid: user.userid,
      username: user.username,
      email: user.email,
      phone: user.phone,
      nickname: user.nickname,
      name: user.name,
      age: user.age,
      gender: user.gender,
      height: user.height,
      weight: user.weight,
      bodyType: user.bodyType,
      avatar: user.avatar,
      photos: user.photos ? JSON.parse(user.photos) : [],
      createdAt: user.createdAt,
    };
  }

  async register(userData: RegisterDTO): Promise<any> {
    // 检查用户名是否已存在
    const existingUser = await this.userModel.findOne({
      where: { username: userData.username },
    });

    if (existingUser) {
      return false; // 用户名已存在
    }

    // 加密密码
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(userData.password, saltRounds);

    // 创建新用户
    const newUser = this.userModel.create({
      username: userData.username,
      password: hashedPassword,
      email: userData.email,
      phone: userData.phone,
      isActive: true,
    });

    // 保存到数据库
    const savedUser = await this.userModel.save(newUser);

    // 返回用户信息（不包含密码）
    return {
      userid: savedUser.userid,
      username: savedUser.username,
      email: savedUser.email,
      phone: savedUser.phone,
      createdAt: savedUser.createdAt,
    };
  }

  async login(loginData: LoginDTO): Promise<any> {
    const user = await this.userModel.findOne({
      where: { username: loginData.username },
    });

    if (!user) {
      throw new Error('用户名或密码错误');
    }

    const isPasswordValid = await bcrypt.compare(
      loginData.password,
      user.password
    );
    if (!isPasswordValid) {
      throw new Error('用户名或密码错误');
    }

    if (!user.isActive) {
      throw new Error('账户已被禁用');
    }

    // 生成真实的 JWT token
    const token = await this.jwtService.sign({
      userid: user.userid,
      username: user.username,
    });

    return {
      token,
      user: {
        userid: user.userid,
        username: user.username,
        email: user.email,
        phone: user.phone,
        createdAt: user.createdAt,
      },
    };
  }

  // 验证 token 的方法
  async validateToken(token: string): Promise<any> {
    try {
      const payload = await this.jwtService.verify(token);
      return payload;
    } catch (error) {
      throw new Error('无效的认证令牌');
    }
  }

  // 更新用户Profile信息
  async updateProfile(
    userid: number,
    profileData: UpdateProfileDTO
  ): Promise<any> {
    const user = await this.userModel.findOne({
      where: { userid: userid },
    });

    if (!user) {
      throw new Error('用户不存在');
    }

    // 更新用户信息
    await this.userModel.update(userid, {
      nickname: profileData.nickname,
      name: profileData.name,
      age: profileData.age,
      gender: profileData.gender,
      height: profileData.height,
      weight: profileData.weight,
      bodyType: profileData.bodyType,
      avatar: profileData.avatar,
    });

    // 返回更新后的用户信息
    return await this.getUser({ uid: userid });
  }

  async saveUserPhotos(userid: number, files: any[]): Promise<string[]> {
    const photoBase64s: string[] = [];

    // 将每个文件转换为base64
    for (const file of files) {
      // 检查文件大小 (限制5MB)
      if (file.data.length > 5 * 1024 * 1024) {
        throw new Error('文件大小不能超过5MB');
      }

      // 检查文件类型
      const allowedTypes = [
        'image/jpeg',
        'image/jpg',
        'image/png',
        'image/gif',
      ];
      if (!allowedTypes.includes(file.mimeType)) {
        throw new Error('只支持 JPG、PNG、GIF 格式的图片');
      }

      // 读取文件并转换为base64
      const buffer = fs.readFileSync(file.data);
      const base64 = `data:${file.mimeType};base64,${buffer.toString(
        'base64'
      )}`;
      photoBase64s.push(base64);
    }

    // 获取用户现有照片
    console.log('🔍 [saveUserPhotos] 获取用户现有照片...');
    const user = await this.userModel.findOne({ where: { userid } });
    let existingPhotos: string[] = [];
    if (user?.photos) {
      try {
        existingPhotos = JSON.parse(user.photos);
        console.log('🔍 [saveUserPhotos] 现有照片数量:', existingPhotos.length);
      } catch (e) {
        console.error('❌ [saveUserPhotos] 解析现有照片失败:', e);
        existingPhotos = [];
      }
    } else {
      console.log('🔍 [saveUserPhotos] 用户暂无照片');
    }

    // 合并新照片和现有照片 (限制最多6张)
    const allPhotos = [...existingPhotos, ...photoBase64s].slice(0, 6);
    console.log('🔍 [saveUserPhotos] 合并后照片总数:', allPhotos.length);

    // 更新数据库
    console.log('🔍 [saveUserPhotos] 准备更新数据库...');
    await this.userModel.update(userid, {
      photos: JSON.stringify(allPhotos),
    });
    console.log('✅ [saveUserPhotos] 数据库更新成功');

    console.log(
      '🔍 [saveUserPhotos] 返回新上传的照片数量:',
      photoBase64s.length
    );
    return photoBase64s;
  }

  async saveUserAvatar(userid: number, file: any): Promise<string> {
    console.log('🔍 [saveUserAvatar] 开始处理头像上传');
    console.log('🔍 [saveUserAvatar] userid:', userid);
    console.log('🔍 [saveUserAvatar] file:', {
      filename: file.filename,
      mimeType: file.mimeType,
      size: file.data?.length || 'unknown',
    });

    // 检查文件大小 (限制2MB)
    if (file.data.length > 2 * 1024 * 1024) {
      console.error('❌ [saveUserAvatar] 文件太大:', file.filename);
      throw new Error('头像文件大小不能超过2MB');
    }

    // 检查文件类型
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
    if (!allowedTypes.includes(file.mimeType)) {
      console.error('❌ [saveUserAvatar] 文件类型不支持:', file.mimeType);
      throw new Error('只支持 JPG、PNG、GIF 格式的头像');
    }

    // 读取文件并转换为base64
    const buffer = fs.readFileSync(file.data);
    const base64 = `data:${file.mimeType};base64,${buffer.toString('base64')}`;
    console.log('✅ [saveUserAvatar] 头像转换成功，base64长度:', base64.length);

    // 更新数据库中的头像字段
    console.log('🔍 [saveUserAvatar] 准备更新数据库...');
    await this.userModel.update(userid, {
      avatar: base64,
    });
    console.log('✅ [saveUserAvatar] 数据库更新成功');

    return base64;
  }

  async deleteUserPhoto(userid: number, photoIndex: number): Promise<string[]> {
    console.log('🔍 [deleteUserPhoto] 开始删除照片');
    console.log('🔍 [deleteUserPhoto] userid:', userid);
    console.log('🔍 [deleteUserPhoto] photoIndex:', photoIndex);

    // 获取用户现有照片
    const user = await this.userModel.findOne({ where: { userid } });
    if (!user) {
      throw new Error('用户不存在');
    }

    let existingPhotos: string[] = [];
    if (user.photos) {
      try {
        existingPhotos = JSON.parse(user.photos);
        console.log(
          '🔍 [deleteUserPhoto] 现有照片数量:',
          existingPhotos.length
        );
      } catch (e) {
        console.error('❌ [deleteUserPhoto] 解析现有照片失败:', e);
        throw new Error('照片数据格式错误');
      }
    }

    // 检查索引是否有效
    if (photoIndex >= existingPhotos.length) {
      throw new Error('照片索引超出范围');
    }

    // 删除指定索引的照片
    existingPhotos.splice(photoIndex, 1);
    console.log('🔍 [deleteUserPhoto] 删除后照片数量:', existingPhotos.length);

    // 更新数据库
    console.log('🔍 [deleteUserPhoto] 准备更新数据库...');
    await this.userModel.update(userid, {
      photos: JSON.stringify(existingPhotos),
    });
    console.log('✅ [deleteUserPhoto] 数据库更新成功');

    return existingPhotos;
  }
}
