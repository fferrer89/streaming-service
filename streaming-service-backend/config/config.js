const environment = {
  development: {
    mongoUrl: 'mongodb://127.0.0.1:27017/streaming-service',
  },
  production: {
    mongoUrl: 'mongodb://user:pass@example.com:1234/streaming-service',
  },
};

export default environment;
