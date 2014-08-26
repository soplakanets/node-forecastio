var request = require('request');
var qs      = require('querystring');
var util    = require('util');


defaultRequestOptions = {};
allowedRequestOptions = ['timeout'];

function ForecastIo(apiKey, requestOptions) {
  this.requestOptions = this.checkOptions(requestOptions);
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

ForecastIo.prototype.checkOptions = function(userOptions) {
  if (typeof userOptions === "undefined")
    return defaultRequestOptions;
  var options = {};
  allowedRequestOptions.forEach(function(optionName) {
    if (userOptions[optionName])
      options[optionName] = userOptions[optionName];
  });
  return options;
};

ForecastIo.prototype.buildUrl = function(latitude, longitude, time) {
  var url = this.baseUrl + latitude + ',' + longitude;
  if (typeof time !== 'undefined') {
    url += ',' + time
  }

  return url;
};

ForecastIo.prototype.makeRequest = function(url, queryString, callback) {
  var requestOptions = this.requestOptions;
  requestOptions.uri = url;
  requestOptions.qs = queryString;
  request.get(requestOptions, function(err, res, body) {
    if (err) return callback(new ForecastIoError(err));
    if (res.statusCode !== 200) {
      return callback(new ForecastIoAPIError(res.request.uri.href, res.statusCode, body));
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


/** Represents API errors. */
function ForecastIoAPIError(url, statusCode, body) {
  // Try to parse error response's body, since it's most probably JSON
  try {
    body = JSON.parse(body)
  } catch(e) {}

  this.response = {
    statusCode: statusCode,
    body: body
  };
  this.message = this._formatErrorMessage(body);
  this.name = 'ForecastIoAPIError';
  Error.call(this);
  Error.captureStackTrace(this, arguments.callee);
  this.request = 'GET ' + url;
}
util.inherits(ForecastIoAPIError, Error);

ForecastIoAPIError.prototype.toString = function() {
  return this.name + ": " + JSON.stringify({
    message: this.mesage,
    request: this.request,
    response: this.response
  }, null, 2);
};

ForecastIoAPIError.prototype._formatErrorMessage = function(body) {
  if ((body.code !== undefined) && (body.error !== undefined))
    return "[" + body.code + "] " + body.error;
  return "Request Failed";
};


/** Represents generic errors. Like timeouts, networking issues etc. */
function ForecastIoError(cause) {
  this.name = "ForecastIoError";
  this.message = cause.message;
  Error.call(this);
  Error.captureStackTrace(this, arguments.callee);
}
util.inherits(ForecastIoError, Error);


module.exports = ForecastIo;
