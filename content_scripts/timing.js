var Timing = (function() {

	var timing = {

		// TODO: have the return values fit some sort of normal distribution
		// random thing off google: http://www.jstat.org/demonstration
		wait: function(milliseconds) {
			return function(val) {
				var waitForIt = $.Deferred();

				setTimeout(function() {
					// won't really do what we want if being called as a reject callback,
					// but will that happen? Any way to know what happened to previous callback in chain?
					// reject always called with an error object?
					waitForIt.resolve(val);
				}, milliseconds)

				return waitForIt.promise();
			}
		}
	}

	// have this rely on waiting for that spinny thing to go away? $('.loading-block').length
	timing.pause = timing.wait(5000);

	// for non-server call things? better name needed
	timing.moment = timing.wait(500);

	return timing;
})();