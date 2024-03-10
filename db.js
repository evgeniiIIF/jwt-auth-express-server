import pg from 'pg';
const { Pool } = pg;

// export const pool = new Pool({
//   user: 'jon',
//   password: 'gta234vs',
//   port: 5432,
//   database: 'usersdb',
// });

export const pool = new Pool({
  user: 'jon',
  password: 'gta234vs',
  port: 5432,
  database: 'jwtauth',
});
