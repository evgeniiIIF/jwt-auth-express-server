import { Router } from 'express';
import { appController } from '../controller/app.controller.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';

export const appRouter = new Router();

appRouter.post('/registration', appController.registration);
appRouter.post('/login', appController.login);
appRouter.post('/logout', appController.logout);
appRouter.get('/activate/:link', appController.activate);
appRouter.get('/refresh', appController.refresh);
appRouter.get('/users', authMiddleware, appController.getUsers);
