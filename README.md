# libs-dogstatsd

A wrapper library of `node-dogstatsd`

```
npm install libs-dogstatsd
```

```
dogstatsd = require('libs-dogstatsd')({
  HOST: 'localhost'
  PORT: 8125
  mock: false
})

dogstatsd.increment('test')
```
