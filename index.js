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
  // Try to parse error response's body, since it's most probably JSON
  try {
    body = JSON.parse(body)
  } catch(e) {}

  this.response = {
    statusCode: statusCode,
    body: body
  };
  this.message = this._formatErrorMessage(body);
  this.name = 'ForecastIoError';
  Error.call(this);
  Error.captureStackTrace(this, arguments.callee);
  this.request = 'GET ' + url;
}
util.inherits(ForecastIoError, Error);

ForecastIoError.prototype.toString = function() {
  return this.name + ": " + JSON.stringify({
    message: this.mesage,
    request: this.request,
    response: this.response
  }, null, 2);
};

ForecastIoError.prototype._formatErrorMessage = function(body) {
  if ((body.code !== undefined) && (body.error !== undefined))
    return "[" + body.code + "] " + body.error;
  return "Request Failed";
};

module.exports = ForecastIo;
