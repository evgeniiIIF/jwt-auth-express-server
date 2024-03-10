import { pool as db } from '../db.js';

class PostController {
  async createPost(req, res) {
    const { title, content, user_id } = req.body;
    console.log(title, content);
    const newPost = await db.query(
      'INSERT INTO post (title, content, user_id) values ($1, $2, $3) RETURNING *',
      [title, content, user_id]
    );
    res.json({ data: newPost.rows });
  }

  async getPostByUser(req, res) {
    const id = req.query.id;
    const posts = await db.query('SELECT * FROM post where user_id = $1', [id]);
    res.json({ data: posts.rows });
  }
}

export const postController = new PostController();
