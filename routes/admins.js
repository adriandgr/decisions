"use strict";

const express = require('express');
const route = express.Router();



module.exports = (db, knex, mailgun) => {

/*
    GET /admins/:uuid
 */
  route.get('/:uuid', (req, res) => {

    const response = {};

    db.retrieve.poll(req.params.uuid)
      .then(poll => {
        response['poll'] = poll;
        return poll.id;
      })
      .then(poll_id => {
        return db.retrieve.ranks(poll_id);
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
      // .then(ranks => {
      //   return db.retrieve.choices(poll_id);
      // })
      //     return db.retrieve.choices(poll_id);
      //   } else {
      //     return false;
      //   }
      // })
      // .then(choices => {
      //   if(choices) {
      //     response.choices = choices;
      //     res.json(response);
      //   } else {
      //     response.choices = { default: 'empty' };
      //     res.json(response);
      //   }
      //   // response['choices'] = results;
      //   // console.log(results);
      //   res.json(response);
      // })
      .catch(err => {
        res.json({Error: 'Encountered an error while attempting to render this page'});
      });


  });




/*
    POST /admins/:uuid


      Responsible for ending poll or updating poll title
 */
  route.post('/:uuid', (req, res) =>{
    console.log(req.body);
    if(req.body.method === 'end') {
      db.poll.end(req.params.uuid)
        .then(success => {
          if(success) {
            mailgun.sendResult(req.params.uuid);
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
