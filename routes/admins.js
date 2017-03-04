"use strict";

const express = require('express');
const route = express.Router();
const fs          = require('fs');
const str         = fs.readFileSync('./routes/emailTemplatePollEnd.ejs', 'utf8');
const mailgun     = require('mailgun-js')({
  apiKey: process.env.MG_KEY,
  domain: process.env.MG_DOMAIN
});




module.exports = (db, knex, ejs) => {
  route.get('/:admin_uuid', (req, res) => {
    let id = req.params.admin_uuid;


    const response = {};
    //Receive all polls information & send to page
    function gettingChoicesNameRankTable() {
      knex('polls')
      .join('choices', 'polls.id', 'choices.poll_id')
      .join('votes', 'votes.choice_id', 'choices.id')
      .where('polls.admin_uuid', id)
      .select('choices.id', 'choices.name', 'rank')
      .then(function(rows) {
        response['rankTable'] = rows;
      })
      .catch(err => {
        throw err;
      });
    }

    gettingChoicesNameRankTable();

// Returns the full poll table
    function gettingPollsTable() {
      knex.select('*').from('polls')
      .where('admin_uuid', '=', id)
      .then(function(rows) {
        response['polls'] = rows;
        console.log(response);
        res.json(response);
      })
      .catch(err => {
        throw err;
      });
    }

    gettingPollsTable();

  });

  route.post('/:admin_uuid', (req, res) =>{
    let id = req.params.admin_uuid;

    //Needs to include Mailgun chain here upon submission, informing users polls have ended
    function checkActive () {
      knex('polls').where('polls.admin_uuid', '=', id).update('active', false);
    }
    checkActive();

    //Send emails to existing voters
    function sendEmail (){
      knex('polls')
      .join('voters', 'polls.id', 'voters.poll_id')
      .where('polls.admin_uuid', id)
      .select('polls.name','polls.created_by', 'voters.email', 'voters.voter_uuid')
      .returning(['polls.name', 'polls.created_by','voters.email', 'voters.voter_uuid'])
      .then(function(column) {
        column.forEach(pollInfo => {


          let messageHtml = ejs.render(str, pollInfo);
          console.log(messageHtml);
          let  data = {
            from: `Merge App <app@${process.env.MG_DOMAIN}>`,
            to: pollInfo.email,
            subject: 'String Interpolation Integrated',
            html: `${messageHtml}`
          }
          mailgun.messages().send(data, function (error, body) {
            console.log(body);
          });
        })
      })
    }

    sendEmail();


    function updateTitle() {
      //Change the name of the question to req.body
      knex('polls').where('polls.admin_uuid', '=', id).update('name', "Where do you want to eat")
      .then(function(rows) {
        res.json({success: true});
      });
    }


    updateTitle();
  });


  return route;
};

