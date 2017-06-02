module.exports = function(filter) {
  
  return function pass(url, referer, rel, rev, type, cb) {
    try {
      var arity = filter.length;
      if (arity == 6) {
        filter(url, referrer, rel, rev, type, cb);
      } else if (arity == 5) {
        filter(url, referrer, rel, rev, cb);
      } else if (arity == 4) {
        filter(url, referrer, rel, cb);
      } else if (arity == 3) {
        filter(url, referer, cb);
      } else {
        filter(url, cb);
      }
    } catch (ex) {
      cb(ex);
    }
  }
}
