const startle = require('startle');
const { increment, gauge } = startle;
const { Server } = require('ws');

startle.onStart((opts, done) => {

  const server = new Server({ port: 9999 });

  server.on('connection', client => {

    client.on('message', msg => {

      increment('ws_handled');
      const now = Date.now();
      const payload = JSON.parse(msg);
      gauge('ws_requesttime', now - payload.timestamp);
      payload.timestamp = now;
      client.send(JSON.stringify(payload));

    });

  });

  server.on('listening', done);

});
