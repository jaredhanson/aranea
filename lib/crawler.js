var buffer = require('stream-buffer');
var ProcessingContext = require('./context');

// TODO: Ajax crawling:
// http://crawljax.com/about/


function Crawler(fetcher, frontier, urlset) {
  this._frontier = frontier;
  this._fetcher = fetcher;
  this._stack = [];
  this._filters = [];
  this._modifiers = [];
  this._set = urlset;
  this._analyzers = [];
}

Crawler.prototype.use = function(fn) {
  this._stack.push(fn);
  return this;
}

Crawler.prototype.process = function(type, analyzer) {
  this._analyzers.push({ type: type, plugin: analyzer })
}

Crawler.prototype.filter = function(fn) {
  this._filters.push(fn);
  return this;
}

Crawler.prototype.modify = function(fn) {
  this._modifiers.push(fn);
  return this;
}

Crawler.prototype.start = function() {
  
  
  var self = this;
  
  function iter() {
    var url = self._frontier.get();
    if (!url) {
      console.log('DONE!!!');
      return;
    }
    
    
    // TODO: Make this stream based (RIS)
    // TODO: After fetch, perform content-seen test to determine if this document has
    //       been seen via a different URL.  If so, skip further processing
    // https://github.com/expressjs/body-parser
    // https://github.com/stream-utils/raw-body
    
    self.logger.info('Fetching %s', url);
    self._fetcher.fetch(url, function(err, res, req) {
      //console.log('FETCH CALLBACK');
      //console.log(err);
      //console.log(res.statusCode);
      //console.log(res.headers)
      if (err) { return iter(err); };
      
      self._set.add(url)
      
      var ris = buffer();
      // Make the buffered stream appear as an http.IncomingMessage
      //ris.statusCode = response.statusCode;
      //ris.headers = response.headers;
      
      //res.pipe(ris);
      
      req.url = url;
      
      res.on('data', function(chunk) {
        //console.log('X got %d bytes of data', chunk.length);
      })
      .on('end', function() {
        //console.log('X there will be no more data.');
      })
      
      self._handle(res, req, function() {
        self._runProcessors(res, req);
        process.nextTick(iter);
      })
      
    });
    
    /*
    self._fetcher.fetch(url, function(err, res, body) {
      //console.log('fetched!');
      //console.log(err);
      if (err) { return iter(); }
    
      if (res) {
        //console.log(res);
        //console.log(res.statusCode);
        //console.log(res.headers);
      }
    
      //console.log(body);
    
      self._processor.process(body, res, url, self);
      iter();
    });
    */
  }
  iter();
}

Crawler.prototype.add = function(url) {
  this._frontier.add(url);
}

Crawler.prototype._handle = function(res, req, cb) {
  var self = this
    , stack = this._stack
    , idx = 0;
  
  function next(err) {
    var layer = stack[idx++];
    
    // all done
    if (!layer) {
      if (cb) { return cb(err); }
      // TODO: Implement default behavior for unhandled messages.
      if (err) {
        console.error(err.stack);
      }
      return;
    }
    
    try {
      var arity = layer.length;
      if (err) {
        if (arity == 4) {
          layer(err, res, req, next);
        } else {
          next(err);
        }
      } else if (arity < 4) {
        layer(res, req, next);
      } else {
        next();
      }
    } catch (ex) {
      console.log('EXCEPTION');
      console.log(ex);
      console.log(ex.stack);
      next(ex);
    }
  }
  next();
}

Crawler.prototype._filter = function(url, referrer, rel, rev, type, cb) {
  var self = this
    , filters = this._filters
    , idx = 0;
  
  function next(err, pass) {
    if (err || pass === false) { return cb(err, false); }
    
    var filter = filters[idx++];
    
    // all done
    if (!filter) {
      return cb(err, true);
    }
    
    try {
      var arity = filter.length;
      if (arity == 6) {
        filter(url, referrer, rel, rev, type, next);
      } else if (arity == 5) {
        filter(url, referrer, rel, rev, next);
      } else if (arity == 4) {
        filter(url, referrer, rel, next);
      } else if (arity == 3) {
        filter(url, referrer, next);
      } else {
        filter(url, next);
      }
    } catch (ex) {
      next(ex);
    }
  }
  next();
}

Crawler.prototype._modify = function(url, type, cb) {
  var self = this
    , modifiers = this._modifiers
    , idx = 0;
  
  function next(err, murl, mtype) {
    if (err) { return cb(err); }
    if (murl) {
      // TODO: Allow modifying of other stuff??
      // TODO: mark the pre-modifeid URL as seen somewhere??
      return cb(null, murl, mtype || type);
    }
    
    var modifier = modifiers[idx++];
    
    // all done
    if (!modifier) {
      return cb(err, url, type);
    }
    
    try {
      var arity = modifier.length;
      if (arity == 3) {
        modifier(url, type, next);
      } else {
        modifier(url, next);
      }
    } catch (ex) {
      next(ex);
    }
  }
  next();
}

Crawler.prototype._runProcessors = function(res, req, cb) {
  cb = cb || function(){};
  
  var statusCode = res.statusCode
    , headers = res.headers;
    
  var self = this
    , ctx = new ProcessingContext(this, req.url)
    , analyzers = this._analyzers
    , analyzer
    , i = 0;
    
  (function iter() {
    var arity;
    
    analyzer = analyzers[i++];
    if (!analyzer) {
      return cb();
    }
    
    // TODO: Check mime type
    // if (filter.action != '*' && filter.action != action) { return iter(err, data); }
    
    try {
      if (analyzer.plugin) { // remove this if check
        arity = analyzer.plugin.length;
        if (arity == 3) { // TODO
          analyzer.plugin(res, req, ctx);
          iter();
        } else {
          analyzer.plugin(res, ctx);
          iter();
        }
      } else {
        iter();
      }
      
      
    } catch (ex) {
      console.log('EXCEPTION');
      console.log(ex);
      console.log(ex.stack);
      iter();
    }
  })();
}


module.exports = Crawler;
