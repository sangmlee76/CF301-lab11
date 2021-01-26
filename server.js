'use strict';

//======= Create server =========//
const express = require('express');
const cors = require('cors');
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
app.get('/searches/new', getBookSearchForm);

//======= Helper Functions =====//
function getStarted(req, res) {
  res.render('./pages/index.ejs');
}

function getBookSearchForm(req, res) {
  res.render('./pages/searches/new.ejs');
}

//======= Start Server =====//
app.listen(PORT, console.log(`We are here on ${PORT}!`));