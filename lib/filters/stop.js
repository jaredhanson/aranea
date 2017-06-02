module.exports = function(filter) {
  
  return function pass(url, referer, rel, rev, type, cb) {
    function ncb(err, rv) {
      cb(err, !rv);
    }
    
    try {
      var arity = filter.length;
      if (arity == 6) {
        filter(url, referrer, rel, rev, type, ncb);
      } else if (arity == 5) {
        filter(url, referrer, rel, rev, ncb);
      } else if (arity == 4) {
        filter(url, referrer, rel, ncb);
      } else if (arity == 3) {
        filter(url, referer, ncb);
      } else {
        filter(url, ncb);
      }
    } catch (ex) {
      ncb(ex);
    }
  }
}
