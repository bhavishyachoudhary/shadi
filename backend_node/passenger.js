// Passenger entry point for GoDaddy cPanel Node.js hosting.
const app = require('./server');

app.startServer();
module.exports = app;
