-- create TABLE person(
--   id SERIAL PRIMARY KEY,
--   name VARCHAR(255),
--   surname VARCHAR(255)
-- );

-- create TABLE post(
--   id SERIAL PRIMARY KEY,
--   title VARCHAR(255),
--   content VARCHAR(255),
--   user_id INTEGER,
--   FOREIGN KEY (user_id) REFERENCES person (id)
-- );

CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255),
  is_activated BOOLEAN DEFAULT FALSE,
  activation_link VARCHAR(255)
);

CREATE TABLE token (
  id SERIAL PRIMARY KEY,
  user_id INTEGER,
  refresh_token VARCHAR(255) NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users (id)
);