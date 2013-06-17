var Async = (function() {

	var async = {
		processChain: function(steps) {
			var chain = $.Deferred(),
				lastRet = chain,
				arg;

			for (var i = 0; i < steps.length; i++) {
				arg = steps[i];
				// bleh - find easy way to call function like this w/o having arg be of 2 types
				if (arg instanceof Array) {
					lastRet = lastRet.then(arg[0], arg[1]);
				} else {
					lastRet = lastRet.then(arg);
				}
			}

			chain.resolve();
			return lastRet;
		},

		createStep: function(pieces) {
			return function() {
				var d = $.Deferred();

				async.processChain(pieces).then(
					function() { d.resolve() },
					function() { d.reject() }
				);

				return d.promise();
			}
		}
	};

	return async;
})();