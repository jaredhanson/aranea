module.exports = function() {
  
  return function all(url, cb) {
    process.nextTick(function() {
      return cb(null, true); // pass
    });
  }
}
