var assert      = require('assert');
var ForecastIo  = require('../');


if (!process.env.FORECASTIO_API_KEY) {
  throw new Error('Usage: env FORECASTIO_API_KEY=<your api key> npm test');
}


var forecastIo = new ForecastIo(process.env.FORECASTIO_API_KEY);

describe('ForecastIo', function() {
  describe('#forecast()', function() {
    it('should return forecast for latitude and longitude', function(done) {
      forecastIo.forecast('49.844', '24.028', function(err, data) {
        if (err) throw err;

        assert.ok(data);
        assert.ok(data.currently);
        assert.ok(data.hourly);
        assert.ok(data.daily);
        assert.ok(data.flags);
        done();
      });
    });

    it('should handle options if specified', function(done) {
      var options = {
        units: 'si',
        exclude: 'currently,hourly,daily'
      };
      forecastIo.forecast('49.844', '24.028', options, function(err, data) {
        if (err) throw err;

        assert.equal('si', data.flags.units);

        assert.equal(undefined, data.currently);
        assert.equal(undefined, data.hourly);
        assert.equal(undefined, data.daily);
        done();
      });
    });

    it('should return informative error objects', function(done) {
      forecastIo.forecast('foo', 'bar', {foo: 'bar'}, function(err, data) {
        assert.ok(err);
        assert.ok(err.request);
        assert.ok(err.response);
        assert.ok(err.response.body);
        assert.equal(400, err.response.statusCode);
        done();
      });
    });
  })

  describe('#timeMachine()', function() {
    it('should return forecast for latitude and longitude', function(done) {
      forecastIo.timeMachine('49.844', '24.028', '2004-07-14T00:00:01Z', function(err, data) {
        if (err) throw err;

        assert.ok(data);
        assert.ok(data.currently);
        assert.ok(data.hourly);
        assert.ok(data.daily);
        assert.ok(data.flags);
        done();
      });
    });

    it('should handle options if specified', function(done) {
      var options = {
        units: 'si',
        exclude: 'currently,daily'
      };
      forecastIo.timeMachine('49.844', '24.028', '2004-07-14T00:00:01Z', options, function(err, data) {
        if (err) throw err;

        assert.equal('si', data.flags.units);

        assert.equal(undefined, data.currently);
        assert.equal(undefined, data.daily);
        done();
      });
    });

    it('should return informative error objects', function(done) {
      forecastIo.timeMachine('49.844', '24.028', 'blabla', {foo: 'bar'}, function(err, data) {
        assert.ok(err);
        assert.ok(err.request);
        assert.ok(err.response);
        assert.ok(err.response.body);
        assert.equal(400, err.response.statusCode);
        done();
      });
    });
  })
})
