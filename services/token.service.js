import { pool as db } from '../db.js';
// import * as jwt from 'jsonwebtoken';
import jwt from 'jsonwebtoken';

class TokenService {
  generateTokens(payload) {
    const accessToken = jwt.sign(payload, process.env.JWT_ACCESS_SECRET, { expiresIn: '30s' });
    const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_SECRET, { expiresIn: '10h' });
    return {
      accessToken,
      refreshToken,
    };
  }

  async saveToken(user_id, refreshToken) {
    const tokenData = await db.query('SELECT * FROM token where user_id = $1;', [user_id]);
    if (tokenData.rows.length) {
      const updatedTokenData = await db.query(
        'UPDATE token set refresh_token = $1 where user_id = $2 RETURNING *',
        [refreshToken, user_id]
      );
      return updatedTokenData;
    }
    const token = await db.query(
      'INSERT INTO token (user_id, refresh_token) values ($1, $2) RETURNING *',
      [user_id, refreshToken]
    );
    return token;
  }

  async removeToken(refreshToken) {
    const tokenData = await db.query('DELETE FROM token where refresh_token = $1', [refreshToken]);
    console.log(tokenData);
    return tokenData;
  }

  validateAccessToken(token) {
    try {
      const userData = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
      return userData;
    } catch (error) {
      return null;
    }
  }
  validateRefreshToken(token) {
    try {
      const userData = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
      return userData;
    } catch (error) {
      return null;
    }
  }

  async findToken(refreshToken) {
    const tokenData = (
      await db.query('SELECT * FROM token where refresh_token = $1;', [refreshToken])
    ).rows[0];
    return tokenData;
  }
}

export const tokenService = new TokenService();
