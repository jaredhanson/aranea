var uri = require('url');
//var Template = require('uri-template-lite').URI.Template;


function ProcessingContext(crawler, url) {
  this.location = url;
  this._crawler = crawler;
}

ProcessingContext.prototype.follow = function(href, rel, type) {
  if (type || rel) {
    //console.log('follow: ' + href + ' ' + type + ' ' + rel);
  }
  //console.log(this.location);
  
  var self = this;
  var url = uri.resolve(this.location, href);
  
  // Remove the fragment identifier, as its processing is exclusively
  // client-side, after the response has been recieved.
  var parsed = uri.parse(url);
  delete parsed.hash;
  url = uri.format(parsed);
  
  // TODO: Referrer headers in new request???
  //      http://smerity.com/articles/2013/where_did_all_the_http_referrers_go.html
  //      https://en.wikipedia.org/wiki/HTTP_referer
  
  if (this._crawler._set.has(url)) {
    return;
  }
  
  this._crawler._filter(url, this.location, rel, undefined, type, function(err, pass) {
    if (err) {
      // TODO: Log an error
      return;
    }
    
    if (pass) {
      self._crawler._modify(url, type, function(err, url, type) {
        if (err) {
          // TODO: Log an error
          console.log('MODIFY ERROR');
          console.log(err);
          console.log(err.stack);
          return;
        }
        
        // Should add with url and type and referrer.  if modified, no referer.
        //console.log('MODIFIED URL: ' + url);
        
        self._crawler.add(url);
      })
    }
  });
  
  return;
  /*
  // TODO: Run url through filter, and don't follow those that don't pass
  // TODO: Perform URL-seen test (in frontier already, downloaded previously, etc)
  
  //console.log('follow: ' + url);
  
  // http://stackoverflow.com/questions/2593637/how-to-escape-regular-expression-in-javascript
  // http://stackoverflow.com/questions/494035/how-do-you-pass-a-variable-to-a-regular-expression-javascript/494122#494122
  function quoteRegExp(str) {
    return (str+'').replace(/[.?*+^$[\]\\(){}|-]/g, "\\$&");
  }
  // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions
  function escapeRegExp(string){
    return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  }
  
  //console.log(escapeRegExp('https://www.npmjs.com/search?q=passport&page=[0-9]+'))
  //console.log(escapeRegExp('https://www.npmjs.com/search?q=passport&page=\d+'))
  
  var npmPackageTemplate = new Template('https://www.npmjs.com/package/{package}');
  
  var templates = [
    new Template('https://www.npmjs.com/search?q=passport&page={page}'),
    new Template('https://www.npmjs.com/package/{package}')
    //new Template('https://{domain}/~{user}/')
    //ew RegExp(escapeRegExp('https://www.npmjs.com/search?q=passport&page=\d+'), 'i')
  ]
  
  if (npmPackageTemplate.match(this.location)) {
    // referer is a npm package path, we crawl no further.
    return;
  }
  
  
  // RegExp filter
  
  var i, len;
  for (i = 0, len = templates.length; i < len; ++i) {
    //console.log('testing: ' + url);
    if (templates[i].match(url)) {
      //console.log('MATCHED!');
      //console.log(url);
      //console.log('adding: ' + url);
      //console.log('from: ' + this.location);
      
      this._crawler.add(url);
      break;
    }
  }
  */
  
  
  // TODO: Add to frontier directly, no need for crawler here.
  //this._crawler.add(url)
}


module.exports = ProcessingContext;