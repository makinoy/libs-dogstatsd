var dogstatsd = require('../');
var assert = require('assert');

describe('tests', () => {

  before('init', (done) => {
    this.dogstatsd = dogstatsd({
      mock: true
    });
    done();
  });

  // after('', (done) => {
  //   done();
  // });

  it('test1', (done) => {
    this.dogstatsd.increment('test');
    this.dogstatsd.increment('test');
    this.dogstatsd.increment('test', 1, ['tag']);
    this.dogstatsd.increment('test', 10, 1, ['tag']);
    done();
  });

  it('test2', (done) => {
    this.dogstatsd.timing('test', 100);
    done();
  });

  it('test3', (done) => {
    this.dogstatsd.gauge('test', 100);
    done();
  });

  it('test4', (done) => {
    const stat = this.dogstatsd.start();
    setTimeout(() => {
      stat.tick('test');
      setTimeout(() => {
        stat.tick('test2', 100);
        setTimeout(() => {
          stat.tick('test3', 100, 1);
          setTimeout(() => {
            stat.tick('test4', 100, 1, ['tag4']);
            done();
          }, 100);
        }, 100);
      }, 100);
    }, 100);
  });

  it('test5', (done) => {
    const wrapped = this.dogstatsd.wrap((a, b, c) => {
      // heavy process
      assert.equal(a, 'a');
      assert.equal(b, 'b');
      assert.equal(c, 'c');
    }, 'test3');
    wrapped('a', 'b', 'c');

    const wrapped2 = this.dogstatsd.wrap((a, cb) => {
      assert.equal(a, 'a');
      setTimeout(() => {
        cb();
      }, 1000);
    }, 'test4');

    wrapped2('a', () => {
      done();
    });
  });

  it('test6', (done) => {
    const stat = this.dogstatsd.start();
    setTimeout(() => {
      let elapsed = stat.get_elapsed();
      assert.ok(elapsed >= 500);
      done();

    }, 500);

  });
});
