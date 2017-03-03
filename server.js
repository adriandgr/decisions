"use strict";

require('dotenv').config();

const PORT        = process.env.PORT || 5000;
const ENV         = process.env.ENV || "development";
const express     = require("express");
const bodyParser  = require("body-parser");
const sass        = require("node-sass-middleware");
const path        = require('path');
const app         = express();

const knexConfig  = require("./knexfile");
const knex        = require("knex")(knexConfig[ENV]);
const morgan      = require('morgan');
const knexLogger  = require('knex-logger');

const mailgun     = require('mailgun-js')({
  apiKey: process.env.MG_KEY,
  domain: process.env.MG_DOMAIN
});

let poll_name = 'Where to have lunch?';
let poll_creator = "Donald";
let voter_url = "http://www.google.com/";

var data = {
  from: `Merge App <app@${process.env.MG_DOMAIN}>`,
  to: `${process.env.MG_TEST_TO}`,
  subject: 'String Interpolation2',
  text: 'Testing some Mailgun awesomness from node!',
  html: `${process.env.MG_INVITE_A}
  ${poll_name}
  ${process.env.MG_INVITE_B}
  ${poll_creator}
  ${process.env.MG_INVITE_C}
  ${voter_url}
  ${process.env.MG_INVITE_D}
  ${poll_creator}
  ${process.env.MG_INVITE_E}`
};
// SAMPLE mailgun send process:
mailgun.messages().send(data, function (error, body) {
  console.log(body);
});


// Seperated Routes for each Resource
const usersRoutes = require("./routes/users");

// Load the logger first so all (static) HTTP requests are logged to STDOUT
// 'dev' = Concise output colored by response status for development use.
//         The :status token will be colored red for server error codes, yellow for client error codes, cyan for redirection codes, and uncolored for all other codes.
app.use(morgan('dev'));

// Log knex SQL queries to STDOUT as well
app.use(knexLogger(knex));

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(sass({
  src: path.join(__dirname, '/sass'),
  dest: path.join(__dirname, '/public/styles'),
  debug: true,
  outputStyle: 'expanded',
  prefix: '/styles'
}));
app.use(express.static("public"));

// Mount all resource routes
app.use("/api/users", usersRoutes(knex));

// Home page
// app.get("/", (req, res) => {
//   res.render("index");
// });

app.get('/polls/:id', (req, res) => {
  //logic here to find poll with :id
  if(req.params.id === '1'){
    res.send('okay!');
  } else {
    res.status(404);
  }
  // res.status(200).json({poll: {
  //   name:
  //   created:
  //   ...
  // } })
})

app.listen(PORT, () => {
  console.log("Example app listening on port " + PORT);
});
