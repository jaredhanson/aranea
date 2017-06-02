var cheerio = require('cheerio');

module.exports = function() {

  return function aFollower(res, ctx) {
    if (!res.$) { return; }
    
    $ = res.$;
    $('a').each(function() {
      var href = $(this).attr('href');
      // TODO: make this an array (comma separated, space separated according to W3C spec, comma according to Mozilla. do both)
      var rel = $(this).attr('rel');
      var type = $(this).attr('type');
    
    
      if (href) { ctx.follow(href, rel, type); }
    });
  }
}
