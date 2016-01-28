var request = require("request-promise");
var util    = require("util");


var DEFAULT_REQUEST_OPTIONS = {
  json: true,
  simple: false,
  resolveWithFullResponse: true
};
var ALLOWED_REQUEST_OPTIONS = ["timeout"];

function ForecastIo(apiKey, requestOptions) {
  this.requestOptions = this.checkOptions(requestOptions);
  this.apiKey = apiKey;
  this.baseUrl = "https://api.forecast.io/forecast/" + this.apiKey + "/";
}

ForecastIo.prototype.forecast = function(latitude, longitude, options, optionalCallback) {
  if (typeof options === "function") {
    optionalCallback = options;
    options = {};
  }

  var url = this.buildUrl(latitude, longitude);
  return this.makeRequest(url, options, optionalCallback);
};

ForecastIo.prototype.timeMachine = function(latitude, longitude, time, options, optionalCallback) {
  if (typeof options === "function") {
    optionalCallback = options;
    options = {};
  }

  var url = this.buildUrl(latitude, longitude, time);
  return this.makeRequest(url, options, optionalCallback);
};

ForecastIo.prototype.checkOptions = function(userOptions) {
  if (typeof userOptions === "undefined")
    return DEFAULT_REQUEST_OPTIONS;
  var options = cloneObject(DEFAULT_REQUEST_OPTIONS);
  ALLOWED_REQUEST_OPTIONS.forEach(function(optionName) {
    if (userOptions[optionName])
      options[optionName] = userOptions[optionName];
  });
  return options;
};

ForecastIo.prototype.buildUrl = function(latitude, longitude, time) {
  var url = this.baseUrl + latitude + "," + longitude;
  if (typeof time !== "undefined") {
    url += "," + time;
  }

  return url;
};

ForecastIo.prototype.makeRequest = function(url, queryString, optionalCallback) {
  var requestOptions = this.requestOptions;
  requestOptions.uri = url;
  requestOptions.qs = queryString;

  var promise = request(requestOptions)
    .then(function(response) {
      if (response.statusCode != 200) {
        throw new ForecastIoAPIError(url, response.statusCode, response.body);
      }

      return response.body;
    });

  if (typeof(optionalCallback) !== "undefined") {
    promise
      .then(function(data) {
        optionalCallback(null, data)
      })
      .catch(optionalCallback);
  } else {
    return promise;  
  }  
};


/** Represents API errors. */
function ForecastIoAPIError(url, statusCode, body) {
  this.response = {
    statusCode: statusCode,
    body: body
  };
  this.message = this._formatErrorMessage(body);
  this.name = "ForecastIoAPIError";
  Error.call(this);
  Error.captureStackTrace(this, arguments.callee);
  this.request = "GET " + url;
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


function cloneObject(obj) {
  return JSON.parse(JSON.stringify(obj));
}


module.exports = ForecastIo;
