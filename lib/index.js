exports.Crawler = require('./crawler');
exports.Fetcher = require('./fetcher');
exports.Frontier = require('./frontier');
exports.URLSet = require('./urlset');

exports.middleware = {};
exports.middleware.jqParser = require('./middleware/jqParser');
exports.middleware.jsonParser = require('./middleware/jsonParser');

exports.processors = {};
exports.processors.aFollower = require('./processors/aFollower');

exports.filters = {};
exports.filters.pass = require('./filters/pass');
exports.filters.stop = require('./filters/stop');
exports.filters.all = require('./filters/all');
exports.filters.href =
exports.filters.url = require('./filters/href');
exports.filters.referer =
exports.filters.referrer = require('./filters/referer');
