var miss  = require('mississippi');
var split = require('split');
var fs    = require('fs')

function spSystemdUnit () {
  var stream = miss.through.obj(function transform (chunk, env, cb) {
    chunk = chunk.toString();
    var ret;
    if (chunk.match(/^\s*#/)) {
      // # some comments
      ret = {
        type: 'comment',
        chunk: chunk,
        content: chunk.match(/^\s*#\s*(.*)/)[1]
      }
    } else if (chunk.match(/^\s*\[[^\]]+\]/)) {
      // [Unit]
      ret = {
        type: 'section',
        chunk: chunk,
        content: chunk.match(/^\s*\[([^\]]+)\]/)[1]
      }
    } else if (chunk.match(/^\s*[^=]+=.+/)) {
      // Property=value
      ret = {
        type: 'property',
        chunk: chunk,
        content: chunk.match(/^\s*([^=]+=.+)/)[1],
        name: chunk.match(/^\s*([^=]+)=.+/)[1],
        value: chunk.match(/^\s*[^=]+=(.+)/)[1]
      }
    }
    cb(null, ret)
  });
  return miss.pipeline.obj(split(), stream);
}

spSystemdUnit.objParser = function (options) {
  var currentComment;
  var currentSection;
  var stream = miss.through.obj(function transform (chunk, env, cb) {
    if (chunk.type=='comment') {
      if(!currentComment) currentComment = '';
      currentComment += chunk.comment + '\n';
    } else {
      if (currentComment) {
        this.push({
          type: chunk.type,
          content: currentComment
        })
        currentComment = null;
      }
      if (chunk.type=='property') {
        if (!currentSection) this.emit('error', new Error('mal formed unit file, property without a section'))
        currentSection.push({
          type: chunk.type,
          name: chunk.name,
          value: chunk.value
        })
      } else if (chunk.type=='section') {
        if (currentSection) {
          this.push(currentSection)
          currentSection = null;
        }
        currentSection = [];
        currentSection.type = chunk.type;
        currentSection.name = chunk.content;
      } else {
        this.emit('error', new Error('Unknown type ' + chunk.type))
      }
    }
    cb(null);
  }, function flush (cb) {
    if (currentComment) this.push(currentComment);
    if (currentSection) this.push(currentSection);
    cb();
  })
  return stream;
}

spSystemdUnit.parseFile = function (fPath, options) {
  var parsedUnit = {};
  var stream = miss.through.obj(function transform (chunk, env, cb) {
    if (chunk.type==='section') {
      parsedUnit[chunk.name] = chunk.slice(0);
    }
    cb(null)
  }, function flush(cb) {
    this.push(parsedUnit);
    cb()
  })

  return fs.createReadStream(fPath)
  .pipe(spSystemdUnit())
  .pipe(spSystemdUnit.objParser())
  .pipe(stream)
}

module.exports = spSystemdUnit;
