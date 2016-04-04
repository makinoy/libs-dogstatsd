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
    this.dogstatsd.increment('test');
    this.dogstatsd.increment('test', 1, ['tag']);
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
    this.dogstatsd.start();
    setTimeout(() => {
      this.dogstatsd.end('test');
      test.done();
    }, 100);
  },
}
