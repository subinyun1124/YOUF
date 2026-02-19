import { Platform } from 'react-native';

const url =
  Platform.OS === 'android'
    ? 'http://10.0.2.2:8081'
    : 'http://localhost:8081';

const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(
    'ws',
    createProxyMiddleware({
      target: url,
      ws: true,
    })
  );
};