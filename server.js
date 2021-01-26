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
app.use(express.static('./public')); //https://stackoverflow.com/questions/48248832/stylesheet-not-loaded-because-of-mime-type
app.set('view engine', 'ejs');
const DATABASE_URL = process.env.DATABASE_URL;
const client = new pg.Client(DATABASE_URL);
client.on('error', (error) => console.log(error));


//======= Global Variables =======//
const PORT = process.env.PORT || 3111;

//======= Routes ======//
app.get('/', getStarted);
app.get('/book-search', getBookSearchForm);
app.post('/search', bookSearch);

//======= Route Callbacks =====//
function getStarted(req, res) {
  res.render('./pages/index.ejs');
}

function bookSearch(req, res) {
  const searchQuery = req.body.searchQuery;
  const searchType = req.body.searchType;
  const url = `https://www.googleapis.com/books/v1/volumes?q=+in${searchType}:${searchQuery}&maxResults=5`;
  superagent.get(url).then(authorSearch => {
    const authorSearchBookData = authorSearch.body.items.map(bookObj => new Book(bookObj));
    res.render('./pages/searches/show.ejs', { authorSearchBookData: authorSearchBookData });
  })
    .catch(error => {
      res.status(500).send('Google book api failed');
      console.log(error.message);

    });
}

function getBookSearchForm(req, res) {
  res.render('./pages/searches/new.ejs');

}

//======= Helper Functions =====//
function Book(bookObj) {
  this.title = bookObj.volumeInfo.title;
  this.author = bookObj.volumeInfo.authors ? bookObj.volumeInfo.authors.join(', ') : 'Unknown';
  this.description = bookObj.volumeInfo.description;
  this.image = bookObj.volumeInfo.imageLinks ? bookObj.volumeInfo.imageLinks.thumbnail : 'https://i.imgur.com/J5LVHEL.jpg';

}

//======= Start Server =====//
client.connect().then(() => {
  app.listen(PORT, console.log(`We are here on ${PORT}!`));
}).catch(error => console.error(error)); //this catch is redundant, should NEVER happen
