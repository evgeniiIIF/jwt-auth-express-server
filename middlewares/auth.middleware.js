import { ApiError } from '../exceptions/api.error.js';
import { tokenService } from '../services/token.service.js';

export const authMiddleware = function (req, res, next) {
  try {
    const authHeder = req.headers.authorization;
    if (!authHeder) {
      return next(ApiError.UnauthorizedError());
    }
    const accessToken = authHeder.split(' ')[1];
    if (!accessToken) {
      return next(ApiError.UnauthorizedError());
    }
    const userData = tokenService.validateAccessToken(accessToken);
    if (!userData) {
      return next(ApiError.UnauthorizedError());
    }
    req.user = userData;
    next();
  } catch (error) {
    return next(ApiError.UnauthorizedError());
  }
};
