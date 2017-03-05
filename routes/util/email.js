const ejs         = require('ejs');
const fs          = require('fs');
var path          = require('path');
const str         = fs.readFileSync(path.join(__dirname, 'email-templates/pollend.ejs'), 'utf8');
const str_voters  = fs.readFileSync(path.join(__dirname, 'email-templates/createpollemail.ejs'), 'utf8');
const str_creators= fs.readFileSync(path.join(__dirname, 'email-templates/creatoremail.ejs'), 'utf8');
const mailgun     = require('mailgun-js')({
  apiKey: process.env.MG_KEY,
  domain: process.env.MG_DOMAIN
});


module.exports = knex => {
  return {
    send:
      id => {
        knex('polls')
          .join('voters', 'polls.id', 'voters.poll_id')
          .where('polls.admin_uuid', id)
          .select('polls.name', 'polls.created_by', 'voters.email', 'voters.voter_uuid')
          .returning(['polls.name', 'polls.created_by', 'voters.email', 'voters.voter_uuid'])
          .then(column => {
            column.forEach(pollInfo => {
              let messageHtml = ejs.render(str, pollInfo);
              let  data = {
                from: `Merge App <app@${process.env.MG_DOMAIN}>`,
                to: pollInfo.email,
                subject: 'Merge has ended!',
                html: `${messageHtml}`
              };
              mailgun.messages().send(data, (error, body) => {
                console.log(body);
              });
            });
          });
      },
    toAllVoters:
      (body, poll_id) => {
        let i = 0;
        knex('polls')
          .join('voters', 'polls.id', 'voters.poll_id')
          .where('voters.poll_id', poll_id)
          .select('voters.voter_uuid')
          .returning(['voter_uuid'])
          .then(totalUuid => {
            totalUuid.forEach(uuid => {
              let messageHtml = ejs.render(str_voters, {
                title: body.name,
                creator: body.created_by,
                voter: body.send_to[i],
                uuid: uuid.voter_uuid
              })
              let  data = {
                from: `Merge App <app@${process.env.MG_DOMAIN}>`,
                to: body.send_to[i].email,
                subject: 'You have a Merge request!',
                html: `${messageHtml}`
              };
              mailgun.messages().send(data, (error, body) => {
                console.log(body);
              });
              i ++;
            })
          })
      },
    toCreator:
      (body, poll_id) => {
        knex('polls')
          .where('polls.id', poll_id)
          .select('polls.admin_uuid')
          .returning('polls.admin_uuid')
          .then(uuid => {
            let messageHtml = ejs.render(str_creators, {
              title: body.name,
              email: body.creator_email,
              creator: body.created_by,
              uuid: uuid[0].admin_uuid
            })
            console.log(body.creator_email)
            let  data = {
              from: `Merge App <app@${process.env.MG_DOMAIN}>`,
              to: body.creator_email,
              subject: 'Thank you for creating this Merge!',
              html: `${messageHtml}`
            };
            mailgun.messages().send(data, (error, body) => {
              console.log(body);
            });
          })
      }

  }
};
