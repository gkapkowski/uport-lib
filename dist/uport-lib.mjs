import * as request from 'request';
import request__default from 'request';
import isMobile from 'is-mobile';
import ProviderEngine from 'web3-provider-engine';
import * as require$$4 from 'xhr';
import * as require$$2 from 'util';
import qrImage from 'qr-image';

var commonjsGlobal = typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {}

function interopDefault(ex) {
	return ex && typeof ex === 'object' && 'default' in ex ? ex['default'] : ex;
}

function createCommonjsModule(fn, module) {
	return module = { exports: {} }, fn(module, module.exports), module.exports;
}

var async = createCommonjsModule(function (module) {
/*!
 * async
 * https://github.com/caolan/async
 *
 * Copyright 2010-2014 Caolan McMahon
 * Released under the MIT license
 */
(function () {

    var async = {};
    function noop() {}
    function identity(v) {
        return v;
    }
    function toBool(v) {
        return !!v;
    }
    function notId(v) {
        return !v;
    }

    // global on the server, window in the browser
    var previous_async;

    // Establish the root object, `window` (`self`) in the browser, `global`
    // on the server, or `this` in some virtual machines. We use `self`
    // instead of `window` for `WebWorker` support.
    var root = typeof self === 'object' && self.self === self && self ||
            typeof commonjsGlobal === 'object' && commonjsGlobal.global === commonjsGlobal && commonjsGlobal ||
            this;

    if (root != null) {
        previous_async = root.async;
    }

    async.noConflict = function () {
        root.async = previous_async;
        return async;
    };

    function only_once(fn) {
        return function() {
            if (fn === null) throw new Error("Callback was already called.");
            fn.apply(this, arguments);
            fn = null;
        };
    }

    function _once(fn) {
        return function() {
            if (fn === null) return;
            fn.apply(this, arguments);
            fn = null;
        };
    }

    //// cross-browser compatiblity functions ////

    var _toString = Object.prototype.toString;

    var _isArray = Array.isArray || function (obj) {
        return _toString.call(obj) === '[object Array]';
    };

    // Ported from underscore.js isObject
    var _isObject = function(obj) {
        var type = typeof obj;
        return type === 'function' || type === 'object' && !!obj;
    };

    function _isArrayLike(arr) {
        return _isArray(arr) || (
            // has a positive integer length property
            typeof arr.length === "number" &&
            arr.length >= 0 &&
            arr.length % 1 === 0
        );
    }

    function _arrayEach(arr, iterator) {
        var index = -1,
            length = arr.length;

        while (++index < length) {
            iterator(arr[index], index, arr);
        }
    }

    function _map(arr, iterator) {
        var index = -1,
            length = arr.length,
            result = Array(length);

        while (++index < length) {
            result[index] = iterator(arr[index], index, arr);
        }
        return result;
    }

    function _range(count) {
        return _map(Array(count), function (v, i) { return i; });
    }

    function _reduce(arr, iterator, memo) {
        _arrayEach(arr, function (x, i, a) {
            memo = iterator(memo, x, i, a);
        });
        return memo;
    }

    function _forEachOf(object, iterator) {
        _arrayEach(_keys(object), function (key) {
            iterator(object[key], key);
        });
    }

    function _indexOf(arr, item) {
        for (var i = 0; i < arr.length; i++) {
            if (arr[i] === item) return i;
        }
        return -1;
    }

    var _keys = Object.keys || function (obj) {
        var keys = [];
        for (var k in obj) {
            if (obj.hasOwnProperty(k)) {
                keys.push(k);
            }
        }
        return keys;
    };

    function _keyIterator(coll) {
        var i = -1;
        var len;
        var keys;
        if (_isArrayLike(coll)) {
            len = coll.length;
            return function next() {
                i++;
                return i < len ? i : null;
            };
        } else {
            keys = _keys(coll);
            len = keys.length;
            return function next() {
                i++;
                return i < len ? keys[i] : null;
            };
        }
    }

    // Similar to ES6's rest param (http://ariya.ofilabs.com/2013/03/es6-and-rest-parameter.html)
    // This accumulates the arguments passed into an array, after a given index.
    // From underscore.js (https://github.com/jashkenas/underscore/pull/2140).
    function _restParam(func, startIndex) {
        startIndex = startIndex == null ? func.length - 1 : +startIndex;
        return function() {
            var arguments$1 = arguments;

            var length = Math.max(arguments.length - startIndex, 0);
            var rest = Array(length);
            for (var index = 0; index < length; index++) {
                rest[index] = arguments$1[index + startIndex];
            }
            switch (startIndex) {
                case 0: return func.call(this, rest);
                case 1: return func.call(this, arguments[0], rest);
            }
            // Currently unused but handle cases outside of the switch statement:
            // var args = Array(startIndex + 1);
            // for (index = 0; index < startIndex; index++) {
            //     args[index] = arguments[index];
            // }
            // args[startIndex] = rest;
            // return func.apply(this, args);
        };
    }

    function _withoutIndex(iterator) {
        return function (value, index, callback) {
            return iterator(value, callback);
        };
    }

    //// exported async module functions ////

    //// nextTick implementation with browser-compatible fallback ////

    // capture the global reference to guard against fakeTimer mocks
    var _setImmediate = typeof setImmediate === 'function' && setImmediate;

    var _delay = _setImmediate ? function(fn) {
        // not a direct alias for IE10 compatibility
        _setImmediate(fn);
    } : function(fn) {
        setTimeout(fn, 0);
    };

    if (typeof process === 'object' && typeof process.nextTick === 'function') {
        async.nextTick = process.nextTick;
    } else {
        async.nextTick = _delay;
    }
    async.setImmediate = _setImmediate ? _delay : async.nextTick;


    async.forEach =
    async.each = function (arr, iterator, callback) {
        return async.eachOf(arr, _withoutIndex(iterator), callback);
    };

    async.forEachSeries =
    async.eachSeries = function (arr, iterator, callback) {
        return async.eachOfSeries(arr, _withoutIndex(iterator), callback);
    };


    async.forEachLimit =
    async.eachLimit = function (arr, limit, iterator, callback) {
        return _eachOfLimit(limit)(arr, _withoutIndex(iterator), callback);
    };

    async.forEachOf =
    async.eachOf = function (object, iterator, callback) {
        callback = _once(callback || noop);
        object = object || [];

        var iter = _keyIterator(object);
        var key, completed = 0;

        while ((key = iter()) != null) {
            completed += 1;
            iterator(object[key], key, only_once(done));
        }

        if (completed === 0) callback(null);

        function done(err) {
            completed--;
            if (err) {
                callback(err);
            }
            // Check key is null in case iterator isn't exhausted
            // and done resolved synchronously.
            else if (key === null && completed <= 0) {
                callback(null);
            }
        }
    };

    async.forEachOfSeries =
    async.eachOfSeries = function (obj, iterator, callback) {
        callback = _once(callback || noop);
        obj = obj || [];
        var nextKey = _keyIterator(obj);
        var key = nextKey();
        function iterate() {
            var sync = true;
            if (key === null) {
                return callback(null);
            }
            iterator(obj[key], key, only_once(function (err) {
                if (err) {
                    callback(err);
                }
                else {
                    key = nextKey();
                    if (key === null) {
                        return callback(null);
                    } else {
                        if (sync) {
                            async.setImmediate(iterate);
                        } else {
                            iterate();
                        }
                    }
                }
            }));
            sync = false;
        }
        iterate();
    };



    async.forEachOfLimit =
    async.eachOfLimit = function (obj, limit, iterator, callback) {
        _eachOfLimit(limit)(obj, iterator, callback);
    };

    function _eachOfLimit(limit) {

        return function (obj, iterator, callback) {
            callback = _once(callback || noop);
            obj = obj || [];
            var nextKey = _keyIterator(obj);
            if (limit <= 0) {
                return callback(null);
            }
            var done = false;
            var running = 0;
            var errored = false;

            (function replenish () {
                if (done && running <= 0) {
                    return callback(null);
                }

                while (running < limit && !errored) {
                    var key = nextKey();
                    if (key === null) {
                        done = true;
                        if (running <= 0) {
                            callback(null);
                        }
                        return;
                    }
                    running += 1;
                    iterator(obj[key], key, only_once(function (err) {
                        running -= 1;
                        if (err) {
                            callback(err);
                            errored = true;
                        }
                        else {
                            replenish();
                        }
                    }));
                }
            })();
        };
    }


    function doParallel(fn) {
        return function (obj, iterator, callback) {
            return fn(async.eachOf, obj, iterator, callback);
        };
    }
    function doParallelLimit(fn) {
        return function (obj, limit, iterator, callback) {
            return fn(_eachOfLimit(limit), obj, iterator, callback);
        };
    }
    function doSeries(fn) {
        return function (obj, iterator, callback) {
            return fn(async.eachOfSeries, obj, iterator, callback);
        };
    }

    function _asyncMap(eachfn, arr, iterator, callback) {
        callback = _once(callback || noop);
        arr = arr || [];
        var results = _isArrayLike(arr) ? [] : {};
        eachfn(arr, function (value, index, callback) {
            iterator(value, function (err, v) {
                results[index] = v;
                callback(err);
            });
        }, function (err) {
            callback(err, results);
        });
    }

    async.map = doParallel(_asyncMap);
    async.mapSeries = doSeries(_asyncMap);
    async.mapLimit = doParallelLimit(_asyncMap);

    // reduce only has a series version, as doing reduce in parallel won't
    // work in many situations.
    async.inject =
    async.foldl =
    async.reduce = function (arr, memo, iterator, callback) {
        async.eachOfSeries(arr, function (x, i, callback) {
            iterator(memo, x, function (err, v) {
                memo = v;
                callback(err);
            });
        }, function (err) {
            callback(err, memo);
        });
    };

    async.foldr =
    async.reduceRight = function (arr, memo, iterator, callback) {
        var reversed = _map(arr, identity).reverse();
        async.reduce(reversed, memo, iterator, callback);
    };

    async.transform = function (arr, memo, iterator, callback) {
        if (arguments.length === 3) {
            callback = iterator;
            iterator = memo;
            memo = _isArray(arr) ? [] : {};
        }

        async.eachOf(arr, function(v, k, cb) {
            iterator(memo, v, k, cb);
        }, function(err) {
            callback(err, memo);
        });
    };

    function _filter(eachfn, arr, iterator, callback) {
        var results = [];
        eachfn(arr, function (x, index, callback) {
            iterator(x, function (v) {
                if (v) {
                    results.push({index: index, value: x});
                }
                callback();
            });
        }, function () {
            callback(_map(results.sort(function (a, b) {
                return a.index - b.index;
            }), function (x) {
                return x.value;
            }));
        });
    }

    async.select =
    async.filter = doParallel(_filter);

    async.selectLimit =
    async.filterLimit = doParallelLimit(_filter);

    async.selectSeries =
    async.filterSeries = doSeries(_filter);

    function _reject(eachfn, arr, iterator, callback) {
        _filter(eachfn, arr, function(value, cb) {
            iterator(value, function(v) {
                cb(!v);
            });
        }, callback);
    }
    async.reject = doParallel(_reject);
    async.rejectLimit = doParallelLimit(_reject);
    async.rejectSeries = doSeries(_reject);

    function _createTester(eachfn, check, getResult) {
        return function(arr, limit, iterator, cb) {
            function done() {
                if (cb) cb(getResult(false, void 0));
            }
            function iteratee(x, _, callback) {
                if (!cb) return callback();
                iterator(x, function (v) {
                    if (cb && check(v)) {
                        cb(getResult(true, x));
                        cb = iterator = false;
                    }
                    callback();
                });
            }
            if (arguments.length > 3) {
                eachfn(arr, limit, iteratee, done);
            } else {
                cb = iterator;
                iterator = limit;
                eachfn(arr, iteratee, done);
            }
        };
    }

    async.any =
    async.some = _createTester(async.eachOf, toBool, identity);

    async.someLimit = _createTester(async.eachOfLimit, toBool, identity);

    async.all =
    async.every = _createTester(async.eachOf, notId, notId);

    async.everyLimit = _createTester(async.eachOfLimit, notId, notId);

    function _findGetResult(v, x) {
        return x;
    }
    async.detect = _createTester(async.eachOf, identity, _findGetResult);
    async.detectSeries = _createTester(async.eachOfSeries, identity, _findGetResult);
    async.detectLimit = _createTester(async.eachOfLimit, identity, _findGetResult);

    async.sortBy = function (arr, iterator, callback) {
        async.map(arr, function (x, callback) {
            iterator(x, function (err, criteria) {
                if (err) {
                    callback(err);
                }
                else {
                    callback(null, {value: x, criteria: criteria});
                }
            });
        }, function (err, results) {
            if (err) {
                return callback(err);
            }
            else {
                callback(null, _map(results.sort(comparator), function (x) {
                    return x.value;
                }));
            }

        });

        function comparator(left, right) {
            var a = left.criteria, b = right.criteria;
            return a < b ? -1 : a > b ? 1 : 0;
        }
    };

    async.auto = function (tasks, concurrency, callback) {
        if (typeof arguments[1] === 'function') {
            // concurrency is optional, shift the args.
            callback = concurrency;
            concurrency = null;
        }
        callback = _once(callback || noop);
        var keys = _keys(tasks);
        var remainingTasks = keys.length;
        if (!remainingTasks) {
            return callback(null);
        }
        if (!concurrency) {
            concurrency = remainingTasks;
        }

        var results = {};
        var runningTasks = 0;

        var hasError = false;

        var listeners = [];
        function addListener(fn) {
            listeners.unshift(fn);
        }
        function removeListener(fn) {
            var idx = _indexOf(listeners, fn);
            if (idx >= 0) listeners.splice(idx, 1);
        }
        function taskComplete() {
            remainingTasks--;
            _arrayEach(listeners.slice(0), function (fn) {
                fn();
            });
        }

        addListener(function () {
            if (!remainingTasks) {
                callback(null, results);
            }
        });

        _arrayEach(keys, function (k) {
            if (hasError) return;
            var task = _isArray(tasks[k]) ? tasks[k]: [tasks[k]];
            var taskCallback = _restParam(function(err, args) {
                runningTasks--;
                if (args.length <= 1) {
                    args = args[0];
                }
                if (err) {
                    var safeResults = {};
                    _forEachOf(results, function(val, rkey) {
                        safeResults[rkey] = val;
                    });
                    safeResults[k] = args;
                    hasError = true;

                    callback(err, safeResults);
                }
                else {
                    results[k] = args;
                    async.setImmediate(taskComplete);
                }
            });
            var requires = task.slice(0, task.length - 1);
            // prevent dead-locks
            var len = requires.length;
            var dep;
            while (len--) {
                if (!(dep = tasks[requires[len]])) {
                    throw new Error('Has nonexistent dependency in ' + requires.join(', '));
                }
                if (_isArray(dep) && _indexOf(dep, k) >= 0) {
                    throw new Error('Has cyclic dependencies');
                }
            }
            function ready() {
                return runningTasks < concurrency && _reduce(requires, function (a, x) {
                    return (a && results.hasOwnProperty(x));
                }, true) && !results.hasOwnProperty(k);
            }
            if (ready()) {
                runningTasks++;
                task[task.length - 1](taskCallback, results);
            }
            else {
                addListener(listener);
            }
            function listener() {
                if (ready()) {
                    runningTasks++;
                    removeListener(listener);
                    task[task.length - 1](taskCallback, results);
                }
            }
        });
    };



    async.retry = function(times, task, callback) {
        var DEFAULT_TIMES = 5;
        var DEFAULT_INTERVAL = 0;

        var attempts = [];

        var opts = {
            times: DEFAULT_TIMES,
            interval: DEFAULT_INTERVAL
        };

        function parseTimes(acc, t){
            if(typeof t === 'number'){
                acc.times = parseInt(t, 10) || DEFAULT_TIMES;
            } else if(typeof t === 'object'){
                acc.times = parseInt(t.times, 10) || DEFAULT_TIMES;
                acc.interval = parseInt(t.interval, 10) || DEFAULT_INTERVAL;
            } else {
                throw new Error('Unsupported argument type for \'times\': ' + typeof t);
            }
        }

        var length = arguments.length;
        if (length < 1 || length > 3) {
            throw new Error('Invalid arguments - must be either (task), (task, callback), (times, task) or (times, task, callback)');
        } else if (length <= 2 && typeof times === 'function') {
            callback = task;
            task = times;
        }
        if (typeof times !== 'function') {
            parseTimes(opts, times);
        }
        opts.callback = callback;
        opts.task = task;

        function wrappedTask(wrappedCallback, wrappedResults) {
            function retryAttempt(task, finalAttempt) {
                return function(seriesCallback) {
                    task(function(err, result){
                        seriesCallback(!err || finalAttempt, {err: err, result: result});
                    }, wrappedResults);
                };
            }

            function retryInterval(interval){
                return function(seriesCallback){
                    setTimeout(function(){
                        seriesCallback(null);
                    }, interval);
                };
            }

            while (opts.times) {

                var finalAttempt = !(opts.times-=1);
                attempts.push(retryAttempt(opts.task, finalAttempt));
                if(!finalAttempt && opts.interval > 0){
                    attempts.push(retryInterval(opts.interval));
                }
            }

            async.series(attempts, function(done, data){
                data = data[data.length - 1];
                (wrappedCallback || opts.callback)(data.err, data.result);
            });
        }

        // If a callback is passed, run this as a controll flow
        return opts.callback ? wrappedTask() : wrappedTask;
    };

    async.waterfall = function (tasks, callback) {
        callback = _once(callback || noop);
        if (!_isArray(tasks)) {
            var err = new Error('First argument to waterfall must be an array of functions');
            return callback(err);
        }
        if (!tasks.length) {
            return callback();
        }
        function wrapIterator(iterator) {
            return _restParam(function (err, args) {
                if (err) {
                    callback.apply(null, [err].concat(args));
                }
                else {
                    var next = iterator.next();
                    if (next) {
                        args.push(wrapIterator(next));
                    }
                    else {
                        args.push(callback);
                    }
                    ensureAsync(iterator).apply(null, args);
                }
            });
        }
        wrapIterator(async.iterator(tasks))();
    };

    function _parallel(eachfn, tasks, callback) {
        callback = callback || noop;
        var results = _isArrayLike(tasks) ? [] : {};

        eachfn(tasks, function (task, key, callback) {
            task(_restParam(function (err, args) {
                if (args.length <= 1) {
                    args = args[0];
                }
                results[key] = args;
                callback(err);
            }));
        }, function (err) {
            callback(err, results);
        });
    }

    async.parallel = function (tasks, callback) {
        _parallel(async.eachOf, tasks, callback);
    };

    async.parallelLimit = function(tasks, limit, callback) {
        _parallel(_eachOfLimit(limit), tasks, callback);
    };

    async.series = function(tasks, callback) {
        _parallel(async.eachOfSeries, tasks, callback);
    };

    async.iterator = function (tasks) {
        function makeCallback(index) {
            function fn() {
                if (tasks.length) {
                    tasks[index].apply(null, arguments);
                }
                return fn.next();
            }
            fn.next = function () {
                return (index < tasks.length - 1) ? makeCallback(index + 1): null;
            };
            return fn;
        }
        return makeCallback(0);
    };

    async.apply = _restParam(function (fn, args) {
        return _restParam(function (callArgs) {
            return fn.apply(
                null, args.concat(callArgs)
            );
        });
    });

    function _concat(eachfn, arr, fn, callback) {
        var result = [];
        eachfn(arr, function (x, index, cb) {
            fn(x, function (err, y) {
                result = result.concat(y || []);
                cb(err);
            });
        }, function (err) {
            callback(err, result);
        });
    }
    async.concat = doParallel(_concat);
    async.concatSeries = doSeries(_concat);

    async.whilst = function (test, iterator, callback) {
        callback = callback || noop;
        if (test()) {
            var next = _restParam(function(err, args) {
                if (err) {
                    callback(err);
                } else if (test.apply(this, args)) {
                    iterator(next);
                } else {
                    callback.apply(null, [null].concat(args));
                }
            });
            iterator(next);
        } else {
            callback(null);
        }
    };

    async.doWhilst = function (iterator, test, callback) {
        var calls = 0;
        return async.whilst(function() {
            return ++calls <= 1 || test.apply(this, arguments);
        }, iterator, callback);
    };

    async.until = function (test, iterator, callback) {
        return async.whilst(function() {
            return !test.apply(this, arguments);
        }, iterator, callback);
    };

    async.doUntil = function (iterator, test, callback) {
        return async.doWhilst(iterator, function() {
            return !test.apply(this, arguments);
        }, callback);
    };

    async.during = function (test, iterator, callback) {
        callback = callback || noop;

        var next = _restParam(function(err, args) {
            if (err) {
                callback(err);
            } else {
                args.push(check);
                test.apply(this, args);
            }
        });

        var check = function(err, truth) {
            if (err) {
                callback(err);
            } else if (truth) {
                iterator(next);
            } else {
                callback(null);
            }
        };

        test(check);
    };

    async.doDuring = function (iterator, test, callback) {
        var calls = 0;
        async.during(function(next) {
            if (calls++ < 1) {
                next(null, true);
            } else {
                test.apply(this, arguments);
            }
        }, iterator, callback);
    };

    function _queue(worker, concurrency, payload) {
        if (concurrency == null) {
            concurrency = 1;
        }
        else if(concurrency === 0) {
            throw new Error('Concurrency must not be zero');
        }
        function _insert(q, data, pos, callback) {
            if (callback != null && typeof callback !== "function") {
                throw new Error("task callback must be a function");
            }
            q.started = true;
            if (!_isArray(data)) {
                data = [data];
            }
            if(data.length === 0 && q.idle()) {
                // call drain immediately if there are no tasks
                return async.setImmediate(function() {
                    q.drain();
                });
            }
            _arrayEach(data, function(task) {
                var item = {
                    data: task,
                    callback: callback || noop
                };

                if (pos) {
                    q.tasks.unshift(item);
                } else {
                    q.tasks.push(item);
                }

                if (q.tasks.length === q.concurrency) {
                    q.saturated();
                }
            });
            async.setImmediate(q.process);
        }
        function _next(q, tasks) {
            return function(){
                workers -= 1;

                var removed = false;
                var args = arguments;
                _arrayEach(tasks, function (task) {
                    _arrayEach(workersList, function (worker, index) {
                        if (worker === task && !removed) {
                            workersList.splice(index, 1);
                            removed = true;
                        }
                    });

                    task.callback.apply(task, args);
                });
                if (q.tasks.length + workers === 0) {
                    q.drain();
                }
                q.process();
            };
        }

        var workers = 0;
        var workersList = [];
        var q = {
            tasks: [],
            concurrency: concurrency,
            payload: payload,
            saturated: noop,
            empty: noop,
            drain: noop,
            started: false,
            paused: false,
            push: function (data, callback) {
                _insert(q, data, false, callback);
            },
            kill: function () {
                q.drain = noop;
                q.tasks = [];
            },
            unshift: function (data, callback) {
                _insert(q, data, true, callback);
            },
            process: function () {
                while(!q.paused && workers < q.concurrency && q.tasks.length){

                    var tasks = q.payload ?
                        q.tasks.splice(0, q.payload) :
                        q.tasks.splice(0, q.tasks.length);

                    var data = _map(tasks, function (task) {
                        return task.data;
                    });

                    if (q.tasks.length === 0) {
                        q.empty();
                    }
                    workers += 1;
                    workersList.push(tasks[0]);
                    var cb = only_once(_next(q, tasks));
                    worker(data, cb);
                }
            },
            length: function () {
                return q.tasks.length;
            },
            running: function () {
                return workers;
            },
            workersList: function () {
                return workersList;
            },
            idle: function() {
                return q.tasks.length + workers === 0;
            },
            pause: function () {
                q.paused = true;
            },
            resume: function () {
                if (q.paused === false) { return; }
                q.paused = false;
                var resumeCount = Math.min(q.concurrency, q.tasks.length);
                // Need to call q.process once per concurrent
                // worker to preserve full concurrency after pause
                for (var w = 1; w <= resumeCount; w++) {
                    async.setImmediate(q.process);
                }
            }
        };
        return q;
    }

    async.queue = function (worker, concurrency) {
        var q = _queue(function (items, cb) {
            worker(items[0], cb);
        }, concurrency, 1);

        return q;
    };

    async.priorityQueue = function (worker, concurrency) {

        function _compareTasks(a, b){
            return a.priority - b.priority;
        }

        function _binarySearch(sequence, item, compare) {
            var beg = -1,
                end = sequence.length - 1;
            while (beg < end) {
                var mid = beg + ((end - beg + 1) >>> 1);
                if (compare(item, sequence[mid]) >= 0) {
                    beg = mid;
                } else {
                    end = mid - 1;
                }
            }
            return beg;
        }

        function _insert(q, data, priority, callback) {
            if (callback != null && typeof callback !== "function") {
                throw new Error("task callback must be a function");
            }
            q.started = true;
            if (!_isArray(data)) {
                data = [data];
            }
            if(data.length === 0) {
                // call drain immediately if there are no tasks
                return async.setImmediate(function() {
                    q.drain();
                });
            }
            _arrayEach(data, function(task) {
                var item = {
                    data: task,
                    priority: priority,
                    callback: typeof callback === 'function' ? callback : noop
                };

                q.tasks.splice(_binarySearch(q.tasks, item, _compareTasks) + 1, 0, item);

                if (q.tasks.length === q.concurrency) {
                    q.saturated();
                }
                async.setImmediate(q.process);
            });
        }

        // Start with a normal queue
        var q = async.queue(worker, concurrency);

        // Override push to accept second parameter representing priority
        q.push = function (data, priority, callback) {
            _insert(q, data, priority, callback);
        };

        // Remove unshift function
        delete q.unshift;

        return q;
    };

    async.cargo = function (worker, payload) {
        return _queue(worker, 1, payload);
    };

    function _console_fn(name) {
        return _restParam(function (fn, args) {
            fn.apply(null, args.concat([_restParam(function (err, args) {
                if (typeof console === 'object') {
                    if (err) {
                        if (console.error) {
                            console.error(err);
                        }
                    }
                    else if (console[name]) {
                        _arrayEach(args, function (x) {
                            console[name](x);
                        });
                    }
                }
            })]));
        });
    }
    async.log = _console_fn('log');
    async.dir = _console_fn('dir');
    /*async.info = _console_fn('info');
    async.warn = _console_fn('warn');
    async.error = _console_fn('error');*/

    async.memoize = function (fn, hasher) {
        var memo = {};
        var queues = {};
        var has = Object.prototype.hasOwnProperty;
        hasher = hasher || identity;
        var memoized = _restParam(function memoized(args) {
            var callback = args.pop();
            var key = hasher.apply(null, args);
            if (has.call(memo, key)) {   
                async.setImmediate(function () {
                    callback.apply(null, memo[key]);
                });
            }
            else if (has.call(queues, key)) {
                queues[key].push(callback);
            }
            else {
                queues[key] = [callback];
                fn.apply(null, args.concat([_restParam(function (args) {
                    memo[key] = args;
                    var q = queues[key];
                    delete queues[key];
                    for (var i = 0, l = q.length; i < l; i++) {
                        q[i].apply(null, args);
                    }
                })]));
            }
        });
        memoized.memo = memo;
        memoized.unmemoized = fn;
        return memoized;
    };

    async.unmemoize = function (fn) {
        return function () {
            return (fn.unmemoized || fn).apply(null, arguments);
        };
    };

    function _times(mapper) {
        return function (count, iterator, callback) {
            mapper(_range(count), iterator, callback);
        };
    }

    async.times = _times(async.map);
    async.timesSeries = _times(async.mapSeries);
    async.timesLimit = function (count, limit, iterator, callback) {
        return async.mapLimit(_range(count), limit, iterator, callback);
    };

    async.seq = function (/* functions... */) {
        var fns = arguments;
        return _restParam(function (args) {
            var that = this;

            var callback = args[args.length - 1];
            if (typeof callback == 'function') {
                args.pop();
            } else {
                callback = noop;
            }

            async.reduce(fns, args, function (newargs, fn, cb) {
                fn.apply(that, newargs.concat([_restParam(function (err, nextargs) {
                    cb(err, nextargs);
                })]));
            },
            function (err, results) {
                callback.apply(that, [err].concat(results));
            });
        });
    };

    async.compose = function (/* functions... */) {
        return async.seq.apply(null, Array.prototype.reverse.call(arguments));
    };


    function _applyEach(eachfn) {
        return _restParam(function(fns, args) {
            var go = _restParam(function(args) {
                var that = this;
                var callback = args.pop();
                return eachfn(fns, function (fn, _, cb) {
                    fn.apply(that, args.concat([cb]));
                },
                callback);
            });
            if (args.length) {
                return go.apply(this, args);
            }
            else {
                return go;
            }
        });
    }

    async.applyEach = _applyEach(async.eachOf);
    async.applyEachSeries = _applyEach(async.eachOfSeries);


    async.forever = function (fn, callback) {
        var done = only_once(callback || noop);
        var task = ensureAsync(fn);
        function next(err) {
            if (err) {
                return done(err);
            }
            task(next);
        }
        next();
    };

    function ensureAsync(fn) {
        return _restParam(function (args) {
            var callback = args.pop();
            args.push(function () {
                var innerArgs = arguments;
                if (sync) {
                    async.setImmediate(function () {
                        callback.apply(null, innerArgs);
                    });
                } else {
                    callback.apply(null, innerArgs);
                }
            });
            var sync = true;
            fn.apply(this, args);
            sync = false;
        });
    }

    async.ensureAsync = ensureAsync;

    async.constant = _restParam(function(values) {
        var args = [null].concat(values);
        return function (callback) {
            return callback.apply(this, args);
        };
    });

    async.wrapSync =
    async.asyncify = function asyncify(func) {
        return _restParam(function (args) {
            var callback = args.pop();
            var result;
            try {
                result = func.apply(this, args);
            } catch (e) {
                return callback(e);
            }
            // if result is Promise object
            if (_isObject(result) && typeof result.then === "function") {
                result.then(function(value) {
                    callback(null, value);
                })["catch"](function(err) {
                    callback(err.message ? err : new Error(err));
                });
            } else {
                callback(null, result);
            }
        });
    };

    // Node.js
    if (typeof module === 'object' && module.exports) {
        module.exports = async;
    }
    // AMD / RequireJS
    else if (typeof define === 'function' && define.amd) {
        define([], function () {
            return async;
        });
    }
    // included directly via <script> tag
    else {
        root.async = async;
    }

}());
});

var async$1 = interopDefault(async);

var inherits_browser = createCommonjsModule(function (module) {
if (typeof Object.create === 'function') {
  // implementation from standard node.js 'util' module
  module.exports = function inherits(ctor, superCtor) {
    ctor.super_ = superCtor
    ctor.prototype = Object.create(superCtor.prototype, {
      constructor: {
        value: ctor,
        enumerable: false,
        writable: true,
        configurable: true
      }
    });
  };
} else {
  // old school shim for old browsers
  module.exports = function inherits(ctor, superCtor) {
    ctor.super_ = superCtor
    var TempCtor = function () {}
    TempCtor.prototype = superCtor.prototype
    ctor.prototype = new TempCtor()
    ctor.prototype.constructor = ctor
  }
}
});

var inherits = interopDefault(inherits_browser);

var randomId = createCommonjsModule(function (module) {
// gotta keep it within MAX_SAFE_INTEGER
var extraDigits = 3

module.exports = createRandomId


function createRandomId(){
  // 13 time digits
  var datePart = new Date().getTime()*Math.pow(10, extraDigits)
  // 3 random digits
  var extraPart = Math.floor(Math.random()*Math.pow(10, extraDigits))
  // 16 digits
  return datePart+extraPart
}
});

var randomId$1 = interopDefault(randomId);


var require$$1$1 = Object.freeze({
  default: randomId$1
});

var require$$1$1 = Object.freeze({
  default: randomId$1
});

var immutable = createCommonjsModule(function (module) {
module.exports = extend

var hasOwnProperty = Object.prototype.hasOwnProperty;

function extend() {
    var arguments$1 = arguments;

    var target = {}

    for (var i = 0; i < arguments.length; i++) {
        var source = arguments$1[i]

        for (var key in source) {
            if (hasOwnProperty.call(source, key)) {
                target[key] = source[key]
            }
        }
    }

    return target
}
});

var immutable$1 = interopDefault(immutable);


var require$$0$1 = Object.freeze({
    default: immutable$1
});

var require$$0$1 = Object.freeze({
    default: immutable$1
});

var createPayload = createCommonjsModule(function (module) {
var getRandomId = interopDefault(require$$1$1)
var extend = interopDefault(require$$0$1)

module.exports = createPayload


function createPayload(data){
  return extend({
    // defaults
    id: getRandomId(),
    jsonrpc: '2.0',
    params: [],
    // user-specified
  }, data)
}
});

var createPayload$1 = interopDefault(createPayload);


var require$$1 = Object.freeze({
  default: createPayload$1
});

var require$$1 = Object.freeze({
  default: createPayload$1
});

var subprovider = createCommonjsModule(function (module) {
var createPayload = interopDefault(require$$1)

module.exports = SubProvider

// this is the base class for a subprovider -- mostly helpers


function SubProvider() {

}

SubProvider.prototype.setEngine = function(engine) {
  var self = this
  self.engine = engine
  engine.on('block', function(block) {
    self.currentBlock = block
  })
}

SubProvider.prototype.handleRequest = function(payload, next, end) {
  throw new Error('Subproviders should override `handleRequest`.')
}

SubProvider.prototype.emitPayload = function(payload, cb){
  var self = this
  self.engine.sendAsync(createPayload(payload), cb)
}
});

var Subprovider = interopDefault(subprovider);


var require$$0 = Object.freeze({
  default: Subprovider
});

var require$$0 = Object.freeze({
  default: Subprovider
});

var __cov_i0o4KAobeztXCtW656hOqA = (Function('return this'))();
if (!__cov_i0o4KAobeztXCtW656hOqA.__coverage__) { __cov_i0o4KAobeztXCtW656hOqA.__coverage__ = {}; }
__cov_i0o4KAobeztXCtW656hOqA = __cov_i0o4KAobeztXCtW656hOqA.__coverage__;
if (!(__cov_i0o4KAobeztXCtW656hOqA['/Users/jeffscottward/Documents/Development/Github/ConsenSys/core/uPort/libs/uport-lib/lib/uportsubprovider.js'])) {
   __cov_i0o4KAobeztXCtW656hOqA['/Users/jeffscottward/Documents/Development/Github/ConsenSys/core/uPort/libs/uport-lib/lib/uportsubprovider.js'] = {"path":"/Users/jeffscottward/Documents/Development/Github/ConsenSys/core/uPort/libs/uport-lib/lib/uportsubprovider.js","s":{"1":0,"2":1,"3":0,"4":0,"5":0,"6":0,"7":0,"8":0,"9":0,"10":0,"11":0,"12":0,"13":0,"14":0,"15":0,"16":0,"17":0,"18":0,"19":0,"20":0,"21":0,"22":0,"23":0,"24":0,"25":0,"26":0,"27":0,"28":0,"29":0,"30":0,"31":0,"32":0,"33":0,"34":0,"35":0,"36":0,"37":0,"38":0,"39":0,"40":0,"41":0,"42":0,"43":0,"44":0,"45":0,"46":0,"47":0,"48":0,"49":0,"50":0,"51":0,"52":0,"53":0,"54":0,"55":0,"56":0,"57":0,"58":0,"59":0,"60":0,"61":0,"62":0,"63":0,"64":0,"65":0,"66":0,"67":0,"68":0,"69":0,"70":0,"71":0,"72":0,"73":0,"74":0,"75":0},"b":{"1":[0,0,0,0],"2":[0,0],"3":[0,0],"4":[0,0],"5":[0,0],"6":[0,0],"7":[0,0],"8":[0,0],"9":[0,0],"10":[0,0],"11":[0,0],"12":[0,0],"13":[0,0],"14":[0,0]},"f":{"1":0,"2":0,"3":0,"4":0,"5":0,"6":0,"7":0,"8":0,"9":0,"10":0,"11":0,"12":0,"13":0,"14":0},"fnMap":{"1":{"name":"UportSubprovider","line":25,"loc":{"start":{"line":25,"column":0},"end":{"line":25,"column":33}}},"2":{"name":"(anonymous_2)","line":44,"loc":{"start":{"line":44,"column":43},"end":{"line":44,"column":73}}},"3":{"name":"(anonymous_3)","line":50,"loc":{"start":{"line":50,"column":22},"end":{"line":50,"column":46}}},"4":{"name":"(anonymous_4)","line":56,"loc":{"start":{"line":56,"column":22},"end":{"line":56,"column":46}}},"5":{"name":"(anonymous_5)","line":98,"loc":{"start":{"line":98,"column":43},"end":{"line":98,"column":67}}},"6":{"name":"(anonymous_6)","line":118,"loc":{"start":{"line":118,"column":49},"end":{"line":118,"column":71}}},"7":{"name":"(anonymous_7)","line":124,"loc":{"start":{"line":124,"column":38},"end":{"line":124,"column":61}}},"8":{"name":"(anonymous_8)","line":130,"loc":{"start":{"line":130,"column":40},"end":{"line":130,"column":54}}},"9":{"name":"(anonymous_9)","line":139,"loc":{"start":{"line":139,"column":40},"end":{"line":139,"column":64}}},"10":{"name":"(anonymous_10)","line":147,"loc":{"start":{"line":147,"column":49},"end":{"line":147,"column":73}}},"11":{"name":"(anonymous_11)","line":149,"loc":{"start":{"line":149,"column":37},"end":{"line":149,"column":67}}},"12":{"name":"(anonymous_12)","line":156,"loc":{"start":{"line":156,"column":45},"end":{"line":156,"column":70}}},"13":{"name":"(anonymous_13)","line":158,"loc":{"start":{"line":158,"column":38},"end":{"line":158,"column":68}}},"14":{"name":"(anonymous_14)","line":165,"loc":{"start":{"line":165,"column":44},"end":{"line":165,"column":73}}}},"statementMap":{"1":{"start":{"line":23,"column":0},"end":{"line":23,"column":39}},"2":{"start":{"line":25,"column":0},"end":{"line":42,"column":1}},"3":{"start":{"line":27,"column":2},"end":{"line":27,"column":33}},"4":{"start":{"line":31,"column":2},"end":{"line":31,"column":53}},"5":{"start":{"line":36,"column":2},"end":{"line":36,"column":41}},"6":{"start":{"line":38,"column":2},"end":{"line":38,"column":29}},"7":{"start":{"line":41,"column":2},"end":{"line":41,"column":29}},"8":{"start":{"line":44,"column":0},"end":{"line":96,"column":1}},"9":{"start":{"line":45,"column":2},"end":{"line":45,"column":17}},"10":{"start":{"line":47,"column":2},"end":{"line":95,"column":3}},"11":{"start":{"line":50,"column":6},"end":{"line":52,"column":8}},"12":{"start":{"line":51,"column":8},"end":{"line":51,"column":25}},"13":{"start":{"line":53,"column":6},"end":{"line":53,"column":12}},"14":{"start":{"line":56,"column":6},"end":{"line":59,"column":8}},"15":{"start":{"line":58,"column":8},"end":{"line":58,"column":27}},"16":{"start":{"line":60,"column":6},"end":{"line":60,"column":12}},"17":{"start":{"line":63,"column":6},"end":{"line":63,"column":38}},"18":{"start":{"line":64,"column":6},"end":{"line":68,"column":13}},"19":{"start":{"line":69,"column":6},"end":{"line":69,"column":12}},"20":{"start":{"line":92,"column":6},"end":{"line":92,"column":12}},"21":{"start":{"line":93,"column":6},"end":{"line":93,"column":12}},"22":{"start":{"line":98,"column":0},"end":{"line":116,"column":1}},"23":{"start":{"line":99,"column":2},"end":{"line":99,"column":37}},"24":{"start":{"line":100,"column":2},"end":{"line":100,"column":12}},"25":{"start":{"line":101,"column":2},"end":{"line":103,"column":3}},"26":{"start":{"line":102,"column":4},"end":{"line":102,"column":79}},"27":{"start":{"line":104,"column":2},"end":{"line":106,"column":3}},"28":{"start":{"line":105,"column":4},"end":{"line":105,"column":51}},"29":{"start":{"line":107,"column":2},"end":{"line":110,"column":3}},"30":{"start":{"line":108,"column":4},"end":{"line":108,"column":39}},"31":{"start":{"line":109,"column":4},"end":{"line":109,"column":47}},"32":{"start":{"line":111,"column":2},"end":{"line":114,"column":3}},"33":{"start":{"line":112,"column":4},"end":{"line":112,"column":56}},"34":{"start":{"line":113,"column":4},"end":{"line":113,"column":55}},"35":{"start":{"line":115,"column":2},"end":{"line":115,"column":15}},"36":{"start":{"line":118,"column":0},"end":{"line":128,"column":1}},"37":{"start":{"line":119,"column":2},"end":{"line":119,"column":17}},"38":{"start":{"line":121,"column":2},"end":{"line":121,"column":43}},"39":{"start":{"line":122,"column":2},"end":{"line":122,"column":40}},"40":{"start":{"line":123,"column":2},"end":{"line":123,"column":28}},"41":{"start":{"line":124,"column":2},"end":{"line":127,"column":4}},"42":{"start":{"line":125,"column":4},"end":{"line":125,"column":18}},"43":{"start":{"line":126,"column":4},"end":{"line":126,"column":19}},"44":{"start":{"line":130,"column":0},"end":{"line":145,"column":1}},"45":{"start":{"line":131,"column":2},"end":{"line":131,"column":17}},"46":{"start":{"line":133,"column":2},"end":{"line":144,"column":3}},"47":{"start":{"line":134,"column":4},"end":{"line":134,"column":26}},"48":{"start":{"line":136,"column":4},"end":{"line":136,"column":50}},"49":{"start":{"line":137,"column":4},"end":{"line":137,"column":56}},"50":{"start":{"line":138,"column":4},"end":{"line":138,"column":36}},"51":{"start":{"line":139,"column":4},"end":{"line":143,"column":6}},"52":{"start":{"line":140,"column":6},"end":{"line":140,"column":20}},"53":{"start":{"line":141,"column":6},"end":{"line":141,"column":38}},"54":{"start":{"line":141,"column":16},"end":{"line":141,"column":38}},"55":{"start":{"line":142,"column":6},"end":{"line":142,"column":22}},"56":{"start":{"line":147,"column":0},"end":{"line":154,"column":1}},"57":{"start":{"line":148,"column":2},"end":{"line":148,"column":17}},"58":{"start":{"line":149,"column":2},"end":{"line":153,"column":4}},"59":{"start":{"line":150,"column":4},"end":{"line":150,"column":27}},"60":{"start":{"line":150,"column":13},"end":{"line":150,"column":27}},"61":{"start":{"line":151,"column":4},"end":{"line":151,"column":110}},"62":{"start":{"line":151,"column":24},"end":{"line":151,"column":110}},"63":{"start":{"line":152,"column":4},"end":{"line":152,"column":8}},"64":{"start":{"line":156,"column":0},"end":{"line":163,"column":1}},"65":{"start":{"line":157,"column":2},"end":{"line":157,"column":17}},"66":{"start":{"line":158,"column":2},"end":{"line":162,"column":4}},"67":{"start":{"line":159,"column":4},"end":{"line":159,"column":27}},"68":{"start":{"line":159,"column":13},"end":{"line":159,"column":27}},"69":{"start":{"line":160,"column":4},"end":{"line":160,"column":106}},"70":{"start":{"line":160,"column":24},"end":{"line":160,"column":106}},"71":{"start":{"line":161,"column":4},"end":{"line":161,"column":8}},"72":{"start":{"line":165,"column":0},"end":{"line":170,"column":1}},"73":{"start":{"line":166,"column":2},"end":{"line":166,"column":17}},"74":{"start":{"line":168,"column":2},"end":{"line":168,"column":52}},"75":{"start":{"line":169,"column":2},"end":{"line":169,"column":25}}},"branchMap":{"1":{"line":47,"type":"switch","locations":[{"start":{"line":49,"column":4},"end":{"line":53,"column":12}},{"start":{"line":55,"column":4},"end":{"line":60,"column":12}},{"start":{"line":62,"column":4},"end":{"line":69,"column":12}},{"start":{"line":91,"column":4},"end":{"line":93,"column":12}}]},"2":{"line":101,"type":"if","locations":[{"start":{"line":101,"column":2},"end":{"line":101,"column":2}},{"start":{"line":101,"column":2},"end":{"line":101,"column":2}}]},"3":{"line":104,"type":"if","locations":[{"start":{"line":104,"column":2},"end":{"line":104,"column":2}},{"start":{"line":104,"column":2},"end":{"line":104,"column":2}}]},"4":{"line":107,"type":"if","locations":[{"start":{"line":107,"column":2},"end":{"line":107,"column":2}},{"start":{"line":107,"column":2},"end":{"line":107,"column":2}}]},"5":{"line":108,"type":"cond-expr","locations":[{"start":{"line":108,"column":30},"end":{"line":108,"column":33}},{"start":{"line":108,"column":36},"end":{"line":108,"column":39}}]},"6":{"line":111,"type":"if","locations":[{"start":{"line":111,"column":2},"end":{"line":111,"column":2}},{"start":{"line":111,"column":2},"end":{"line":111,"column":2}}]},"7":{"line":112,"type":"cond-expr","locations":[{"start":{"line":112,"column":47},"end":{"line":112,"column":50}},{"start":{"line":112,"column":53},"end":{"line":112,"column":56}}]},"8":{"line":112,"type":"binary-expr","locations":[{"start":{"line":112,"column":13},"end":{"line":112,"column":27}},{"start":{"line":112,"column":31},"end":{"line":112,"column":44}}]},"9":{"line":133,"type":"if","locations":[{"start":{"line":133,"column":2},"end":{"line":133,"column":2}},{"start":{"line":133,"column":2},"end":{"line":133,"column":2}}]},"10":{"line":141,"type":"if","locations":[{"start":{"line":141,"column":6},"end":{"line":141,"column":6}},{"start":{"line":141,"column":6},"end":{"line":141,"column":6}}]},"11":{"line":150,"type":"if","locations":[{"start":{"line":150,"column":4},"end":{"line":150,"column":4}},{"start":{"line":150,"column":4},"end":{"line":150,"column":4}}]},"12":{"line":151,"type":"if","locations":[{"start":{"line":151,"column":4},"end":{"line":151,"column":4}},{"start":{"line":151,"column":4},"end":{"line":151,"column":4}}]},"13":{"line":159,"type":"if","locations":[{"start":{"line":159,"column":4},"end":{"line":159,"column":4}},{"start":{"line":159,"column":4},"end":{"line":159,"column":4}}]},"14":{"line":160,"type":"if","locations":[{"start":{"line":160,"column":4},"end":{"line":160,"column":4}},{"start":{"line":160,"column":4},"end":{"line":160,"column":4}}]}}};
}
__cov_i0o4KAobeztXCtW656hOqA = __cov_i0o4KAobeztXCtW656hOqA['/Users/jeffscottward/Documents/Development/Github/ConsenSys/core/uPort/libs/uport-lib/lib/uportsubprovider.js'];
__cov_i0o4KAobeztXCtW656hOqA.s['1']++;inherits(UportSubprovider,Subprovider);function UportSubprovider(opts){__cov_i0o4KAobeztXCtW656hOqA.f['1']++;__cov_i0o4KAobeztXCtW656hOqA.s['3']++;this.msgServer=opts.msgServer;__cov_i0o4KAobeztXCtW656hOqA.s['4']++;this.uportConnectHandler=opts.uportConnectHandler;__cov_i0o4KAobeztXCtW656hOqA.s['5']++;this.ethUriHandler=opts.ethUriHandler;__cov_i0o4KAobeztXCtW656hOqA.s['6']++;this.closeQR=opts.closeQR;__cov_i0o4KAobeztXCtW656hOqA.s['7']++;this.address=opts.address;}__cov_i0o4KAobeztXCtW656hOqA.s['8']++;UportSubprovider.prototype.handleRequest=function(payload,next,end){__cov_i0o4KAobeztXCtW656hOqA.f['2']++;__cov_i0o4KAobeztXCtW656hOqA.s['9']++;var self=this;__cov_i0o4KAobeztXCtW656hOqA.s['10']++;switch(payload.method){case'eth_coinbase':__cov_i0o4KAobeztXCtW656hOqA.b['1'][0]++;__cov_i0o4KAobeztXCtW656hOqA.s['11']++;self.getAddress(function(err,address){__cov_i0o4KAobeztXCtW656hOqA.f['3']++;__cov_i0o4KAobeztXCtW656hOqA.s['12']++;end(err,address);});__cov_i0o4KAobeztXCtW656hOqA.s['13']++;return;case'eth_accounts':__cov_i0o4KAobeztXCtW656hOqA.b['1'][1]++;__cov_i0o4KAobeztXCtW656hOqA.s['14']++;self.getAddress(function(err,address){__cov_i0o4KAobeztXCtW656hOqA.f['4']++;__cov_i0o4KAobeztXCtW656hOqA.s['15']++;end(err,[address]);});__cov_i0o4KAobeztXCtW656hOqA.s['16']++;return;case'eth_sendTransaction':__cov_i0o4KAobeztXCtW656hOqA.b['1'][2]++;__cov_i0o4KAobeztXCtW656hOqA.s['17']++;var txParams=payload.params[0];__cov_i0o4KAobeztXCtW656hOqA.s['18']++;async$1.waterfall([self.validateTransaction.bind(self,txParams),self.txParamsToUri.bind(self,txParams),self.signAndReturnTxHash.bind(self)],end);__cov_i0o4KAobeztXCtW656hOqA.s['19']++;return;default:__cov_i0o4KAobeztXCtW656hOqA.b['1'][3]++;__cov_i0o4KAobeztXCtW656hOqA.s['20']++;next();__cov_i0o4KAobeztXCtW656hOqA.s['21']++;return;}};__cov_i0o4KAobeztXCtW656hOqA.s['22']++;UportSubprovider.prototype.txParamsToUri=function(txParams,cb){__cov_i0o4KAobeztXCtW656hOqA.f['5']++;__cov_i0o4KAobeztXCtW656hOqA.s['23']++;var uri='ethereum:'+txParams.to;__cov_i0o4KAobeztXCtW656hOqA.s['24']++;var symbol;__cov_i0o4KAobeztXCtW656hOqA.s['25']++;if(!txParams.to){__cov_i0o4KAobeztXCtW656hOqA.b['2'][0]++;__cov_i0o4KAobeztXCtW656hOqA.s['26']++;return cb(new Error('Contract creation is not supported by uportProvider'));}else{__cov_i0o4KAobeztXCtW656hOqA.b['2'][1]++;}__cov_i0o4KAobeztXCtW656hOqA.s['27']++;if(txParams.value){__cov_i0o4KAobeztXCtW656hOqA.b['3'][0]++;__cov_i0o4KAobeztXCtW656hOqA.s['28']++;uri+='?value='+parseInt(txParams.value,16);}else{__cov_i0o4KAobeztXCtW656hOqA.b['3'][1]++;}__cov_i0o4KAobeztXCtW656hOqA.s['29']++;if(txParams.data){__cov_i0o4KAobeztXCtW656hOqA.b['4'][0]++;__cov_i0o4KAobeztXCtW656hOqA.s['30']++;symbol=txParams.value?(__cov_i0o4KAobeztXCtW656hOqA.b['5'][0]++,'&'):(__cov_i0o4KAobeztXCtW656hOqA.b['5'][1]++,'?');__cov_i0o4KAobeztXCtW656hOqA.s['31']++;uri+=symbol+'bytecode='+txParams.data;}else{__cov_i0o4KAobeztXCtW656hOqA.b['4'][1]++;}__cov_i0o4KAobeztXCtW656hOqA.s['32']++;if(txParams.gas){__cov_i0o4KAobeztXCtW656hOqA.b['6'][0]++;__cov_i0o4KAobeztXCtW656hOqA.s['33']++;symbol=(__cov_i0o4KAobeztXCtW656hOqA.b['8'][0]++,txParams.value)||(__cov_i0o4KAobeztXCtW656hOqA.b['8'][1]++,txParams.data)?(__cov_i0o4KAobeztXCtW656hOqA.b['7'][0]++,'&'):(__cov_i0o4KAobeztXCtW656hOqA.b['7'][1]++,'?');__cov_i0o4KAobeztXCtW656hOqA.s['34']++;uri+=symbol+'gas='+parseInt(txParams.gas,16);}else{__cov_i0o4KAobeztXCtW656hOqA.b['6'][1]++;}__cov_i0o4KAobeztXCtW656hOqA.s['35']++;cb(null,uri);};__cov_i0o4KAobeztXCtW656hOqA.s['36']++;UportSubprovider.prototype.signAndReturnTxHash=function(ethUri,cb){__cov_i0o4KAobeztXCtW656hOqA.f['6']++;__cov_i0o4KAobeztXCtW656hOqA.s['37']++;var self=this;__cov_i0o4KAobeztXCtW656hOqA.s['38']++;var topic=self.msgServer.newTopic('tx');__cov_i0o4KAobeztXCtW656hOqA.s['39']++;ethUri+='&callback_url='+topic.url;__cov_i0o4KAobeztXCtW656hOqA.s['40']++;self.ethUriHandler(ethUri);__cov_i0o4KAobeztXCtW656hOqA.s['41']++;self.msgServer.waitForResult(topic,function(err,txHash){__cov_i0o4KAobeztXCtW656hOqA.f['7']++;__cov_i0o4KAobeztXCtW656hOqA.s['42']++;self.closeQR();__cov_i0o4KAobeztXCtW656hOqA.s['43']++;cb(err,txHash);});};__cov_i0o4KAobeztXCtW656hOqA.s['44']++;UportSubprovider.prototype.getAddress=function(cb){__cov_i0o4KAobeztXCtW656hOqA.f['8']++;__cov_i0o4KAobeztXCtW656hOqA.s['45']++;var self=this;__cov_i0o4KAobeztXCtW656hOqA.s['46']++;if(self.address){__cov_i0o4KAobeztXCtW656hOqA.b['9'][0]++;__cov_i0o4KAobeztXCtW656hOqA.s['47']++;cb(null,self.address);}else{__cov_i0o4KAobeztXCtW656hOqA.b['9'][1]++;__cov_i0o4KAobeztXCtW656hOqA.s['48']++;var topic=self.msgServer.newTopic('address');__cov_i0o4KAobeztXCtW656hOqA.s['49']++;var ethUri='ethereum:me?callback_url='+topic.url;__cov_i0o4KAobeztXCtW656hOqA.s['50']++;self.uportConnectHandler(ethUri);__cov_i0o4KAobeztXCtW656hOqA.s['51']++;self.msgServer.waitForResult(topic,function(err,address){__cov_i0o4KAobeztXCtW656hOqA.f['9']++;__cov_i0o4KAobeztXCtW656hOqA.s['52']++;self.closeQR();__cov_i0o4KAobeztXCtW656hOqA.s['53']++;if(!err){__cov_i0o4KAobeztXCtW656hOqA.b['10'][0]++;__cov_i0o4KAobeztXCtW656hOqA.s['54']++;self.address=address;}else{__cov_i0o4KAobeztXCtW656hOqA.b['10'][1]++;}__cov_i0o4KAobeztXCtW656hOqA.s['55']++;cb(err,address);});}};__cov_i0o4KAobeztXCtW656hOqA.s['56']++;UportSubprovider.prototype.validateTransaction=function(txParams,cb){__cov_i0o4KAobeztXCtW656hOqA.f['10']++;__cov_i0o4KAobeztXCtW656hOqA.s['57']++;var self=this;__cov_i0o4KAobeztXCtW656hOqA.s['58']++;self.validateSender(txParams.from,function(err,senderIsValid){__cov_i0o4KAobeztXCtW656hOqA.f['11']++;__cov_i0o4KAobeztXCtW656hOqA.s['59']++;if(err){__cov_i0o4KAobeztXCtW656hOqA.b['11'][0]++;__cov_i0o4KAobeztXCtW656hOqA.s['60']++;return cb(err);}else{__cov_i0o4KAobeztXCtW656hOqA.b['11'][1]++;}__cov_i0o4KAobeztXCtW656hOqA.s['61']++;if(!senderIsValid){__cov_i0o4KAobeztXCtW656hOqA.b['12'][0]++;__cov_i0o4KAobeztXCtW656hOqA.s['62']++;return cb(new Error('Unknown address - unable to sign transaction for this address.'));}else{__cov_i0o4KAobeztXCtW656hOqA.b['12'][1]++;}__cov_i0o4KAobeztXCtW656hOqA.s['63']++;cb();});};__cov_i0o4KAobeztXCtW656hOqA.s['64']++;UportSubprovider.prototype.validateMessage=function(msgParams,cb){__cov_i0o4KAobeztXCtW656hOqA.f['12']++;__cov_i0o4KAobeztXCtW656hOqA.s['65']++;var self=this;__cov_i0o4KAobeztXCtW656hOqA.s['66']++;self.validateSender(msgParams.from,function(err,senderIsValid){__cov_i0o4KAobeztXCtW656hOqA.f['13']++;__cov_i0o4KAobeztXCtW656hOqA.s['67']++;if(err){__cov_i0o4KAobeztXCtW656hOqA.b['13'][0]++;__cov_i0o4KAobeztXCtW656hOqA.s['68']++;return cb(err);}else{__cov_i0o4KAobeztXCtW656hOqA.b['13'][1]++;}__cov_i0o4KAobeztXCtW656hOqA.s['69']++;if(!senderIsValid){__cov_i0o4KAobeztXCtW656hOqA.b['14'][0]++;__cov_i0o4KAobeztXCtW656hOqA.s['70']++;return cb(new Error('Unknown address - unable to sign message for this address.'));}else{__cov_i0o4KAobeztXCtW656hOqA.b['14'][1]++;}__cov_i0o4KAobeztXCtW656hOqA.s['71']++;cb();});};__cov_i0o4KAobeztXCtW656hOqA.s['72']++;UportSubprovider.prototype.validateSender=function(senderAddress,cb){__cov_i0o4KAobeztXCtW656hOqA.f['14']++;__cov_i0o4KAobeztXCtW656hOqA.s['73']++;var self=this;__cov_i0o4KAobeztXCtW656hOqA.s['74']++;var senderIsValid=senderAddress===self.address;__cov_i0o4KAobeztXCtW656hOqA.s['75']++;cb(null,senderIsValid);};

var utils = createCommonjsModule(function (module, exports) {
// Load modules


// Declare internals

var internals = {};
internals.hexTable = new Array(256);
for (var h = 0; h < 256; ++h) {
    internals.hexTable[h] = '%' + ((h < 16 ? '0' : '') + h.toString(16)).toUpperCase();
}


exports.arrayToObject = function (source, options) {

    var obj = options.plainObjects ? Object.create(null) : {};
    for (var i = 0, il = source.length; i < il; ++i) {
        if (typeof source[i] !== 'undefined') {

            obj[i] = source[i];
        }
    }

    return obj;
};


exports.merge = function (target, source, options) {

    if (!source) {
        return target;
    }

    if (typeof source !== 'object') {
        if (Array.isArray(target)) {
            target.push(source);
        }
        else if (typeof target === 'object') {
            target[source] = true;
        }
        else {
            target = [target, source];
        }

        return target;
    }

    if (typeof target !== 'object') {
        target = [target].concat(source);
        return target;
    }

    if (Array.isArray(target) &&
        !Array.isArray(source)) {

        target = exports.arrayToObject(target, options);
    }

    var keys = Object.keys(source);
    for (var k = 0, kl = keys.length; k < kl; ++k) {
        var key = keys[k];
        var value = source[key];

        if (!Object.prototype.hasOwnProperty.call(target, key)) {
            target[key] = value;
        }
        else {
            target[key] = exports.merge(target[key], value, options);
        }
    }

    return target;
};


exports.decode = function (str) {

    try {
        return decodeURIComponent(str.replace(/\+/g, ' '));
    } catch (e) {
        return str;
    }
};

exports.encode = function (str) {

    // This code was originally written by Brian White (mscdex) for the io.js core querystring library.
    // It has been adapted here for stricter adherence to RFC 3986
    if (str.length === 0) {
        return str;
    }

    if (typeof str !== 'string') {
        str = '' + str;
    }

    var out = '';
    for (var i = 0, il = str.length; i < il; ++i) {
        var c = str.charCodeAt(i);

        if (c === 0x2D || // -
            c === 0x2E || // .
            c === 0x5F || // _
            c === 0x7E || // ~
            (c >= 0x30 && c <= 0x39) || // 0-9
            (c >= 0x41 && c <= 0x5A) || // a-z
            (c >= 0x61 && c <= 0x7A)) { // A-Z

            out += str[i];
            continue;
        }

        if (c < 0x80) {
            out += internals.hexTable[c];
            continue;
        }

        if (c < 0x800) {
            out += internals.hexTable[0xC0 | (c >> 6)] + internals.hexTable[0x80 | (c & 0x3F)];
            continue;
        }

        if (c < 0xD800 || c >= 0xE000) {
            out += internals.hexTable[0xE0 | (c >> 12)] + internals.hexTable[0x80 | ((c >> 6) & 0x3F)] + internals.hexTable[0x80 | (c & 0x3F)];
            continue;
        }

        ++i;
        c = 0x10000 + (((c & 0x3FF) << 10) | (str.charCodeAt(i) & 0x3FF));
        out += internals.hexTable[0xF0 | (c >> 18)] + internals.hexTable[0x80 | ((c >> 12) & 0x3F)] + internals.hexTable[0x80 | ((c >> 6) & 0x3F)] + internals.hexTable[0x80 | (c & 0x3F)];
    }

    return out;
};

exports.compact = function (obj, refs) {

    if (typeof obj !== 'object' ||
        obj === null) {

        return obj;
    }

    refs = refs || [];
    var lookup = refs.indexOf(obj);
    if (lookup !== -1) {
        return refs[lookup];
    }

    refs.push(obj);

    if (Array.isArray(obj)) {
        var compacted = [];

        for (var i = 0, il = obj.length; i < il; ++i) {
            if (typeof obj[i] !== 'undefined') {
                compacted.push(obj[i]);
            }
        }

        return compacted;
    }

    var keys = Object.keys(obj);
    for (i = 0, il = keys.length; i < il; ++i) {
        var key = keys[i];
        obj[key] = exports.compact(obj[key], refs);
    }

    return obj;
};


exports.isRegExp = function (obj) {

    return Object.prototype.toString.call(obj) === '[object RegExp]';
};


exports.isBuffer = function (obj) {

    if (obj === null ||
        typeof obj === 'undefined') {

        return false;
    }

    return !!(obj.constructor &&
              obj.constructor.isBuffer &&
              obj.constructor.isBuffer(obj));
};
});

var utils$1 = interopDefault(utils);
var isBuffer = utils.isBuffer;
var isRegExp = utils.isRegExp;
var compact = utils.compact;
var encode = utils.encode;
var decode = utils.decode;
var merge = utils.merge;
var arrayToObject = utils.arrayToObject;

var require$$0$2 = Object.freeze({
    default: utils$1,
    isBuffer: isBuffer,
    isRegExp: isRegExp,
    compact: compact,
    encode: encode,
    decode: decode,
    merge: merge,
    arrayToObject: arrayToObject
});

var require$$0$2 = Object.freeze({
    default: utils$1,
    isBuffer: isBuffer,
    isRegExp: isRegExp,
    compact: compact,
    encode: encode,
    decode: decode,
    merge: merge,
    arrayToObject: arrayToObject
});

var stringify$1 = createCommonjsModule(function (module) {
// Load modules

var Utils = interopDefault(require$$0$2);


// Declare internals

var internals = {
    delimiter: '&',
    arrayPrefixGenerators: {
        brackets: function (prefix, key) {

            return prefix + '[]';
        },
        indices: function (prefix, key) {

            return prefix + '[' + key + ']';
        },
        repeat: function (prefix, key) {

            return prefix;
        }
    },
    strictNullHandling: false,
    skipNulls: false,
    encode: true
};


internals.stringify = function (obj, prefix, generateArrayPrefix, strictNullHandling, skipNulls, encode, filter, sort) {

    if (typeof filter === 'function') {
        obj = filter(prefix, obj);
    }
    else if (Utils.isBuffer(obj)) {
        obj = obj.toString();
    }
    else if (obj instanceof Date) {
        obj = obj.toISOString();
    }
    else if (obj === null) {
        if (strictNullHandling) {
            return encode ? Utils.encode(prefix) : prefix;
        }

        obj = '';
    }

    if (typeof obj === 'string' ||
        typeof obj === 'number' ||
        typeof obj === 'boolean') {

        if (encode) {
            return [Utils.encode(prefix) + '=' + Utils.encode(obj)];
        }
        return [prefix + '=' + obj];
    }

    var values = [];

    if (typeof obj === 'undefined') {
        return values;
    }

    var objKeys;
    if (Array.isArray(filter)) {
        objKeys = filter;
    } else {
        var keys = Object.keys(obj);
        objKeys = sort ? keys.sort(sort) : keys;
    }

    for (var i = 0, il = objKeys.length; i < il; ++i) {
        var key = objKeys[i];

        if (skipNulls &&
            obj[key] === null) {

            continue;
        }

        if (Array.isArray(obj)) {
            values = values.concat(internals.stringify(obj[key], generateArrayPrefix(prefix, key), generateArrayPrefix, strictNullHandling, skipNulls, encode, filter));
        }
        else {
            values = values.concat(internals.stringify(obj[key], prefix + '[' + key + ']', generateArrayPrefix, strictNullHandling, skipNulls, encode, filter));
        }
    }

    return values;
};


module.exports = function (obj, options) {

    options = options || {};
    var delimiter = typeof options.delimiter === 'undefined' ? internals.delimiter : options.delimiter;
    var strictNullHandling = typeof options.strictNullHandling === 'boolean' ? options.strictNullHandling : internals.strictNullHandling;
    var skipNulls = typeof options.skipNulls === 'boolean' ? options.skipNulls : internals.skipNulls;
    var encode = typeof options.encode === 'boolean' ? options.encode : internals.encode;
    var sort = typeof options.sort === 'function' ? options.sort : null;
    var objKeys;
    var filter;
    if (typeof options.filter === 'function') {
        filter = options.filter;
        obj = filter('', obj);
    }
    else if (Array.isArray(options.filter)) {
        objKeys = filter = options.filter;
    }

    var keys = [];

    if (typeof obj !== 'object' ||
        obj === null) {

        return '';
    }

    var arrayFormat;
    if (options.arrayFormat in internals.arrayPrefixGenerators) {
        arrayFormat = options.arrayFormat;
    }
    else if ('indices' in options) {
        arrayFormat = options.indices ? 'indices' : 'repeat';
    }
    else {
        arrayFormat = 'indices';
    }

    var generateArrayPrefix = internals.arrayPrefixGenerators[arrayFormat];

    if (!objKeys) {
        objKeys = Object.keys(obj);
    }

    if (sort) {
        objKeys.sort(sort);
    }

    for (var i = 0, il = objKeys.length; i < il; ++i) {
        var key = objKeys[i];

        if (skipNulls &&
            obj[key] === null) {

            continue;
        }

        keys = keys.concat(internals.stringify(obj[key], key, generateArrayPrefix, strictNullHandling, skipNulls, encode, filter, sort));
    }

    return keys.join(delimiter);
};
});

var stringify$2 = interopDefault(stringify$1);


var require$$1$2 = Object.freeze({
    default: stringify$2
});

var require$$1$2 = Object.freeze({
    default: stringify$2
});

var parse$1 = createCommonjsModule(function (module) {
// Load modules

var Utils = interopDefault(require$$0$2);


// Declare internals

var internals = {
    delimiter: '&',
    depth: 5,
    arrayLimit: 20,
    parameterLimit: 1000,
    strictNullHandling: false,
    plainObjects: false,
    allowPrototypes: false,
    allowDots: false
};


internals.parseValues = function (str, options) {

    var obj = {};
    var parts = str.split(options.delimiter, options.parameterLimit === Infinity ? undefined : options.parameterLimit);

    for (var i = 0, il = parts.length; i < il; ++i) {
        var part = parts[i];
        var pos = part.indexOf(']=') === -1 ? part.indexOf('=') : part.indexOf(']=') + 1;

        var key, val;
        if (pos === -1) {
            key = Utils.decode(part);
            val = options.strictNullHandling ? null : '';
        } else {
            key = Utils.decode(part.slice(0, pos));
            val = Utils.decode(part.slice(pos + 1));
        }
        if (Object.prototype.hasOwnProperty.call(obj, key)) {
            obj[key] = [].concat(obj[key]).concat(val);
        } else {
            obj[key] = val;
        }
    }

    return obj;
};


internals.parseObject = function (chain, val, options) {

    if (!chain.length) {
        return val;
    }

    var root = chain.shift();

    var obj;
    if (root === '[]') {
        obj = [];
        obj = obj.concat(internals.parseObject(chain, val, options));
    }
    else {
        obj = options.plainObjects ? Object.create(null) : {};
        var cleanRoot = root[0] === '[' && root[root.length - 1] === ']' ? root.slice(1, root.length - 1) : root;
        var index = parseInt(cleanRoot, 10);
        var indexString = '' + index;
        if (!isNaN(index) &&
            root !== cleanRoot &&
            indexString === cleanRoot &&
            index >= 0 &&
            (options.parseArrays &&
             index <= options.arrayLimit)) {

            obj = [];
            obj[index] = internals.parseObject(chain, val, options);
        }
        else {
            obj[cleanRoot] = internals.parseObject(chain, val, options);
        }
    }

    return obj;
};


internals.parseKeys = function (key, val, options) {

    if (!key) {
        return;
    }

    // Transform dot notation to bracket notation

    if (options.allowDots) {
        key = key.replace(/\.([^\.\[]+)/g, '[$1]');
    }

    // The regex chunks

    var parent = /^([^\[\]]*)/;
    var child = /(\[[^\[\]]*\])/g;

    // Get the parent

    var segment = parent.exec(key);

    // Stash the parent if it exists

    var keys = [];
    if (segment[1]) {
        // If we aren't using plain objects, optionally prefix keys
        // that would overwrite object prototype properties
        if (!options.plainObjects &&
            Object.prototype.hasOwnProperty(segment[1])) {

            if (!options.allowPrototypes) {
                return;
            }
        }

        keys.push(segment[1]);
    }

    // Loop through children appending to the array until we hit depth

    var i = 0;
    while ((segment = child.exec(key)) !== null && i < options.depth) {

        ++i;
        if (!options.plainObjects &&
            Object.prototype.hasOwnProperty(segment[1].replace(/\[|\]/g, ''))) {

            if (!options.allowPrototypes) {
                continue;
            }
        }
        keys.push(segment[1]);
    }

    // If there's a remainder, just add whatever is left

    if (segment) {
        keys.push('[' + key.slice(segment.index) + ']');
    }

    return internals.parseObject(keys, val, options);
};


module.exports = function (str, options) {

    options = options || {};
    options.delimiter = typeof options.delimiter === 'string' || Utils.isRegExp(options.delimiter) ? options.delimiter : internals.delimiter;
    options.depth = typeof options.depth === 'number' ? options.depth : internals.depth;
    options.arrayLimit = typeof options.arrayLimit === 'number' ? options.arrayLimit : internals.arrayLimit;
    options.parseArrays = options.parseArrays !== false;
    options.allowDots = typeof options.allowDots === 'boolean' ? options.allowDots : internals.allowDots;
    options.plainObjects = typeof options.plainObjects === 'boolean' ? options.plainObjects : internals.plainObjects;
    options.allowPrototypes = typeof options.allowPrototypes === 'boolean' ? options.allowPrototypes : internals.allowPrototypes;
    options.parameterLimit = typeof options.parameterLimit === 'number' ? options.parameterLimit : internals.parameterLimit;
    options.strictNullHandling = typeof options.strictNullHandling === 'boolean' ? options.strictNullHandling : internals.strictNullHandling;

    if (str === '' ||
        str === null ||
        typeof str === 'undefined') {

        return options.plainObjects ? Object.create(null) : {};
    }

    var tempObj = typeof str === 'string' ? internals.parseValues(str, options) : str;
    var obj = options.plainObjects ? Object.create(null) : {};

    // Iterate over the keys and setup the new object

    var keys = Object.keys(tempObj);
    for (var i = 0, il = keys.length; i < il; ++i) {
        var key = keys[i];
        var newObj = internals.parseKeys(key, tempObj[key], options);
        obj = Utils.merge(obj, newObj, options);
    }

    return Utils.compact(obj);
};
});

var parse$2 = interopDefault(parse$1);


var require$$0$3 = Object.freeze({
    default: parse$2
});

var require$$0$3 = Object.freeze({
    default: parse$2
});

var index = createCommonjsModule(function (module) {
// Load modules

var Stringify = interopDefault(require$$1$2);
var Parse = interopDefault(require$$0$3);


// Declare internals

var internals = {};


module.exports = {
    stringify: Stringify,
    parse: Parse
};
});

var qs = interopDefault(index);

var __cov_XWF6MCAnppYo7eQwzAi3bQ = (Function('return this'))();
if (!__cov_XWF6MCAnppYo7eQwzAi3bQ.__coverage__) { __cov_XWF6MCAnppYo7eQwzAi3bQ.__coverage__ = {}; }
__cov_XWF6MCAnppYo7eQwzAi3bQ = __cov_XWF6MCAnppYo7eQwzAi3bQ.__coverage__;
if (!(__cov_XWF6MCAnppYo7eQwzAi3bQ['/Users/jeffscottward/Documents/Development/Github/ConsenSys/core/uPort/libs/uport-lib/util/randomString.js'])) {
   __cov_XWF6MCAnppYo7eQwzAi3bQ['/Users/jeffscottward/Documents/Development/Github/ConsenSys/core/uPort/libs/uport-lib/util/randomString.js'] = {"path":"/Users/jeffscottward/Documents/Development/Github/ConsenSys/core/uPort/libs/uport-lib/util/randomString.js","s":{"1":1,"2":0,"3":0,"4":0,"5":0,"6":0},"b":{},"f":{"1":0},"fnMap":{"1":{"name":"randomString","line":4,"loc":{"start":{"line":4,"column":15},"end":{"line":4,"column":46}}}},"statementMap":{"1":{"start":{"line":4,"column":15},"end":{"line":9,"column":1}},"2":{"start":{"line":5,"column":2},"end":{"line":5,"column":78}},"3":{"start":{"line":6,"column":2},"end":{"line":6,"column":17}},"4":{"start":{"line":7,"column":2},"end":{"line":7,"column":92}},"5":{"start":{"line":7,"column":35},"end":{"line":7,"column":92}},"6":{"start":{"line":8,"column":2},"end":{"line":8,"column":15}}},"branchMap":{}};
}
__cov_XWF6MCAnppYo7eQwzAi3bQ = __cov_XWF6MCAnppYo7eQwzAi3bQ['/Users/jeffscottward/Documents/Development/Github/ConsenSys/core/uPort/libs/uport-lib/util/randomString.js'];
function randomString(length){__cov_XWF6MCAnppYo7eQwzAi3bQ.f['1']++;__cov_XWF6MCAnppYo7eQwzAi3bQ.s['2']++;var chars='0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';__cov_XWF6MCAnppYo7eQwzAi3bQ.s['3']++;var result='';__cov_XWF6MCAnppYo7eQwzAi3bQ.s['4']++;for(var i=length;i>0;--i){__cov_XWF6MCAnppYo7eQwzAi3bQ.s['5']++;result+=chars[Math.floor(Math.random()*chars.length)];}__cov_XWF6MCAnppYo7eQwzAi3bQ.s['6']++;return result;}

var __cov_88DDRgD7Fna15rhQ2GTKAA = (Function('return this'))();
if (!__cov_88DDRgD7Fna15rhQ2GTKAA.__coverage__) { __cov_88DDRgD7Fna15rhQ2GTKAA.__coverage__ = {}; }
__cov_88DDRgD7Fna15rhQ2GTKAA = __cov_88DDRgD7Fna15rhQ2GTKAA.__coverage__;
if (!(__cov_88DDRgD7Fna15rhQ2GTKAA['/Users/jeffscottward/Documents/Development/Github/ConsenSys/core/uPort/libs/uport-lib/lib/msgServer.js'])) {
   __cov_88DDRgD7Fna15rhQ2GTKAA['/Users/jeffscottward/Documents/Development/Github/ConsenSys/core/uPort/libs/uport-lib/lib/msgServer.js'] = {"path":"/Users/jeffscottward/Documents/Development/Github/ConsenSys/core/uPort/libs/uport-lib/lib/msgServer.js","s":{"1":1,"2":0,"3":0,"4":0,"5":0,"6":0,"7":0,"8":0,"9":0,"10":0,"11":0,"12":0,"13":0,"14":0,"15":0,"16":0,"17":0,"18":0,"19":0,"20":0,"21":0,"22":0,"23":0,"24":0,"25":0,"26":0,"27":0,"28":0,"29":0,"30":0,"31":0,"32":0,"33":0,"34":0,"35":0,"36":0,"37":0,"38":0,"39":0,"40":0,"41":0,"42":0,"43":0,"44":0,"45":0,"46":0,"47":0,"48":0,"49":0},"b":{"1":[0,0],"2":[0,0],"3":[0,0],"4":[0,0],"5":[0,0],"6":[0,0],"7":[0,0],"8":[0,0],"9":[0,0]},"f":{"1":0,"2":0,"3":0,"4":0,"5":0,"6":0,"7":0,"8":0,"9":0,"10":0,"11":0},"fnMap":{"1":{"name":"MsgServer","line":5,"loc":{"start":{"line":5,"column":0},"end":{"line":5,"column":44}}},"2":{"name":"(anonymous_2)","line":11,"loc":{"start":{"line":11,"column":31},"end":{"line":11,"column":52}}},"3":{"name":"(anonymous_3)","line":30,"loc":{"start":{"line":30,"column":36},"end":{"line":30,"column":57}}},"4":{"name":"(anonymous_4)","line":37,"loc":{"start":{"line":37,"column":40},"end":{"line":37,"column":61}}},"5":{"name":"(anonymous_5)","line":38,"loc":{"start":{"line":38,"column":24},"end":{"line":38,"column":36}}},"6":{"name":"(anonymous_6)","line":42,"loc":{"start":{"line":42,"column":30},"end":{"line":42,"column":42}}},"7":{"name":"(anonymous_7)","line":46,"loc":{"start":{"line":46,"column":32},"end":{"line":46,"column":44}}},"8":{"name":"(anonymous_8)","line":54,"loc":{"start":{"line":54,"column":36},"end":{"line":54,"column":57}}},"9":{"name":"(anonymous_9)","line":58,"loc":{"start":{"line":58,"column":4},"end":{"line":58,"column":16}}},"10":{"name":"(anonymous_10)","line":59,"loc":{"start":{"line":59,"column":25},"end":{"line":59,"column":56}}},"11":{"name":"(anonymous_11)","line":85,"loc":{"start":{"line":85,"column":33},"end":{"line":85,"column":48}}}},"statementMap":{"1":{"start":{"line":5,"column":0},"end":{"line":9,"column":1}},"2":{"start":{"line":6,"column":2},"end":{"line":6,"column":30}},"3":{"start":{"line":7,"column":2},"end":{"line":7,"column":23}},"4":{"start":{"line":8,"column":2},"end":{"line":8,"column":30}},"5":{"start":{"line":11,"column":0},"end":{"line":28,"column":1}},"6":{"start":{"line":12,"column":2},"end":{"line":15,"column":3}},"7":{"start":{"line":16,"column":2},"end":{"line":26,"column":3}},"8":{"start":{"line":17,"column":4},"end":{"line":17,"column":36}},"9":{"start":{"line":19,"column":4},"end":{"line":19,"column":31}},"10":{"start":{"line":20,"column":4},"end":{"line":25,"column":5}},"11":{"start":{"line":22,"column":6},"end":{"line":22,"column":37}},"12":{"start":{"line":24,"column":6},"end":{"line":24,"column":45}},"13":{"start":{"line":27,"column":2},"end":{"line":27,"column":14}},"14":{"start":{"line":30,"column":0},"end":{"line":36,"column":1}},"15":{"start":{"line":31,"column":2},"end":{"line":35,"column":3}},"16":{"start":{"line":32,"column":4},"end":{"line":32,"column":37}},"17":{"start":{"line":34,"column":4},"end":{"line":34,"column":33}},"18":{"start":{"line":37,"column":0},"end":{"line":52,"column":1}},"19":{"start":{"line":38,"column":2},"end":{"line":51,"column":3}},"20":{"start":{"line":39,"column":4},"end":{"line":50,"column":5}},"21":{"start":{"line":40,"column":6},"end":{"line":40,"column":58}},"22":{"start":{"line":41,"column":6},"end":{"line":49,"column":7}},"23":{"start":{"line":42,"column":8},"end":{"line":42,"column":44}},"24":{"start":{"line":43,"column":8},"end":{"line":43,"column":36}},"25":{"start":{"line":45,"column":8},"end":{"line":48,"column":9}},"26":{"start":{"line":46,"column":10},"end":{"line":46,"column":46}},"27":{"start":{"line":47,"column":10},"end":{"line":47,"column":26}},"28":{"start":{"line":54,"column":0},"end":{"line":83,"column":1}},"29":{"start":{"line":55,"column":2},"end":{"line":55,"column":17}},"30":{"start":{"line":57,"column":2},"end":{"line":82,"column":12}},"31":{"start":{"line":59,"column":6},"end":{"line":81,"column":8}},"32":{"start":{"line":60,"column":8},"end":{"line":60,"column":31}},"33":{"start":{"line":60,"column":17},"end":{"line":60,"column":31}},"34":{"start":{"line":62,"column":8},"end":{"line":62,"column":16}},"35":{"start":{"line":63,"column":8},"end":{"line":73,"column":9}},"36":{"start":{"line":64,"column":10},"end":{"line":64,"column":33}},"37":{"start":{"line":65,"column":10},"end":{"line":68,"column":11}},"38":{"start":{"line":66,"column":12},"end":{"line":66,"column":53}},"39":{"start":{"line":67,"column":12},"end":{"line":67,"column":33}},"40":{"start":{"line":70,"column":10},"end":{"line":70,"column":34}},"41":{"start":{"line":71,"column":10},"end":{"line":71,"column":51}},"42":{"start":{"line":72,"column":10},"end":{"line":72,"column":24}},"43":{"start":{"line":75,"column":8},"end":{"line":80,"column":9}},"44":{"start":{"line":76,"column":10},"end":{"line":76,"column":51}},"45":{"start":{"line":77,"column":10},"end":{"line":77,"column":43}},"46":{"start":{"line":78,"column":10},"end":{"line":78,"column":36}},"47":{"start":{"line":79,"column":10},"end":{"line":79,"column":43}},"48":{"start":{"line":85,"column":0},"end":{"line":85,"column":68}},"49":{"start":{"line":85,"column":50},"end":{"line":85,"column":67}}},"branchMap":{"1":{"line":16,"type":"if","locations":[{"start":{"line":16,"column":2},"end":{"line":16,"column":2}},{"start":{"line":16,"column":2},"end":{"line":16,"column":2}}]},"2":{"line":20,"type":"if","locations":[{"start":{"line":20,"column":4},"end":{"line":20,"column":4}},{"start":{"line":20,"column":4},"end":{"line":20,"column":4}}]},"3":{"line":31,"type":"if","locations":[{"start":{"line":31,"column":2},"end":{"line":31,"column":2}},{"start":{"line":31,"column":2},"end":{"line":31,"column":2}}]},"4":{"line":39,"type":"if","locations":[{"start":{"line":39,"column":4},"end":{"line":39,"column":4}},{"start":{"line":39,"column":4},"end":{"line":39,"column":4}}]},"5":{"line":41,"type":"if","locations":[{"start":{"line":41,"column":6},"end":{"line":41,"column":6}},{"start":{"line":41,"column":6},"end":{"line":41,"column":6}}]},"6":{"line":45,"type":"if","locations":[{"start":{"line":45,"column":8},"end":{"line":45,"column":8}},{"start":{"line":45,"column":8},"end":{"line":45,"column":8}}]},"7":{"line":60,"type":"if","locations":[{"start":{"line":60,"column":8},"end":{"line":60,"column":8}},{"start":{"line":60,"column":8},"end":{"line":60,"column":8}}]},"8":{"line":65,"type":"if","locations":[{"start":{"line":65,"column":10},"end":{"line":65,"column":10}},{"start":{"line":65,"column":10},"end":{"line":65,"column":10}}]},"9":{"line":75,"type":"if","locations":[{"start":{"line":75,"column":8},"end":{"line":75,"column":8}},{"start":{"line":75,"column":8},"end":{"line":75,"column":8}}]}}};
}
__cov_88DDRgD7Fna15rhQ2GTKAA = __cov_88DDRgD7Fna15rhQ2GTKAA['/Users/jeffscottward/Documents/Development/Github/ConsenSys/core/uPort/libs/uport-lib/lib/msgServer.js'];
function MsgServer(chasquiUrl,isOnMobile){__cov_88DDRgD7Fna15rhQ2GTKAA.f['1']++;__cov_88DDRgD7Fna15rhQ2GTKAA.s['2']++;this.chasquiUrl=chasquiUrl;__cov_88DDRgD7Fna15rhQ2GTKAA.s['3']++;this.intervalIds={};__cov_88DDRgD7Fna15rhQ2GTKAA.s['4']++;this.isOnMobile=isOnMobile;}__cov_88DDRgD7Fna15rhQ2GTKAA.s['5']++;MsgServer.prototype.newTopic=function(topicName){__cov_88DDRgD7Fna15rhQ2GTKAA.f['2']++;__cov_88DDRgD7Fna15rhQ2GTKAA.s['6']++;var topic={name:topicName,id:randomString(16)};__cov_88DDRgD7Fna15rhQ2GTKAA.s['7']++;if(this.isOnMobile){__cov_88DDRgD7Fna15rhQ2GTKAA.b['1'][0]++;__cov_88DDRgD7Fna15rhQ2GTKAA.s['8']++;topic.url=window.location.href;}else{__cov_88DDRgD7Fna15rhQ2GTKAA.b['1'][1]++;__cov_88DDRgD7Fna15rhQ2GTKAA.s['9']++;topic.url=this.chasquiUrl;__cov_88DDRgD7Fna15rhQ2GTKAA.s['10']++;if(topicName==='address'){__cov_88DDRgD7Fna15rhQ2GTKAA.b['2'][0]++;__cov_88DDRgD7Fna15rhQ2GTKAA.s['11']++;topic.url+='addr/'+topic.id;}else{__cov_88DDRgD7Fna15rhQ2GTKAA.b['2'][1]++;__cov_88DDRgD7Fna15rhQ2GTKAA.s['12']++;topic.url+=topicName+'/'+topic.id;}}__cov_88DDRgD7Fna15rhQ2GTKAA.s['13']++;return topic;};__cov_88DDRgD7Fna15rhQ2GTKAA.s['14']++;MsgServer.prototype.waitForResult=function(topic,cb){__cov_88DDRgD7Fna15rhQ2GTKAA.f['3']++;__cov_88DDRgD7Fna15rhQ2GTKAA.s['15']++;if(this.isOnMobile){__cov_88DDRgD7Fna15rhQ2GTKAA.b['3'][0]++;__cov_88DDRgD7Fna15rhQ2GTKAA.s['16']++;this.waitForHashChange(topic,cb);}else{__cov_88DDRgD7Fna15rhQ2GTKAA.b['3'][1]++;__cov_88DDRgD7Fna15rhQ2GTKAA.s['17']++;this.pollForResult(topic,cb);}};__cov_88DDRgD7Fna15rhQ2GTKAA.s['18']++;MsgServer.prototype.waitForHashChange=function(topic,cb){__cov_88DDRgD7Fna15rhQ2GTKAA.f['4']++;__cov_88DDRgD7Fna15rhQ2GTKAA.s['19']++;window.onhashchange=function(){__cov_88DDRgD7Fna15rhQ2GTKAA.f['5']++;__cov_88DDRgD7Fna15rhQ2GTKAA.s['20']++;if(window.location.hash){__cov_88DDRgD7Fna15rhQ2GTKAA.b['4'][0]++;__cov_88DDRgD7Fna15rhQ2GTKAA.s['21']++;var params=qs.parse(window.location.hash.slice(1));__cov_88DDRgD7Fna15rhQ2GTKAA.s['22']++;if(params[topic.name]){__cov_88DDRgD7Fna15rhQ2GTKAA.b['5'][0]++;__cov_88DDRgD7Fna15rhQ2GTKAA.s['23']++;window.onhashchange=function(){__cov_88DDRgD7Fna15rhQ2GTKAA.f['6']++;};__cov_88DDRgD7Fna15rhQ2GTKAA.s['24']++;cb(null,params[topic.name]);}else{__cov_88DDRgD7Fna15rhQ2GTKAA.b['5'][1]++;__cov_88DDRgD7Fna15rhQ2GTKAA.s['25']++;if(params.error){__cov_88DDRgD7Fna15rhQ2GTKAA.b['6'][0]++;__cov_88DDRgD7Fna15rhQ2GTKAA.s['26']++;window.onhashchange=function(){__cov_88DDRgD7Fna15rhQ2GTKAA.f['7']++;};__cov_88DDRgD7Fna15rhQ2GTKAA.s['27']++;cb(params.error);}else{__cov_88DDRgD7Fna15rhQ2GTKAA.b['6'][1]++;}}}else{__cov_88DDRgD7Fna15rhQ2GTKAA.b['4'][1]++;}};};__cov_88DDRgD7Fna15rhQ2GTKAA.s['28']++;MsgServer.prototype.pollForResult=function(topic,cb){__cov_88DDRgD7Fna15rhQ2GTKAA.f['8']++;__cov_88DDRgD7Fna15rhQ2GTKAA.s['29']++;var self=this;__cov_88DDRgD7Fna15rhQ2GTKAA.s['30']++;self.intervalIds[topic.id]=setInterval(function(){__cov_88DDRgD7Fna15rhQ2GTKAA.f['9']++;__cov_88DDRgD7Fna15rhQ2GTKAA.s['31']++;request__default(topic.url,function(err,response,body){__cov_88DDRgD7Fna15rhQ2GTKAA.f['10']++;__cov_88DDRgD7Fna15rhQ2GTKAA.s['32']++;if(err){__cov_88DDRgD7Fna15rhQ2GTKAA.b['7'][0]++;__cov_88DDRgD7Fna15rhQ2GTKAA.s['33']++;return cb(err);}else{__cov_88DDRgD7Fna15rhQ2GTKAA.b['7'][1]++;}__cov_88DDRgD7Fna15rhQ2GTKAA.s['34']++;var data;__cov_88DDRgD7Fna15rhQ2GTKAA.s['35']++;try{__cov_88DDRgD7Fna15rhQ2GTKAA.s['36']++;data=JSON.parse(body);__cov_88DDRgD7Fna15rhQ2GTKAA.s['37']++;if(data.error){__cov_88DDRgD7Fna15rhQ2GTKAA.b['8'][0]++;__cov_88DDRgD7Fna15rhQ2GTKAA.s['38']++;clearInterval(self.intervalIds[topic.id]);__cov_88DDRgD7Fna15rhQ2GTKAA.s['39']++;return cb(data.error);}else{__cov_88DDRgD7Fna15rhQ2GTKAA.b['8'][1]++;}}catch(err){__cov_88DDRgD7Fna15rhQ2GTKAA.s['40']++;console.error(err.stack);__cov_88DDRgD7Fna15rhQ2GTKAA.s['41']++;clearInterval(self.intervalIds[topic.id]);__cov_88DDRgD7Fna15rhQ2GTKAA.s['42']++;return cb(err);}__cov_88DDRgD7Fna15rhQ2GTKAA.s['43']++;if(data[topic.name]){__cov_88DDRgD7Fna15rhQ2GTKAA.b['9'][0]++;__cov_88DDRgD7Fna15rhQ2GTKAA.s['44']++;clearInterval(self.intervalIds[topic.id]);__cov_88DDRgD7Fna15rhQ2GTKAA.s['45']++;self.intervalIds[topic.id]=null;__cov_88DDRgD7Fna15rhQ2GTKAA.s['46']++;self.clearTopic(topic.url);__cov_88DDRgD7Fna15rhQ2GTKAA.s['47']++;return cb(null,data[topic.name]);}else{__cov_88DDRgD7Fna15rhQ2GTKAA.b['9'][1]++;}});},2000);};__cov_88DDRgD7Fna15rhQ2GTKAA.s['48']++;MsgServer.prototype.clearTopic=function(url){__cov_88DDRgD7Fna15rhQ2GTKAA.f['11']++;__cov_88DDRgD7Fna15rhQ2GTKAA.s['49']++;request__default.del(url);};

var rpc = createCommonjsModule(function (module) {
var xhr = process.browser ? interopDefault(require$$4) : interopDefault(request)
var inherits = interopDefault(require$$2).inherits
var createPayload = interopDefault(require$$1)
var Subprovider = interopDefault(require$$0)

module.exports = RpcSource

inherits(RpcSource, Subprovider)

function RpcSource(opts) {
  var self = this
  self.rpcUrl = opts.rpcUrl
}


RpcSource.prototype.handleRequest = function(payload, next, end){
  var self = this
  var targetUrl = self.rpcUrl
  var method = payload.method
  var params = payload.params

  // new payload with random large id,
  // so as not to conflict with other concurrent users
  var newPayload = createPayload(payload)

  // console.log('------------------ network attempt -----------------')
  // console.log(payload)
  // console.log('---------------------------------------------')

  xhr({
    uri: targetUrl,
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(newPayload),
    rejectUnauthorized: false,
  }, function(err, res, body) {
    if (err) return end(err)

    // parse response into raw account
    var data
    try {
      data = JSON.parse(body)
      if (data.error) return end(data.error)
    } catch (err) {
      console.error(err.stack)
      return end(err)
    }

    // console.log('network:', payload.method, payload.params, '->', data.result)

    end(null, data.result)
  })

}
});

var RpcSubprovider = interopDefault(rpc);

var __cov_82v_ah80xzzTDekWrLie5A = (Function('return this'))();
if (!__cov_82v_ah80xzzTDekWrLie5A.__coverage__) { __cov_82v_ah80xzzTDekWrLie5A.__coverage__ = {}; }
__cov_82v_ah80xzzTDekWrLie5A = __cov_82v_ah80xzzTDekWrLie5A.__coverage__;
if (!(__cov_82v_ah80xzzTDekWrLie5A['/Users/jeffscottward/Documents/Development/Github/ConsenSys/core/uPort/libs/uport-lib/util/qrdisplay.js'])) {
   __cov_82v_ah80xzzTDekWrLie5A['/Users/jeffscottward/Documents/Development/Github/ConsenSys/core/uPort/libs/uport-lib/util/qrdisplay.js'] = {"path":"/Users/jeffscottward/Documents/Development/Github/ConsenSys/core/uPort/libs/uport-lib/util/qrdisplay.js","s":{"1":1,"2":0,"3":0,"4":0,"5":0,"6":0,"7":0,"8":0,"9":0,"10":0,"11":0,"12":0,"13":0,"14":0,"15":0,"16":0,"17":0,"18":0,"19":0,"20":0,"21":0,"22":0,"23":0,"24":0,"25":0,"26":0,"27":0,"28":0,"29":0},"b":{"1":[0,0]},"f":{"1":0,"2":0,"3":0,"4":0},"fnMap":{"1":{"name":"QRDisplay","line":3,"loc":{"start":{"line":3,"column":0},"end":{"line":3,"column":22}}},"2":{"name":"(anonymous_2)","line":5,"loc":{"start":{"line":5,"column":29},"end":{"line":5,"column":45}}},"3":{"name":"(anonymous_3)","line":15,"loc":{"start":{"line":15,"column":30},"end":{"line":15,"column":42}}},"4":{"name":"(anonymous_4)","line":20,"loc":{"start":{"line":20,"column":40},"end":{"line":20,"column":52}}}},"statementMap":{"1":{"start":{"line":3,"column":0},"end":{"line":3,"column":24}},"2":{"start":{"line":5,"column":0},"end":{"line":13,"column":1}},"3":{"start":{"line":6,"column":2},"end":{"line":6,"column":40}},"4":{"start":{"line":7,"column":2},"end":{"line":7,"column":33}},"5":{"start":{"line":9,"column":2},"end":{"line":9,"column":56}},"6":{"start":{"line":10,"column":2},"end":{"line":10,"column":86}},"7":{"start":{"line":11,"column":2},"end":{"line":11,"column":45}},"8":{"start":{"line":12,"column":2},"end":{"line":12,"column":36}},"9":{"start":{"line":15,"column":0},"end":{"line":18,"column":1}},"10":{"start":{"line":16,"column":2},"end":{"line":16,"column":40}},"11":{"start":{"line":17,"column":2},"end":{"line":17,"column":32}},"12":{"start":{"line":20,"column":0},"end":{"line":42,"column":1}},"13":{"start":{"line":21,"column":2},"end":{"line":21,"column":46}},"14":{"start":{"line":22,"column":2},"end":{"line":22,"column":19}},"15":{"start":{"line":22,"column":10},"end":{"line":22,"column":19}},"16":{"start":{"line":24,"column":2},"end":{"line":24,"column":36}},"17":{"start":{"line":25,"column":2},"end":{"line":25,"column":35}},"18":{"start":{"line":26,"column":2},"end":{"line":26,"column":138}},"19":{"start":{"line":28,"column":2},"end":{"line":28,"column":41}},"20":{"start":{"line":29,"column":2},"end":{"line":29,"column":159}},"21":{"start":{"line":31,"column":2},"end":{"line":31,"column":40}},"22":{"start":{"line":32,"column":2},"end":{"line":32,"column":47}},"23":{"start":{"line":34,"column":2},"end":{"line":34,"column":43}},"24":{"start":{"line":35,"column":2},"end":{"line":35,"column":45}},"25":{"start":{"line":37,"column":2},"end":{"line":37,"column":24}},"26":{"start":{"line":38,"column":2},"end":{"line":38,"column":23}},"27":{"start":{"line":39,"column":2},"end":{"line":39,"column":21}},"28":{"start":{"line":40,"column":2},"end":{"line":40,"column":31}},"29":{"start":{"line":41,"column":2},"end":{"line":41,"column":11}}},"branchMap":{"1":{"line":22,"type":"if","locations":[{"start":{"line":22,"column":2},"end":{"line":22,"column":2}},{"start":{"line":22,"column":2},"end":{"line":22,"column":2}}]}}};
}
__cov_82v_ah80xzzTDekWrLie5A = __cov_82v_ah80xzzTDekWrLie5A['/Users/jeffscottward/Documents/Development/Github/ConsenSys/core/uPort/libs/uport-lib/util/qrdisplay.js'];
function QRDisplay(){__cov_82v_ah80xzzTDekWrLie5A.f['1']++;}__cov_82v_ah80xzzTDekWrLie5A.s['2']++;QRDisplay.prototype.openQr=function(data){__cov_82v_ah80xzzTDekWrLie5A.f['2']++;__cov_82v_ah80xzzTDekWrLie5A.s['3']++;var uportQR=this.getUportQRDisplay();__cov_82v_ah80xzzTDekWrLie5A.s['4']++;uportQR.style.display='block';__cov_82v_ah80xzzTDekWrLie5A.s['5']++;var pngBuffer=qrImage.imageSync(data,{type:'png'});__cov_82v_ah80xzzTDekWrLie5A.s['6']++;var dataUri='data:image/png;charset=utf-8;base64, '+pngBuffer.toString('base64');__cov_82v_ah80xzzTDekWrLie5A.s['7']++;var qrImg=uportQR.children[0].children[0];__cov_82v_ah80xzzTDekWrLie5A.s['8']++;qrImg.setAttribute('src',dataUri);};__cov_82v_ah80xzzTDekWrLie5A.s['9']++;QRDisplay.prototype.closeQr=function(){__cov_82v_ah80xzzTDekWrLie5A.f['3']++;__cov_82v_ah80xzzTDekWrLie5A.s['10']++;var uportQR=this.getUportQRDisplay();__cov_82v_ah80xzzTDekWrLie5A.s['11']++;uportQR.style.display='none';};__cov_82v_ah80xzzTDekWrLie5A.s['12']++;QRDisplay.prototype.getUportQRDisplay=function(){__cov_82v_ah80xzzTDekWrLie5A.f['4']++;__cov_82v_ah80xzzTDekWrLie5A.s['13']++;var bg=document.getElementById('uport-qr');__cov_82v_ah80xzzTDekWrLie5A.s['14']++;if(bg){__cov_82v_ah80xzzTDekWrLie5A.b['1'][0]++;__cov_82v_ah80xzzTDekWrLie5A.s['15']++;return bg;}else{__cov_82v_ah80xzzTDekWrLie5A.b['1'][1]++;}__cov_82v_ah80xzzTDekWrLie5A.s['16']++;bg=document.createElement('div');__cov_82v_ah80xzzTDekWrLie5A.s['17']++;bg.setAttribute('id','uport-qr');__cov_82v_ah80xzzTDekWrLie5A.s['18']++;bg.setAttribute('style','position:fixed;top: 0;width:100%;height:100%;z-index:100;background-color:rgba(0,0,0,0.5);text-align:center;');__cov_82v_ah80xzzTDekWrLie5A.s['19']++;var box=document.createElement('div');__cov_82v_ah80xzzTDekWrLie5A.s['20']++;box.setAttribute('style','position:relative;top:50%;display:inline-block;z-index:101;background:#fff;transform:translateY(-50%);margin:0 auto;padding:20px');__cov_82v_ah80xzzTDekWrLie5A.s['21']++;var text=document.createElement('p');__cov_82v_ah80xzzTDekWrLie5A.s['22']++;text.innerHTML='Please scan with uport app';__cov_82v_ah80xzzTDekWrLie5A.s['23']++;var qrImg=document.createElement('img');__cov_82v_ah80xzzTDekWrLie5A.s['24']++;qrImg.setAttribute('style','z-index:102;');__cov_82v_ah80xzzTDekWrLie5A.s['25']++;box.appendChild(qrImg);__cov_82v_ah80xzzTDekWrLie5A.s['26']++;box.appendChild(text);__cov_82v_ah80xzzTDekWrLie5A.s['27']++;bg.appendChild(box);__cov_82v_ah80xzzTDekWrLie5A.s['28']++;document.body.appendChild(bg);__cov_82v_ah80xzzTDekWrLie5A.s['29']++;return bg;};

var __cov_0w$a9L99VOCm5RN5H9bjaw = (Function('return this'))();
if (!__cov_0w$a9L99VOCm5RN5H9bjaw.__coverage__) { __cov_0w$a9L99VOCm5RN5H9bjaw.__coverage__ = {}; }
__cov_0w$a9L99VOCm5RN5H9bjaw = __cov_0w$a9L99VOCm5RN5H9bjaw.__coverage__;
if (!(__cov_0w$a9L99VOCm5RN5H9bjaw['/Users/jeffscottward/Documents/Development/Github/ConsenSys/core/uPort/libs/uport-lib/lib/index.js'])) {
   __cov_0w$a9L99VOCm5RN5H9bjaw['/Users/jeffscottward/Documents/Development/Github/ConsenSys/core/uPort/libs/uport-lib/lib/index.js'] = {"path":"/Users/jeffscottward/Documents/Development/Github/ConsenSys/core/uPort/libs/uport-lib/lib/index.js","s":{"1":0,"2":0,"3":1,"4":0,"5":0,"6":0,"7":0,"8":0,"9":0,"10":0,"11":0,"12":0,"13":0,"14":0,"15":0,"16":0,"17":0,"18":0,"19":0,"20":0,"21":0,"22":0,"23":0,"24":0,"25":0,"26":0,"27":0,"28":0,"29":0,"30":0,"31":0},"b":{"1":[0,0],"2":[0,0],"3":[0,0],"4":[0,0]},"f":{"1":0,"2":0,"3":0,"4":0,"5":0},"fnMap":{"1":{"name":"Uport","line":13,"loc":{"start":{"line":13,"column":0},"end":{"line":13,"column":49}}},"2":{"name":"(anonymous_2)","line":20,"loc":{"start":{"line":20,"column":35},"end":{"line":20,"column":53}}},"3":{"name":"(anonymous_3)","line":38,"loc":{"start":{"line":38,"column":38},"end":{"line":38,"column":50}}},"4":{"name":"(anonymous_4)","line":42,"loc":{"start":{"line":42,"column":41},"end":{"line":42,"column":63}}},"5":{"name":"(anonymous_5)","line":56,"loc":{"start":{"line":56,"column":28},"end":{"line":56,"column":43}}}},"statementMap":{"1":{"start":{"line":10,"column":0},"end":{"line":10,"column":45}},"2":{"start":{"line":11,"column":0},"end":{"line":11,"column":63}},"3":{"start":{"line":13,"column":0},"end":{"line":18,"column":1}},"4":{"start":{"line":14,"column":2},"end":{"line":14,"column":26}},"5":{"start":{"line":15,"column":2},"end":{"line":15,"column":47}},"6":{"start":{"line":16,"column":2},"end":{"line":16,"column":49}},"7":{"start":{"line":17,"column":2},"end":{"line":17,"column":60}},"8":{"start":{"line":20,"column":0},"end":{"line":36,"column":1}},"9":{"start":{"line":21,"column":2},"end":{"line":21,"column":35}},"10":{"start":{"line":23,"column":2},"end":{"line":23,"column":38}},"11":{"start":{"line":26,"column":2},"end":{"line":26,"column":43}},"12":{"start":{"line":26,"column":15},"end":{"line":26,"column":43}},"13":{"start":{"line":29,"column":2},"end":{"line":29,"column":59}},"14":{"start":{"line":30,"column":2},"end":{"line":30,"column":36}},"15":{"start":{"line":33,"column":2},"end":{"line":33,"column":16}},"16":{"start":{"line":34,"column":2},"end":{"line":34,"column":15}},"17":{"start":{"line":35,"column":2},"end":{"line":35,"column":15}},"18":{"start":{"line":38,"column":0},"end":{"line":40,"column":1}},"19":{"start":{"line":39,"column":2},"end":{"line":39,"column":25}},"20":{"start":{"line":42,"column":0},"end":{"line":54,"column":1}},"21":{"start":{"line":43,"column":2},"end":{"line":43,"column":17}},"22":{"start":{"line":45,"column":2},"end":{"line":45,"column":43}},"23":{"start":{"line":45,"column":19},"end":{"line":45,"column":43}},"24":{"start":{"line":47,"column":2},"end":{"line":52,"column":3}},"25":{"start":{"line":53,"column":2},"end":{"line":53,"column":35}},"26":{"start":{"line":56,"column":0},"end":{"line":64,"column":1}},"27":{"start":{"line":57,"column":2},"end":{"line":57,"column":17}},"28":{"start":{"line":58,"column":2},"end":{"line":58,"column":45}},"29":{"start":{"line":59,"column":2},"end":{"line":63,"column":3}},"30":{"start":{"line":60,"column":4},"end":{"line":60,"column":31}},"31":{"start":{"line":62,"column":4},"end":{"line":62,"column":30}}},"branchMap":{"1":{"line":15,"type":"binary-expr","locations":[{"start":{"line":15,"column":19},"end":{"line":15,"column":28}},{"start":{"line":15,"column":32},"end":{"line":15,"column":47}}]},"2":{"line":26,"type":"if","locations":[{"start":{"line":26,"column":2},"end":{"line":26,"column":2}},{"start":{"line":26,"column":2},"end":{"line":26,"column":2}}]},"3":{"line":45,"type":"if","locations":[{"start":{"line":45,"column":2},"end":{"line":45,"column":2}},{"start":{"line":45,"column":2},"end":{"line":45,"column":2}}]},"4":{"line":59,"type":"if","locations":[{"start":{"line":59,"column":2},"end":{"line":59,"column":2}},{"start":{"line":59,"column":2},"end":{"line":59,"column":2}}]}}};
}
__cov_0w$a9L99VOCm5RN5H9bjaw = __cov_0w$a9L99VOCm5RN5H9bjaw['/Users/jeffscottward/Documents/Development/Github/ConsenSys/core/uPort/libs/uport-lib/lib/index.js'];
__cov_0w$a9L99VOCm5RN5H9bjaw.s['1']++;var CHASQUI_URL='https://chasqui.uport.me/';__cov_0w$a9L99VOCm5RN5H9bjaw.s['2']++;var INFURA_CONSENSYSNET='https://consensysnet.infura.io:8545';function Uport(dappName,qrDisplay,chasquiUrl){__cov_0w$a9L99VOCm5RN5H9bjaw.f['1']++;__cov_0w$a9L99VOCm5RN5H9bjaw.s['4']++;this.dappName=dappName;__cov_0w$a9L99VOCm5RN5H9bjaw.s['5']++;this.qrdisplay=(__cov_0w$a9L99VOCm5RN5H9bjaw.b['1'][0]++,qrDisplay)||(__cov_0w$a9L99VOCm5RN5H9bjaw.b['1'][1]++,new QRDisplay());__cov_0w$a9L99VOCm5RN5H9bjaw.s['6']++;this.isOnMobile=isMobile(navigator.userAgent);__cov_0w$a9L99VOCm5RN5H9bjaw.s['7']++;this.subprovider=this.createUportSubprovider(chasquiUrl);}__cov_0w$a9L99VOCm5RN5H9bjaw.s['8']++;Uport.prototype.getUportProvider=function(rpcUrl){__cov_0w$a9L99VOCm5RN5H9bjaw.f['2']++;__cov_0w$a9L99VOCm5RN5H9bjaw.s['9']++;var engine=new ProviderEngine();__cov_0w$a9L99VOCm5RN5H9bjaw.s['10']++;engine.addProvider(this.subprovider);__cov_0w$a9L99VOCm5RN5H9bjaw.s['11']++;if(!rpcUrl){__cov_0w$a9L99VOCm5RN5H9bjaw.b['2'][0]++;__cov_0w$a9L99VOCm5RN5H9bjaw.s['12']++;rpcUrl=INFURA_CONSENSYSNET;}else{__cov_0w$a9L99VOCm5RN5H9bjaw.b['2'][1]++;}__cov_0w$a9L99VOCm5RN5H9bjaw.s['13']++;var rpcSubprovider=new RpcSubprovider({rpcUrl:rpcUrl});__cov_0w$a9L99VOCm5RN5H9bjaw.s['14']++;engine.addProvider(rpcSubprovider);__cov_0w$a9L99VOCm5RN5H9bjaw.s['15']++;engine.start();__cov_0w$a9L99VOCm5RN5H9bjaw.s['16']++;engine.stop();__cov_0w$a9L99VOCm5RN5H9bjaw.s['17']++;return engine;};__cov_0w$a9L99VOCm5RN5H9bjaw.s['18']++;Uport.prototype.getUportSubprovider=function(){__cov_0w$a9L99VOCm5RN5H9bjaw.f['3']++;__cov_0w$a9L99VOCm5RN5H9bjaw.s['19']++;return this.subprovider;};__cov_0w$a9L99VOCm5RN5H9bjaw.s['20']++;Uport.prototype.createUportSubprovider=function(chasquiUrl){__cov_0w$a9L99VOCm5RN5H9bjaw.f['4']++;__cov_0w$a9L99VOCm5RN5H9bjaw.s['21']++;var self=this;__cov_0w$a9L99VOCm5RN5H9bjaw.s['22']++;if(!chasquiUrl){__cov_0w$a9L99VOCm5RN5H9bjaw.b['3'][0]++;__cov_0w$a9L99VOCm5RN5H9bjaw.s['23']++;chasquiUrl=CHASQUI_URL;}else{__cov_0w$a9L99VOCm5RN5H9bjaw.b['3'][1]++;}__cov_0w$a9L99VOCm5RN5H9bjaw.s['24']++;var opts={msgServer:new MsgServer(chasquiUrl,self.isOnMobile),uportConnectHandler:self.handleURI.bind(self),ethUriHandler:self.handleURI.bind(self),closeQR:self.qrdisplay.closeQr.bind(self.qrdisplay)};__cov_0w$a9L99VOCm5RN5H9bjaw.s['25']++;return new UportSubprovider(opts);};__cov_0w$a9L99VOCm5RN5H9bjaw.s['26']++;Uport.prototype.handleURI=function(uri){__cov_0w$a9L99VOCm5RN5H9bjaw.f['5']++;__cov_0w$a9L99VOCm5RN5H9bjaw.s['27']++;var self=this;__cov_0w$a9L99VOCm5RN5H9bjaw.s['28']++;uri+='&label='+encodeURI(self.dappName);__cov_0w$a9L99VOCm5RN5H9bjaw.s['29']++;if(self.isOnMobile){__cov_0w$a9L99VOCm5RN5H9bjaw.b['4'][0]++;__cov_0w$a9L99VOCm5RN5H9bjaw.s['30']++;window.location.assign(uri);}else{__cov_0w$a9L99VOCm5RN5H9bjaw.b['4'][1]++;__cov_0w$a9L99VOCm5RN5H9bjaw.s['31']++;self.qrdisplay.openQr(uri);}};

export default Uport;
//# sourceMappingURL=uport-lib.mjs.map
