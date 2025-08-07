const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(
    'ws',
    createProxyMiddleware({
      target: 'http://3.39.234.47:8081',
      ws: true,
    })
  );
};