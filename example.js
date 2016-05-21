var spSystemdUnit = require('./index.js')
var fs = require('fs')

fs.createReadStream('fixtures/nfs.service')
.pipe(spSystemdUnit())
.on('data', function (d) {
  console.log(d);
})
.on('end', function () {
  console.log('\n\n');
  console.log('\n\n');
  spSystemdUnit
  .parseFile('fixtures/nfs.service')
  .on('data', function (service) {
    console.log(service);
  });
})
