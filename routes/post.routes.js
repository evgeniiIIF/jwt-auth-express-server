import { Router } from 'express';
import { postController } from '../controller/post.controller.js';

export const postRouter = new Router();

postRouter.post('/post', postController.createPost);
postRouter.get('/post', postController.getPostByUser);
