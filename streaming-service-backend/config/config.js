const environment = {
  development: {
    mongoUrl: 'mongodb+srv://marcos:WXgAl20LBjRb49b8@cluster0.ofr2q.mongodb.net/streaming-service?retryWrites=true&w=majority&appName=Cluster0',
  },
  production: {
    mongoUrl: 'mongodb://user:pass@example.com:1234/streaming-service',
  },
};

export default environment;
