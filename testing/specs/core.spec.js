/**
 * @venus-include ../../source/lib/bluebird.js
 * @venus-include ../../build/promisecuous-global.js
 */

describe('Promisecuous Core', function() {

  describe('setLibrary()', function() {

    it('should return a deferred with a promise as a property', function() {
      var d = Promisecuous.defer();
      expect(d.promise).to.be.ok();
      expect(d.promise.then).to.be.ok();
    });

    it('should return a deferred with a promise as a property', function() {
      var d = Promisecuous.defer();
      expect(d.promise).to.be.ok();
      expect(d.promise.then).to.be.ok();
    });

  });

  Promisecuous.setLibrary(Promise, 'bluebird');

  describe('defer()', function() {
    it('should return a deferred with a promise as a property', function() {
      var d = Promisecuous.defer();
      expect(d.promise).to.be.ok();
      expect(d.promise.then).to.be.ok();
    });

    it('should return a deferred with fulfill method', function(done) {
      var d = Promisecuous.defer();
      var name = 'Benjamin';
      d.promise.then(function(value) {
        expect(value).to.be(name);
        done();
      });
      d.fulfill(name);
    });

    it('should return a deferred with resolve method as an alias of fulfill', function(done) {
      var d = Promisecuous.defer();
      var name = 'Benjamin';
      d.promise.then(function(value) {
        expect(value).to.be(name);
        done();
      });
      d.resolve(name);
    });

    it('should return a deferred with reject method', function(done) {
      var d = Promisecuous.defer();
      var name = 'Benjamin';
      d.promise.then(null, function(value) {
        expect(value).to.be(name);
        done();
      });
      d.reject(name);
    });

    it('should return a deferred with fail method as alias of reject', function(done) {
      var d = Promisecuous.defer();
      var name = 'Benjamin';
      d.promise.then(null, function(value) {
        expect(value).to.be(name);
        done();
      });
      d.fail(name);
    });
  });

  describe('new Promisecuous.Promise', function() {
    it('should create a promise with a then method', function() {
      var p = new Promisecuous.Promise(function() {});
      expect(p).to.be.ok();
      expect(p.then).to.be.ok();
    });

    it('should create a promise that is fulfillable', function(done) {
      var name = 'Benjamin';
      var p = new Promisecuous.Promise(function(f) {
        f(name);
      });
      p.then(function(value) {
        expect(value).to.be(name);
        done();
      });
    });

    it('should create a promise that is rejectable', function(done) {
      var name = 'Benjamin';
      var p = new Promisecuous.Promise(function(f, r) {
        r(name);
      });
      p.then(null, function(value) {
        expect(value).to.be(name);
        done();
      });
    });
  });
});