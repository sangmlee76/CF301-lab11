# Open Shelf (Google Book API Search)

**Author**: Sang Lee and Jason Dormier
**Version**: 1.2.0

## Overview
Create a basic full-stack application for a book list which will include the ability to search the Google Books API, add books to a database, and then render those books from a PostgreSQL database.

## Getting Started
- Install npm install -s express esj dotenv superagent pg
- Create a .env file with PORT=3000
- Connect to pg database and table; database name = open_shelf, table (relation) = bookshelf
- Resources:
  + github repo: https://github.com/sangmlee76/CF301-lab11
  + heroku app: https://open-shelf-book-search.herokuapp.com/

## Architecture
Javascript, HTML, CSS, express, ejs, cors, superagent, pg

## Change Log
25 Jan 21 22:30 - Set up framework for the app including heroku deployment
26 Jan 21 22:30 - Set up database with ability to add data to our database but unable to pull book details
27 Jan 21 20:50 - app functionality complete; able to search, save, update, and delete using RESTful server principles

## Credits and Collaborations
- In class code review and TA support
- Answering the question: "how to retrieve just saved id from psql database"
  + https://stackoverflow.com/questions/2944297/postgresql-function-for-last-inserted-id
  + const sqlQuery = 'INSERT INTO bookshelf(title) VALUES ($1) RETURNING ID';

## Time Estimates:

1. **Number and name of feature**: Feature 1. As a user, I want to update the details of a book so that it displays the way I want it to, according to my personalized preferences.

Estimate of time needed to complete: __4 hrs___

Start time: _13:30__

Finish time: _17:30__

Actual time needed to complete: __4 hrs___


2. **Number and name of feature**: Feature 2. As a user, I want to remove books from my collection so that it accurately represents my favorite books.

Estimate of time needed to complete: _3 hrs____

Start time: _17:30____

Finish time: _20:00____

Actual time needed to complete: __2.5 hrs___
