'use strict';

//======= Create server =========//
const express = require('express');
const superagent = require('superagent');
require('dotenv').config();
const pg = require('pg');
const methodOverride = require('method-override');

//======= Setup Application Server =====//
const app = express();
app.use(methodOverride('_method'));
app.use(express.urlencoded({ extended: true }));//allows us to make a search using req.body
app.use(express.static('./public'));
app.set('view engine', 'ejs');
const DATABASE_URL = process.env.DATABASE_URL;
const client = new pg.Client(DATABASE_URL);
client.on('error', (error) => console.log(error));


//======= Global Variables =======//
const PORT = process.env.PORT || 3111;


//======= Routes ======//
app.get('/', getBooksFromDatabase);
app.get('/books', getBookSearchForm);
app.post('/books', saveBook);
app.get('/books/:id', bookDetails);
app.post('/search', bookSearch);
app.put('/books/:id', updateBookDetails);
app.delete('/books/:id', deleteBook);

//======= Route Callbacks =====//
function getBooksFromDatabase(req, res) {
  const sqlQuery = 'SELECT * FROM bookshelf';
  client.query(sqlQuery).then(result => {
    const books = result.rows;
    res.render('./pages/index.ejs', { book: books });//assign result.rows to a varible so it stays the same everytime we need key: value pair.
  });
}

function bookSearch(req, res) {
  const searchQuery = req.body.searchQuery;
  const searchType = req.body.searchType;
  const url = `https://www.googleapis.com/books/v1/volumes?q=+in${searchType}:${searchQuery}&maxResults=5`;
  superagent.get(url).then(search => {
    const searchBookData = search.body.items.map(bookObj => new Book(bookObj));
    res.render('./pages/searches/show.ejs', { searchBookData: searchBookData });
  })
    .catch(error => {
      res.status(500).send('Google book api failed');
      console.log(error.message);
    });
}

function getBookSearchForm(req, res) {
  res.render('./pages/searches/new.ejs');
}

function saveBook(req, res) {

  const sqlQuery = 'INSERT INTO bookshelf(author, title, isbn, image, description) VALUES ($1, $2, $3, $4, $5) RETURNING ID';
  const sqlArray = [req.body.author, req.body.title, req.body.isbn, req.body.image, req.body.description];
  // console.log('****** REQ DOT BODY*****', req.body);
  client.query(sqlQuery, sqlArray)
    .then(result => {
      const books = result.rows;
      const id = books[0].id;
      res.redirect(`/books/${id}`);
    })
    .catch(error => {
      res.status(500).send('Failed to save book');
      console.log(error.message);
    });

}

function bookDetails(req, res) {
  const sqlQuery = 'SELECT * FROM bookshelf WHERE id = $1;';
  const sqlArray = [req.params.id];

  client.query(sqlQuery, sqlArray)
    .then(result => {
      const book = result.rows[0];
      res.render('./pages/books/detail.ejs', { book: book });
    })
    .catch(error => {
      res.status(500).send('Failed get book details');
      console.log(error.message);
    });

}

function updateBookDetails(req, res) {
  const sqlQuery = 'UPDATE bookshelf SET author=$1, title=$2, isbn=$3, image=$4, description=$5 WHERE id=$6;';
  const sqlArray = [req.body.author, req.body.title, req.body.isbn, req.body.image, req.body.description, req.params.id];
  client.query(sqlQuery, sqlArray)
    .then(() => {
      res.redirect(`/books/${req.params.id}`);
    })
    .catch(error => {
      res.status(500).send('Failed to update book.');
      console.log(error.message);
    });
}

function deleteBook(req, res) {
  const sqlQuery = 'DELETE FROM bookshelf WHERE id=$1;';
  const sqlArray = [req.params.id];
  client.query(sqlQuery, sqlArray)
    .then(() => {
      res.redirect('/');
    })
    .catch(error => {
      res.status(500).send('Failed to delete book.');
      console.log(error.message);
    });
}

//======= Helper Functions =====//

function Book(bookObj) {
  this.title = bookObj.volumeInfo.title;
  this.author = bookObj.volumeInfo.authors ? bookObj.volumeInfo.authors.join(', ') : 'Unknown';
  this.isbn = `${bookObj.volumeInfo.industryIdentifiers[0].type} ${bookObj.volumeInfo.industryIdentifiers[0].identifier}`;
  this.description = bookObj.volumeInfo.description;
  this.image = bookObj.volumeInfo.imageLinks ? bookObj.volumeInfo.imageLinks.thumbnail : 'https://i.imgur.com/J5LVHEL.jpg';
}

//======= Start Server =====//
client.connect().then(() => {
  app.listen(PORT, console.log(`We are here on ${PORT}`));
}).catch(error => console.error(error)); //this catch is redundant, should NEVER happen
