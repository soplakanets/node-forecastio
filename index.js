var request = require('request');
var qs      = require('querystring');
var util    = require('util');


function ForecastIo(apiKey) {
  this.apiKey = apiKey;
  this.baseUrl = 'https://api.forecast.io/forecast/' + this.apiKey + '/';
}

ForecastIo.prototype.forecast = function(latitude, longitude, options, callback) {
  if (typeof options === 'function') {
    callback = options;
    options = {};
  }

  var url = this.buildUrl(latitude, longitude);
  this.makeRequest(url, options, function(err, data) {
    if (err) return callback(err);
    return callback(null, data);
  });
};

ForecastIo.prototype.timeMachine = function(latitude, longitude, time, options, callback) {
  if (typeof options === 'function') {
    callback = options;
    options = {};
  }

  var url = this.buildUrl(latitude, longitude, time);
  this.makeRequest(url, options, function(err, data) {
    if (err) return callback(err);
    return callback(null, data);
  });
};

ForecastIo.prototype.buildUrl = function(latitude, longitude, time) {
  var url = this.baseUrl + latitude + ',' + longitude;
  if (typeof time !== 'undefined') {
    url += ',' + time
  }

  return url;
};

ForecastIo.prototype.makeRequest = function(url, options, callback) {
  request.get({uri: url, qs: options}, function(err, res, body) {
    if (err) return callback(err);
    if (res.statusCode !== 200) {
      return callback(new ForecastIoError(res.request.uri.href, res.statusCode, body));
    }

    var data;
    try {
      data = JSON.parse(body);
    } catch (e) {
      return callback(e);
    }

    callback(null, data);
  });
};


function ForecastIoError(url, statusCode, body) {
  this.request = 'GET ' + url;
  this.response = {
    statusCode: statusCode,
    body: body
  };
}
util.inherits(ForecastIoError, Error);

ForecastIoError.prototype.toString = function() {
  return "ForecastIoError: " + JSON.stringify({
    request: this.request,
    response: this.response
  }, null, 2);
};


module.exports = ForecastIo;
