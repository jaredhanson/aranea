// contains all URLs that remain to be downloaded

function Frontier() {
  this._list = [];
}

exports = module.exports = Frontier;


Frontier.prototype.add = function(url) {
  if (this._list.indexOf(url) !== -1) {
    return false;
  }
  
  this._list.push(url);
  return true;
}

Frontier.prototype.get = function() {
  return this._list.shift();
}
