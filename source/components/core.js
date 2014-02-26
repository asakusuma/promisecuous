var Promisecuous = (function() {
	var Promisecuous = {
		_promise: null,
		_libName: null,

		//0 = new Promise(function(resolve, reject) { ... })
		//1 = MyLibrary.defer().promise
		_syntax: 0,
		_deferFuncName: null
	};

	var LibraryConfigMap = {
		'bluebird': {
			_syntax: 1,
			_deferFuncName: 'defer',
			_libName: 'bluebird'
		}
	};

	var NativePromise = null;

	if(typeof Promise === 'function' && Promise.toString().indexOf('[native code]') > -1) {
		//We have native promises

		//Underlying library
		Promisecuous._promise = Promise;

		//API interface adhering to syntax=0
		Promisecuous.Promise = Promise;

		NativePromise = Promise;
	}

	var rejectFunctions = ['reject', 'fail'];
	var fulfillFunctions = ['fulfill', 'resolve'];

	Promisecuous.unsetLibarary = function() {
		Promisecuous._promise = null;
		Promisecuous._libName = null;
		Promisecuous._syntax = 0;
		Promisecuous._deferFuncName = null;

		if(NativePromise) {
			Promisecuous._promise = NativePromise;
			Promisecuous.Promise = NativePromise;
		}
	};

	Promisecuous.setLibrary = function(Promise, libName) {
		if(LibraryConfigMap[libName]) {
			this._promise = Promise;
			var libConfig = LibraryConfigMap[libName];
			for(var key in libConfig) {
				this[key] = libConfig[key];
			}

			if(this._syntax === 1) {
				//Setup resolution proxies
				var i, rejectFunctionName, fulfillFunctionName;

				var d = Promisecuous.defer();

				//Find the rejection function
				for(i = 0; i < rejectFunctions.length; i++) {
					if(typeof d[rejectFunctions[i]] === 'function') {
						this.rejectFunctionName = rejectFunctions[i];
					}
				}

				//Find the fulfill function
				for(i = 0; i < fulfillFunctions.length; i++) {
					if(typeof d[fulfillFunctions[i]] === 'function') {
						this.fulfillFunctionName = fulfillFunctions[i];
					}
				}
			}
			this.configUtilities();
		}
	};

	var promiseConstructorFunctions = [
		Promisecuous._promise,
		function(closure) {
			if(!closure) {
				throw new Error('You must pass in a resolving function');
			}

			var d = Promisecuous.defer();

			closure(function fulfill(value) {
				d.fulfill.call(d, value);
			}, function reject(reason) {
				d.reject.call(d, reason);
			});

			return d.promise;
		}
	];

	Promisecuous.Promise = function(closure) {
		if(!Promisecuous._promise) {
			throw new Error('No promise library has been set.');
		}
		return promiseConstructorFunctions[Promisecuous._syntax](closure);
	};

	var deferFunctions = [
		function() {
			var deferred = {};
			var promiseDefine = function(f, r) {
				var i;
				for(i = 0; i < fulfillFunctions.length; i++) {
					deferred[fulfillFunctions[i]] = f;
				}
				for(i = 0; i < rejectFunctions.length; i++) {
					deferred[rejectFunctions[i]] = r;
				}
			};
			deferred.promise = new Promisecuous._promise(promiseDefine);

			return deferred;
		},
		function() {
			return Promisecuous._promise[Promisecuous._deferFuncName]();
		}
	];

	Promisecuous.defer = function() {
		if(!this._promise) {
			throw new Error('No promise library has been set.');
		}
		var d = deferFunctions[this._syntax]();

		//Setup proxies to rejection function
		for(i = 0; i < rejectFunctions.length; i++) {
			if(!d[rejectFunctions[i]]) {
				d[rejectFunctions[i]] = d[this.rejectFunctionName];
			}
		}

		//Setup proxies to fulfill function
		for(i = 0; i < fulfillFunctions.length; i++) {
			if(!d[fulfillFunctions[i]]) {
				d[fulfillFunctions[i]] = d[this.fulfillFunctionName];
			}
		}

		return d;
	};

	return Promisecuous;
})();