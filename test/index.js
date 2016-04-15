var dogstatsd = require('../');

module.exports = {

  setUp: (done) => {
    this.dogstatsd = dogstatsd({
      mock: true
    });
    done();
  },

  tearDown: (done) => {
    done();
  },

  test1: (test) => {
    this.dogstatsd.increment('test');
    this.dogstatsd.increment('test', 1, ['tag']);
    this.dogstatsd.incrementBy('test', 5, ['tag']);
    test.done();
  },

  test2: (test) => {
    this.dogstatsd.timing('test', 100);
    test.done();
  },

  test3: (test) => {
    this.dogstatsd.gauge('test', 100);
    test.done();
  },

  test4: (test) => {
    const stat = this.dogstatsd.start();
    setTimeout(() => {
      stat.tick('test');
      setTimeout(() => {
        stat.tick('test2');
        setTimeout(() => {
         stat.tick('test3', 5);
          test.done();
        }, 100);
      }, 100);
    }, 100);
  }
}