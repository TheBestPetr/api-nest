import { InjectModel } from '@nestjs/mongoose';
import {
  RefreshTokenEntity,
  RefreshTokenBlacklistModelType,
} from '../domain/refresh.token.entity';

export class RefreshTokenRepository {
  constructor(
    @InjectModel(RefreshTokenEntity.name)
    private RefreshTokenBlacklistModel: RefreshTokenBlacklistModelType,
  ) {}
  async addTokenInBlacklist(token: string) {
    await this.RefreshTokenBlacklistModel.create({ token: token });
  }

  async isTokenInBlacklist(token: string): Promise<boolean> {
    const isTokenExist = await this.RefreshTokenBlacklistModel.findOne({
      token: token,
    }).exec();
    return !!isTokenExist;
  }
}
