/**
 * WebWorkers can't be run from the file system for security reasons.
 * Express is used to locally host the resources.
 *
 * @author UP663652
 */

// Express is an open-source web framework for Node.js.
// See: http://expressjs.com/
const express = require('express');
const port = process.env.PORT || 1337;
const app = express();

// Host demo resources.
app.use(express.static(`${__dirname}/public`));

// Return index for all requests.
app.get('/', (req, res) => {
  res.sendFile(`${__dirname}/public/index.html`);
});

// Listen to defined port when started.
app.listen(port, () => console.log('Express started. Navigate to localhost:1337'));
