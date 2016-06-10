forecastio
==========

[![Build Status](https://travis-ci.org/soplakanets/node-forecastio.svg?branch=master)](https://travis-ci.org/soplakanets/node-forecastio) [![Dependency Status](https://david-dm.org/soplakanets/node-forecastio.png)](https://david-dm.org/soplakanets/node-forecastio)
![Badge](https://img.shields.io/badge/has%20nifty%20badges-yes-green.svg)

A node.js client library for [Forecast.io API](https://developer.forecast.io).

For explanation and more detailed info about endpoints and response format see [Forecast.IO API documentation](https://developer.forecast.io/docs/v2)


## Installation

```
npm install forecastio
```


## Usage
Say you need a [forecast](https://developer.forecast.io/docs/v2#forecast_call) for London, UK:

```javascript
var ForecastIo = require('forecastio');

var forecastIo = new ForecastIo('<apiKey>');
forecastIo.forecast('51.506', '-0.127').then(function(data) {
  console.log(JSON.stringify(data, null, 2));
});
```


### "Time Machine" Requests
Forecast.io also supports [Time Machine requests](https://developer.forecast.io/docs/v2#time_call). Quoting official documentation you can make request for "60 years in the past to 10 years in the future" for "many places". Example:

```javascript
// What was the weather like in London on January 1st 2008?
forecastIo.timeMachine('51.506', '-0.127', '2008-01-01T00:00:01Z').then(function(data) {
  console.log(JSON.stringify(data, null, 2));
});
```

### API Options
Both `#forecast()` and `#timeMachine()` methods support passing additional options.
*Below are some examples, for all options consult [Options section of Forecast.IO API documentation](https://developer.forecast.io/docs/v2#options).*


Example of requesting ad forecast in Si(metric) units with only 'daily' fields:

```javascript
var options = {
  units: 'si',
  exclude: 'currently,hourly,flags'
};
forecastIo.forecast('49.844', '24.028', options).then(function(data) {
  console.log(JSON.stringify(data, null, 2));
});
```

Another example, a "Time Machine" request in UK units and localized in Italian:

```javascript
var options = {
  units: 'uk',
  lang:  'it'
};
forecastIo.timeMachine('49.844', '24.028', '2008-01-01T00:00:01Z', options).then(function(data) {
  console.log(JSON.stringify(data, null, 2));
});
```

### Request Timeout
To set timeout for requests pass a timeout option to constructor, example:

```javascript
var forecastIo = new ForecastIo('<apiKey>', {timeout: 30*1000});
```
As a result all API request made with with this `forecastIo` instance will have a timeout of 30 seconds.

Timeout option accepts time in milliseconds. If request will not finish in time - a callback will be fired with a timeout error.


## TODO
- Logging (for debugging at least)
- Smarter API methods (accept `Date` object in `#timeMachine()` and convert it to string, for example)


## Contributing
* Fork the repo & commit changes
* Make sure tests are not failing:

  $ env FORECASTIO_API_KEY=`your_api_key` npm test

* Create a pull request


## Changelog

#### 1.0.2
- Fixed deprecation warnings.

#### 1.0.0
- Promises (For compatibility callbacks are still supported).

#### 0.2.0
- Added `timeout` option

#### 0.1.2
- More informative error messages.
