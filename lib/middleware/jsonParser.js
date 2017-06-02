var typeis = require('type-is');
var getBody = require('raw-body');


module.exports = function() {
  
  return function jsonParser(res, req, next) {
    // TODO: handle content encoding (gzip, etc)
    
    // TODO: Check mime types.  test what happens if we attempt to load GIF data.
    
    var opts = {
      //length: req.headers['content-length'] - 100,
      length: res.headers['content-length'],
      encoding: 'utf8'
    };
    
    //console.log('PARSING BODY: ' + res.headers['content-type']);
    //console.log(res.headers)
    
    if (!typeis(res, [ 'application/json' ])) {
      return next();
    }
    
    
    getBody(res, opts, function (err, body) {
      if (err) {
        var error = err;
        
        // Transform error messages, since this is used in Express and assumes request.
        // we have responses.
        switch (err.type) {
        case 'request.size.invalid':
          error = new Error('response size did not match content length');
          error.expected = err.expected;
          error.received = err.received;
          break;
        }
        return next(error);
      }
      
      
      res.body = JSON.parse(body);
      next();
    });
    
  }
}
