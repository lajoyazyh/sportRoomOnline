import { Controller, Get, Query } from '@midwayjs/core';

@Controller('/')
export class HomeController {
  @Get('/')
  async home(): Promise<string> {
    return 'Hello Midwayjs!';
  }

  @Get('/view')
  public async view(): Promise<string> {
    return 'Hello Midwayjs!';
  }

  // @Get('/register')
  // public async register(
  //   @Query('username') username: string,
  //   @Query('password') password: string
  // ): Promise<boolean> {
  //   console.log(username, password);
  //   return true;
  // }
}
