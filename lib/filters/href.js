var uriTemplate = require('uri-templates');


module.exports = function(list) {
  list = list || []
  
  var i, len;
  for (i = 0, len = list.length; i < len; ++i) {
    // TODO: Accept RegExp as well as string here.
    list[i] = uriTemplate(list[i]);
  }
  
  return function href(url, cb) {
    var match, i, len;
    for (i = 0, len = list.length; i < len; ++i) {
      match = list[i].fromUri(url);
      if (match) {
        return cb(null, true); // pass
        
      }
    }
    return cb(null, false); // reject
  }
}
