// TODO: Set up the user agent and whatnot

function Fetcher(www) {
  this._www = www;
  // TODO: Rate limiting and throttling
}

exports = module.exports = Fetcher;


Fetcher.prototype.fetch = function(url, cb) {
  //console.log('fetch');
  //console.log(url)
  
  // TODO: How to deal with redirects and canonicalization
  // TODO: Switch to stream-based processing?
  // TODO: Need RIS (rewindInputStream)???
  //       RIS might need to back larger documents to a disk file, while keeping
  //       some in memory
  // TODO: Make sure fetches timeout to prevent a malicious web server
  //       from hanging the crawler
  
  var request;
  try {
    request = this._www.get(url);
  } catch (ex) {
    console.log('EXCEPTION')
    console.log(ex);
    console.log(ex.stack);
    return cb(ex);
  }
  
  // TODO: Move the stream buffer into Crawler.
  
  request
    .on('response', function(response) {
      cb(null, response, request);
    })
    .on('error', function(err) {
      // TODO: Handle this here or in crawler???
      console.log(err)
    });
}

