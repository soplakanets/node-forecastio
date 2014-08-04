# forecastio
A node.js client for Forecast.io API.

For explanation and more detailed info about endpoints and response format see [Forecast.IO API documentation](https://developer.forecast.io/docs/v2)


## Installation

```
npm install forecastio
```


## Usage
Say you need a forecast for London, UK:

```
var ForecastIo = require('forecastio');

var forecastIo = new ForecastIo('<apiKey>');
forecastIo.forecast('51.506', '-0.127', function(err, data) {
  if (err) throw err;
  console.log(JSON.stringify(data, null, 2));
});
```


### "Time Machine" Requests
Forecast.io also supports 'time machine' requests. Quoting official documentation you can make request for "60 years in the past to 10 years in the future" for many places. Example:

```
// What was the weather like in London on January 1st 2008?
forecastIo.timeMachine('51.506', '-0.127', '2008-01-01T00:00:01Z', function(err, data) {
  if (err) throw err;
  console.log(JSON.stringify(data, null, 2));
});
```

### Request Options
Both `#forecast()` and `#timeMachine()` methods support passing additional options.
*Below are some example, for all options consult [Forecast.IO API documentation](https://developer.forecast.io/docs/v2).*


Example of requesting ad forecast in Si(metric) units with only 'daily' fields:

```
var options = {
  units: 'si',
  exclude: 'currently,hourly,flags'
};
forecastIo.forecast('49.844', '24.028', options, function(err, data) {
  if (err) throw err;
  console.log(JSON.stringify(data, null, 2));
});
```

"Time Machine" request in Si units and localized in Italian:

```
var options = {
  units: 'si',
  lang:  'it'
};
forecastIo.timeMachine('49.844', '24.028', '2008-01-01T00:00:01Z', options, function(err, data) {
  if (err) throw err;
  console.log(JSON.stringify(data, null, 2));
});
```

## TODO
- Request timeout
- Logging (for debugging at least)
- Smarter API methods (for exampel accept `Date` object in `#timeMachine()` and convert it to string)


## Contributing
* Fork the repo & commit changes
* Make sure tests are not failing:

  $ env FORECASTIO_API_KEY=`your_api_key` npm test

* Create a pull request
