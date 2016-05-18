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

  // override to consume 'value'
  client.increment = (stat, value, sampleRate, tags) => {
    client.update_stats(stat, value || 1, sampleRate, tags);
  };

  client.start = () => {
    var startTime = Date.now();
    return {
      tick: (stat, num, _sampleRate, _tags) => {
        const count = num || 1;
        const sampleRate = _sampleRate || 1;
        const tags = _tags || null;
        if (isNaN(count)) {
          logger.error('tick second arg must be number.');
          return;
        }
        if (isNaN(sampleRate)) {
          logger.error('tick third arg must be number.');
          return;
        }
        if (!(Array.isArray(tags) || tags == null)) {
          logger.error('tick fourth arg must be array or null.');
          return;
        }

        client.increment(stat + '.count', count, sampleRate, tags);
        client.timing(stat + '.time', Date.now() - startTime, sampleRate, tags);
      }
    }
  };

  client.wrap = function(fn, stat) {
    return function() {
      const cb = arguments[arguments.length - 1];
      const stats = client.start();
      if ('function' === typeof cb) {
        arguments[arguments.length - 1] = function() {
          stats.tick(stat);
          return cb.apply(this, arguments);
        };
        return fn.apply(this, arguments);
      } else {
        const ret = fn.apply(this, arguments);
        stats.tick(stat);
        return ret;
      }
    }
  };

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
};
