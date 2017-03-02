module.exports = function make(knex) {
  return {
    helper: () => { console.log('I\'m a helper function'); }
  };
};
