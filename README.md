# sp-systemd-unit

Stream parser for systemd unit files

# Install

```sh
npm i @mh-cbon/sp-systemd-unit --save
```

# Usage
```js
var spSystemdUnit = require('@mh-cbon/sp-systemd-unit')
var fs = require('fs')

fs.createReadStream('fixtures/nfs.service')
.pipe(spSystemdUnit())
.on('data', function (d) {
  console.log(d);
})
// { type: 'section', chunk: '[Unit]', content: 'Unit' }
// { type: 'property',
//   chunk: 'Description=NFS client services',
//   content: 'Description=NFS client services',
//   name: 'Description',
//   value: 'NFS client services' }
// { type: 'property',
//   chunk: 'Before=remote-fs-pre.target',
//   content: 'Before=remote-fs-pre.target',
//   name: 'Before',
//   value: 'remote-fs-pre.target' }
// { type: 'property',
//   chunk: 'Wants=remote-fs-pre.target',
//   content: 'Wants=remote-fs-pre.target',
//   name: 'Wants',
//   value: 'remote-fs-pre.target' }
// { type: 'comment',
//   chunk: '# Note: we don\'t "Wants=rpc-statd.service" as "mount.nfs" will arrange to',
//   content: 'Note: we don\'t "Wants=rpc-statd.service" as "mount.nfs" will arrange to' }
// { type: 'comment',
//   chunk: '# start that on demand if needed.',
//   content: 'start that on demand if needed.' }
// { type: 'property',
//   chunk: 'Wants=rpc-statd-notify.service',
//   content: 'Wants=rpc-statd-notify.service',
//   name: 'Wants',
//   value: 'rpc-statd-notify.service' }
// { type: 'comment',
//   chunk: '# GSS services dependencies and ordering',
//   content: 'GSS services dependencies and ordering' }
// { type: 'property',
//   chunk: 'Wants=auth-rpcgss-module.service',
//   content: 'Wants=auth-rpcgss-module.service',
//   name: 'Wants',
//   value: 'auth-rpcgss-module.service' }
// { type: 'property',
//   chunk: 'After=rpc-gssd.service rpc-svcgssd.service gssproxy.service',
//   content: 'After=rpc-gssd.service rpc-svcgssd.service gssproxy.service',
//   name: 'After',
//   value: 'rpc-gssd.service rpc-svcgssd.service gssproxy.service' }
// { type: 'section', chunk: '[Install]', content: 'Install' }
// { type: 'property',
//   chunk: 'WantedBy=multi-user.target',
//   content: 'WantedBy=multi-user.target',
//   name: 'WantedBy',
//   value: 'multi-user.target' }
// { type: 'property',
//   chunk: 'WantedBy=remote-fs.target',
//   content: 'WantedBy=remote-fs.target',
//   name: 'WantedBy',
//   value: 'remote-fs.target' }


spSystemdUnit
.parseFile('fixtures/nfs.service')
.on('data', function (service) {
  console.log(service);
});
// { Unit: 
//    [ { type: 'property',
//        name: 'Description',
//        value: 'NFS client services' },
//      { type: 'property',
//        name: 'Before',
//        value: 'remote-fs-pre.target' },
//      { type: 'property',
//        name: 'Wants',
//        value: 'remote-fs-pre.target' },
//      { type: 'property',
//        name: 'Wants',
//        value: 'rpc-statd-notify.service' },
//      { type: 'property',
//        name: 'Wants',
//        value: 'auth-rpcgss-module.service' },
//      { type: 'property',
//        name: 'After',
//        value: 'rpc-gssd.service rpc-svcgssd.service gssproxy.service' } ],
//   Install:
//    [ { type: 'property',
//        name: 'WantedBy',
//        value: 'multi-user.target' },
//      { type: 'property', name: 'WantedBy', value: 'remote-fs.target' } ] }

```
