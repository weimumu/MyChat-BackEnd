function loadRouters(app) {
  app.use(require('./users').routes());
  app.use(require('./friend').routes());
  app.use(require('./attributes').routes());
  app.use(require('./roles').routes());
  app.use(require('./dealMessage').routes());
  app.use(require('./unread_message').routes());
}

exports = module.exports = {
  loadRouters,
};
