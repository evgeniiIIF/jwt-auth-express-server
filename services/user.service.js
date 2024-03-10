import { pool as db } from '../db.js';
import bcrypt from 'bcrypt';
import * as uuid from 'uuid';
import { mailService } from './mail.service.js';
import { tokenService } from './token.service.js';
import { UserDto } from '../dto/user.dto.js';
import { ApiError } from '../exceptions/api.error.js';

class UserService {
  async registration(email, password) {
    const candidate = (await db.query('SELECT * FROM users where email = $1;', [email])).rows;
    if (candidate.length) {
      throw ApiError.BadRequest(`Пользователь с таким ${email} существует`);
    }
    const hashPassword = await bcrypt.hash(password, 3);
    const activationLink = uuid.v4();
    const user = (
      await db.query(
        'INSERT INTO users (email, password, activation_link) values ($1, $2, $3) RETURNING *',
        [email, hashPassword, activationLink]
      )
    ).rows[0];
    // await mailService.sendActivationMail(email, activationLink);
    const userDto = new UserDto(user);
    const tokens = tokenService.generateTokens({ ...userDto });
    await tokenService.saveToken(userDto.id, tokens.refreshToken);
    return {
      ...tokens,
      user: userDto,
    };
  }

  async login(email, password) {
    const user = (await db.query('SELECT * FROM users where email = $1;', [email])).rows[0];
    if (!user) {
      throw ApiError.BadRequest(`Пользователь с таким ${email} не найден`);
    }
    const isPassEquals = await bcrypt.compare(password, user.password);
    if (!isPassEquals) {
      throw ApiError.BadRequest(`Неверный пароль`);
    }
    const userDto = new UserDto(user);
    const tokens = tokenService.generateTokens({ ...userDto });
    await tokenService.saveToken(userDto.id, tokens.refreshToken);
    return {
      ...tokens,
      user: userDto,
    };
  }

  async logout(refreshToken) {
    const token = await tokenService.removeToken(refreshToken);
    return token;
  }

  async refresh(refreshToken) {
    if (!refreshToken) {
      throw ApiError.UnauthorizedError();
    }
    const userData = tokenService.validateRefreshToken(refreshToken);
    const tokenFromDb = await tokenService.findToken(refreshToken);
    if (!userData || !tokenFromDb) {
      throw ApiError.UnauthorizedError();
    }
    const user = (await db.query('SELECT * FROM users where id = $1;', [userData.id])).rows[0];
    const userDto = new UserDto(user);
    const tokens = tokenService.generateTokens({ ...userDto });
    await tokenService.saveToken(userDto.id, tokens.refreshToken);
    return {
      ...tokens,
      user: userDto,
    };
  }

  async getAllUsers() {
    const users = (await db.query('SELECT * FROM users;')).rows;
    return users;
  }
}

export const userService = new UserService();
