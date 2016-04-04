const dgram = require('dgram');

const StatsD = require('node-dogstatsd').StatsD;

module.exports = (config) => {

  if (config == null) {
    console.error("'config' is not specified.");
    config = {
      mock: true
    };
  }

  const mock = config.mock;
  const logger = config.logger || console;
  const host = config.HOST || 'localhost';
  const port = config.PORT || 8125;

  var socket = null;
  if (!mock) {
    socket = createSocket(logger);
  }
  const client = new StatsD(host, port, socket);

  if (mock) {
    client.send_data = (buf) => {
      logger.log(buf.toString());
    };
  }

  client.start = () => {
    var startTime = Date.now();
    return {
      tick: (stat) => {
        client.increment(stat + '.count');
        client.timing(stat + '.time', Date.now() - startTime);
      }
    }
  }

  return client;
};

createSocket = (logger) => {
  const socket = dgram.createSocket('udp4');
  if (socket) {
    socket.bind({exclusive:true});
    socket.on('error', (err) => {
     logger.error('Error in dogstatsd socket:', err);
    });
    socket.on('close', () => {
     logger.warn('A dogstatsd socket is closed');
    });
  }
  return socket;
}
