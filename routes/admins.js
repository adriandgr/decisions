"use strict";

const express = require('express');
const route = express.Router();
const fs          = require('fs');
const str         = fs.readFileSync('./routes/emailTemplatePollEnd.ejs', 'utf8');
const mailgun     = require('mailgun-js')({
  apiKey: process.env.MG_KEY,
  domain: process.env.MG_DOMAIN
});

module.exports = (db, knex, mailgun) => {

/*
    GET /admins/:uuid
 */
  route.get('/:uuid', (req, res) => {

    const response = {};

    db.retrieve.poll(req.params.uuid)
      .then(poll => {
        response['poll'] = poll;
        console.log('Row from retrieving poll', poll);
      })
      .then(poll_id => {
        console.log('PollID:', poll_id);
        return db.retrieve.choicesAndRanks(poll_id);
      })
      .then(results => {
        console.log('Choices and ranks:', results);
        response['choices'] = results;
        // if(req.xhr) {
          return res.json(response);
        // }
        // res.status(401).render('status', {
        //   status: {
        //     code: '401 Unauthorized',
        //     reason: 'You are not an authorized client.',
        //     forgot: false
        //   }
        // });
      })
      .catch(err => {
        console.error('Error retrieving poll:', err);
      });


  });


    //Send emails to existing voters
    // function sendEmail (){
    //   knex('polls')
    //   .join('voters', 'polls.id', 'voters.poll_id')
    //   .where('polls.admin_uuid', id)
    //   .select('polls.name','polls.created_by', 'voters.email', 'voters.voter_uuid')
    //   .returning(['polls.name', 'polls.created_by','voters.email', 'voters.voter_uuid'])
    //   .then(function(column) {
    //     column.forEach(pollInfo => {


    //       let messageHtml = ejs.render(str, pollInfo);
    //       console.log(messageHtml);
    //       let  data = {
    //         from: `Merge App <app@${process.env.MG_DOMAIN}>`,
    //         to: pollInfo.email,
    //         subject: 'String Interpolation Integrated',
    //         html: `${messageHtml}`
    //       }
    //       mailgun.messages().send(data, function (error, body) {
    //         console.log(body);
    //       });
    //     })
    //   })
    // }

    // sendEmail();


/*
    POST /admins/:uuid


      Responsible for ending poll or updating poll title
 */
  route.post('/:uuid', (req, res) =>{
    if(req.body.method === 'end') {
      db.poll.end(req.params.uuid)
        .then(success => {
          if(success) {
            res.json({end: true});
          } else {
            res.json({end: false});
          }
        });
    } else {
      db.poll.update(req.params.uuid, req.body.title)
        .then(success => {
          if(success) {
            res.json({update: true});
          } else {
            res.json({update: false});
          }
        });
    }

  });


  return route;
};
