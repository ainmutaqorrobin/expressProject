module.exports = (fn) => {
  return (request, respond, next) => {
    fn(request, respond, next).catch(next);
  };
};
