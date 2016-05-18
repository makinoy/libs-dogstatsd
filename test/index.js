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
    this.dogstatsd.increment('test', 10, 1, ['tag']);
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
        stat.tick('test2', 100);
        setTimeout(() => {
          stat.tick('test3', 100, 1);
          setTimeout(() => {
            stat.tick('test4', 100, 1, ['tag4']);
            test.done();
          }, 100);
        }, 100);
      }, 100);
    }, 100);
  },

  test5: (test) => {
    wrapped = this.dogstatsd.wrap((a, b, c) => {
      // heavy process
      test.equals(a, 'a');
      test.equals(b, 'b');
      test.equals(c, 'c');
    }, 'test3');
    wrapped('a', 'b', 'c');

    wrapped2 = this.dogstatsd.wrap((a, cb) => {
      test.equals(a, 'a');
      setTimeout(() => {
        cb();
      }, 1000);
    }, 'test4');

    wrapped2('a', () => {
      test.done();
    });
  }
};
