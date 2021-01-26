DROP TABLE IF EXISTS bookshelf;

CREATE TABLE bookshelf(
  id SERIAL PRIMARY KEY,
  author VARCHAR(255),
  title VARCHAR(255),
  isbn VARCHAR(255),
  image_url VARCHAR(255),
  description TEXT
);

-- insert into heroku: `heroku pg:psql -f schema.sql --app your-heroku-app-name-here`.

