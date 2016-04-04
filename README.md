# libs-dogstatsd

A wrapper library of `node-dogstatsd`

```
npm install libs-dogstatsd
```

```
var dogstatsd = require('libs-dogstatsd')({
  HOST: 'localhost'
  PORT: 8125
  mock: false
})

var startTime = Date.now()
dogstatsd.increment('test')
dogstatsd.timing('test2', Date.now() - startTime);
dogstatsd.gauge('test3', 100)

const stats = dogstatsd.start();
stats.tick('test4');
```
