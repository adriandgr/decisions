console.log('hi');
const ejs         = require('ejs');
const fs          = require('fs');
const str         = fs.readFileSync('pollend.ejs', 'utf8');
const mailgun     = require('mailgun-js')({
  apiKey: process.env.MG_KEY,
  domain: process.env.MG_DOMAIN
});

module.exports = knex => {
  return {
    sendResult:
      id => {
        knex('polls')
          .join('voters', 'polls.id', 'voters.poll_id')
          .where('polls.admin_uuid', id)
          .select('polls.name', 'polls.created_by', 'voters.email', 'voters.voter_uuid')
          .returning(['polls.name', 'polls.created_by', 'voters.email', 'voters.voter_uuid'])
          .then(column => {
            column.forEach(pollInfo => {
              let messageHtml = ejs.render(str, pollInfo);
              console.log(messageHtml);
              let  data = {
                from: `Merge App <app@${process.env.MG_DOMAIN}>`,
                to: pollInfo.email,
                subject: 'String Interpolation Integrated',
                html: `${messageHtml}`
              };
              mailgun.messages().send(data, (error, body) => {
                console.log(body);
              });
            });
          });
      }
  };
};
