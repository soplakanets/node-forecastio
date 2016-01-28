var assert      = require('assert');
var ForecastIo  = require('../');


if (!process.env.FORECASTIO_API_KEY) {
  throw new Error('Usage: env FORECASTIO_API_KEY=<your api key> npm test');
}


var forecastIo = new ForecastIo(process.env.FORECASTIO_API_KEY);

describe('ForecastIo', function() {
  describe('#forecast()', function() {
    it('should return forecast for latitude and longitude', function() {
      return forecastIo.forecast('49.844', '24.028')
        .then(function(data) {
          assert.ok(data);
          assert.ok(data.currently);
          assert.ok(data.hourly);
          assert.ok(data.daily);
          assert.ok(data.flags);
        })
    });

    it('should handle options if specified', function() {
      var options = {
        units: 'si',
        exclude: 'currently,hourly,daily'
      };
      return forecastIo.forecast('49.844', '24.028', options)
        .then(function(data) {
          assert.equal('si', data.flags.units);

          assert.equal(undefined, data.currently);
          assert.equal(undefined, data.hourly);
          assert.equal(undefined, data.daily);
        })
    });

    it('should return informative error objects', function() {
      return forecastIo.forecast('foo', 'bar', {foo: 'bar'})
        .then(function() {
          assert.fail(1, 2, 'This request should have failed');
        })
        .catch(function(err) {          
          assert.ok(err.request);
          assert.ok(err.response);
          assert.ok(err.response.body);
          assert.equal(400, err.response.statusCode);
        })
    });

    it('should handle timeouts', function() {
      var opts = {timeout: 1}; // Any request with timeout of 1 ms will surely fail
      var instance = new ForecastIo(process.env.FORECASTIO_API_KEY, opts);

      return instance.forecast('49.844', '24.028')
        .then(function() {
          assert.fail(1, 2, 'This request should have failed');
        })
        .catch(function(err) {
          assert.ok(err);
          assert.equal("Error: ETIMEDOUT", err.message);
        })
    })

    it('should support optional callbacks for success cases', function(done) {
      forecastIo.forecast('49.844', '24.028', function(err, data) {
        if (err) return done(err);
        assert.ok(data);
        done()
      })
    })

    it('should support oldschool callbacks for error cases', function(done) {
      forecastIo.forecast('foo', 'bar', {foo: 'bar'}, function(err) {
        assert.ok(err);
        done()
      })
    })
  })

  describe('#timeMachine()', function() {
    it('should return forecast for latitude and longitude', function() {
      return forecastIo.timeMachine('49.844', '24.028', '2004-07-14T00:00:01Z')
        .then(function(data) {
          assert.ok(data);
          assert.ok(data.currently);
          assert.ok(data.hourly);
          assert.ok(data.daily);
          assert.ok(data.flags);
        })
    });

    it('should handle options if specified', function() {
      var options = {
        units: 'si',
        exclude: 'currently,daily'
      };
      return forecastIo.timeMachine('49.844', '24.028', '2004-07-14T00:00:01Z', options)
        .then(function(data) {
          assert.equal('si', data.flags.units);

          assert.equal(undefined, data.currently);
          assert.equal(undefined, data.daily);
        })
    });

    it('should return informative error objects', function() {
      return forecastIo.timeMachine('49.844', '24.028', 'blabla', {foo: 'bar'})
        .then(function() {
          assert.fail(1, 2, 'This request should have failed');
        })
        .catch(function(err) {
          assert.ok(err.request);
          assert.ok(err.response);
          assert.ok(err.response.body);
          assert.equal(400, err.response.statusCode);          
        })
    });

    it('should handle timeouts', function() {
      var opts = {timeout: 1}; // Any request with timeout of 1 ms will surely fail
      var instance = new ForecastIo(process.env.FORECASTIO_API_KEY, opts);

      return instance.timeMachine('49.844', '24.028', '2004-07-14T00:00:01Z')
        .then(function() {
          assert.fail(1, 2, 'This request should have failed');
        })
        .catch(function(err) {
          assert.equal("Error: ETIMEDOUT", err.message);
        });
    });

    it('should support optional callbacks for success cases', function(done) {
      forecastIo.timeMachine('49.844', '24.028', '2004-07-14T00:00:01Z', function(err, data) {
        if (err) return done(err);
        assert.ok(data);
        done()
      })
    })

    it('should support oldschool callbacks for error cases', function(done) {
      forecastIo.timeMachine('foo', 'bar', 'foobar', function(err) {
        assert.ok(err);
        done()
      })
    })
  })
})
