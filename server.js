"use strict";

require('dotenv').config();



const PORT        = process.env.PORT || 8080;
const ENV         = process.env.ENV || "development";
const express     = require("express");
const bodyParser  = require("body-parser");
const path        = require('path');
const sass        = require("node-sass-middleware");
const ejs         = require('ejs');
const fs          = require('fs');


const app         = express();

const knexConfig  = require('./knexfile');
const knex        = require('knex')(knexConfig[ENV]);
const winston     = require('winston');
const morgan      = require('morgan');
const knexLogger  = require('knex-logger');


const db          = require('./db/lib/helpers.js')(knex);
const mailgun     = require('./routes/util/email')(knex);

// Seperated Routes for each Resource
const pollsRoutes = require('./routes/polls');
const adminsRoutes = require('./routes/admins');

winston.level = process.env.LOG_LEVEL || 'debug';

// create a write stream (in append mode)
var accessLogStream = fs.createWriteStream(path.join(__dirname, 'morgan.log'), {flags: 'a'});

// setup the logger
app.use(morgan('[:status] :date[clf] - :method :url HTTP :http-version :response-time', {stream: accessLogStream}));


if (ENV === 'development') {
  // Load the logger first so all (static) HTTP requests are logged to STDOUT
  // 'dev' = Concise output colored by response status for development use.
  //         The :status token will be colored red for server error codes, yellow for client error codes, cyan for redirection codes, and uncolored for all other codes.
  //app.use(morgan('dev'));
  // Log knex SQL queries to STDOUT as well
  app.use(knexLogger(knex));
}


app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use("/styles", sass({
  src: __dirname + "/styles",
  dest: __dirname + "/public/styles",
  debug: true,
  outputStyle: 'expanded'
}));
app.use(express.static('public'));



// Mount all resource routes
app.use('/polls', pollsRoutes(db, knex));
app.use('/admins', adminsRoutes(db, knex, mailgun));
// Home page

// app.get('/', (req, res) => {
//   res.render('index');
// });


app.get("/", (req, res) => {
  res.render("index");
});

app.listen(PORT, () => {
  console.log("Example app listening on port " + PORT);
});

