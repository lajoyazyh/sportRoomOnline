import { Provide, Inject } from '@midwayjs/core';
import { InjectEntityModel } from '@midwayjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@midwayjs/jwt';
import { User } from '../entity/user.entity';
import { RegisterDTO, LoginDTO, UpdateProfileDTO } from '../dto/user.dto';
import * as bcrypt from 'bcryptjs';

@Provide()
export class UserService {
  @InjectEntityModel(User)
  userModel: Repository<User>;

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
}
