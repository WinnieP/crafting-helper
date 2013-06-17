var Timing = (function() {

	function poll(verifier, milliseconds) {
		var d = $.Deferred();
		setTimeout(function() {
			if (verifier()) {
				d.resolve();
			} else {
				poll(verifier, milliseconds).then(d.resolve);
			}
		}, milliseconds);
		return d.promise();
	}

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
		},

		pause: function() {
			return poll(function() { return !$('.loading-block').length; }, 1000);
		}
	
}
	// for non-server call things? better name needed
	timing.moment = timing.wait(500);

	return timing;
})();