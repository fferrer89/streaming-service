const environment = {
  development: {
    mongoUrl: 'mongodb://localhost:27017/streaming-service',
  },
  production: {
    mongoUrl: 'mongodb://user:pass@example.com:1234/streaming-service',
  },
};

export default environment;
