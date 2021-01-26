'use strict';

//======= Create server =========//
const express = require('express');
const cors = require('cors');
const superagent = require('superagent');
require('dotenv').config();

//======= Setup Application Server =====//
const app = express();
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname + '/public')); //https://stackoverflow.com/questions/48248832/stylesheet-not-loaded-because-of-mime-type
app.set('view engine', 'ejs');


//======= Global Variables =======//
const PORT = process.env.PORT || 3111;

//======= Routes ======//
app.get('/', getStarted);
app.get('/book-search', getBookSearchForm);
app.post('/author-search', authorSearch);

//======= Helper Functions =====//
function getStarted(req, res) {
  res.render('./pages/index.ejs');
}

function authorSearch(req, res) {
  const author = req.body.author;
  console.log(author);
  const url = `https://www.googleapis.com/books/v1/volumes?q=+inauthor:${author}&maxResults=1`;//+intitle:
  superagent.get(url).then(authorSearch => {
    console.log(authorSearch.body.items[0].volumeInfo);
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

function Book(bookObj) {
  this.title = bookObj.volumeInfo.title;
  this.author = bookObj.volumeInfo.authors[0];
  this.description = bookObj.description;
  this.image = 'https://i.imgur.com/J5LVHEL.jpg'; //bookObj.imageLinks.smallThumbnail;

}

//======= Start Server =====//
app.listen(PORT, console.log(`We are here on ${PORT}!`));