var Logging = (function() {

	var logging = {

		console: function(message) {
			return function(val) {
				console.log(message);
				return $.Deferred().resolve(val).promise();
			}
		},
		alert: function(message) {
			return function(val) {
				alert(message);
				return $.Deferred().resolve(val).promise();
			}
		}
	};

	return logging;
})();