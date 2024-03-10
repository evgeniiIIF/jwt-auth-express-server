import { pool as db } from '../db.js';

class UserController {
  async createUser(req, res) {
    const { name, surname } = req.body;
    const newPerson = await db.query(
      'INSERT INTO person (name,surname) values ($1, $2) RETURNING *',
      [name, surname]
    );

    res.json({ data: newPerson.rows });
  }

  async getUsers(req, res) {
    const users = await db.query('SELECT * FROM person');
    console.log('users');
    res.json({ data: users.rows });
  }

  async getOneUser(req, res) {
    const id = req.params.id;
    const user = await db.query('SELECT * FROM person where id = $1;', [id]);
    res.json({ data: user.rows });
  }

  async updateUser(req, res) {
    const { id, name, surname } = req.body;
    const user = await db.query(
      'UPDATE person set name = $1, surname = $2 where id = $3 RETURNING *',
      [name, surname, id]
    );
    res.json({ data: user.rows });
  }
  async deleteUser(req, res) {
    const id = req.params.id;
    const user = await db.query('DELETE FROM person where id = $1', [id]);
    res.json({ data: user.rows });
  }
}

export const userController = new UserController();
