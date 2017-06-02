// contains list of all URLs seen by the crawler

function URLSet() {
  this._set = [];
}

module.exports = URLSet;


URLSet.prototype.add = function(url) {
  if (this._set.indexOf(url) === -1) {
    this._set.push(url);
  }
}

URLSet.prototype.has = function(url) {
  return this._set.indexOf(url) !== -1;
}

