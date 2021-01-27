'use strict';

//======= Create server =========//
const express = require('express');
const cors = require('cors');
const superagent = require('superagent');
require('dotenv').config();
const pg = require('pg');

//======= Setup Application Server =====//
const app = express();
app.use(cors());// not needed since front and back end are on the same server
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
app.get('/books/:id', bookDetails);
app.post('/search', bookSearch);

//======= Route Callbacks =====//
function getBooksFromDatabase(req, res) {
  const sqlQuery = 'SELECT * FROM bookshelf';
  client.query(sqlQuery).then(result => {
    res.render('./pages/index.ejs', { book: result.rows });
  });
}

function bookSearch(req, res) {
  const searchQuery = req.body.searchQuery;
  const searchType = req.body.searchType;
  const url = `https://www.googleapis.com/books/v1/volumes?q=+in${searchType}:${searchQuery}&maxResults=5`;
  superagent.get(url).then(search => {
    const searchBookData = search.body.items.map(bookObj => new Book(bookObj));

    const sqlQuery = 'INSERT INTO bookshelf(author, title, isbn, image_url, description) VALUES ($1, $2, $3, $4, $5)';

    for(let i=0; i<searchBookData.length; i++){
      const sqlArray = [searchBookData[i].title, searchBookData[i].author, searchBookData[i].image_url, searchBookData[i].isbn, searchBookData[i].description];
      client.query(sqlQuery, sqlArray);
    }

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

function bookDetails(req, res) {
  res.render('./pages/books/show.ejs');
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
  app.listen(PORT, console.log(`We are here on ${PORT}!`));
}).catch(error => console.error(error)); //this catch is redundant, should NEVER happen
