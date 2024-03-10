import { Router } from 'express';
import { userController } from '../controller/user.controller.js';

export const userRouter = new Router();

userRouter.post('/user', userController.createUser);
userRouter.get('/user', userController.getUsers);
userRouter.get('/user/:id', userController.getOneUser);
userRouter.put('/user', userController.updateUser);
userRouter.delete('/user/:id', userController.deleteUser);
