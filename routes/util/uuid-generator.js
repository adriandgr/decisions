module.exports = function uuidGen() {
  let hash = (Math.random() + 1).toString(36).substring(2, 12);
  return hash;
};
