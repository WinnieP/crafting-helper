function main() {
	gatherHighQualityIronOre();
}

function processChain() {
	var chain = $.Deferred(),
		lastRet = chain,
		arg;

	for (var i = 0; i < arguments.length; i++) {
		arg = arguments[i];
		// bleh - find easy way to call function like this w/o having arg be of 2 types
		if (arg instanceof Array) {
			lastRet = lastRet.then(arg[0], arg[1]);
		} else {
			lastRet = lastRet.then(arg);
		}
	}

	chain.resolve();
}

var DEFAULT_WAIT = 3000;

var NavigateTo = (function() {

	function clickElement($element) {
		var event = document.createEvent("MouseEvent");
		event.initMouseEvent("click", true, true, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
		$element[0].dispatchEvent(event);
	}

	function findByDataUrl(dataUrl) {
		return $('a[data-url="' + dataUrl + '"]');
	}

	function taskExists(title) {
		var $title = $('span:contains("' + title + '")');
		return !!$title.length;
	}

	function nextPage() {
		clickElement($('#tasklist_next'));
	}

	var navigateTo = {
		professions: function() {
			clickElement(findByDataUrl('/professions'));
		},

		platesmithing: function() {
			clickElement(findByDataUrl('/professions-tasks/Armorsmithing_Heavy'));
		},

		pageWithTaskWithPageLimit: function(taskTitle, pagesToTry) {
			return function() {
				var d = $.Deferred();

				if (pagesToTry <= 0) {
					d.reject();
				} else {
					if (taskExists(taskTitle)) {
						d.resolve();
					} else {
						processChain(
							nextPage,
							Timing.pause,
							navigateTo.pageWithTask(taskTitle, pagesToTry-1),
							[d.resolve, d.reject]
						);
					}
				}


				return d.promise();
			}
		},

		pageWithTask: function(taskTitle) {
			// When should we start worrying?
			return navigateTo.pageWithTaskWithPageLimit(taskTitle, 20);
		}
	};

	return navigateTo;

})();


var Timing = (function() {

	var timing = {
		wait: function(milliseconds) {
			return function() {
				var waitForIt = $.Deferred();

				setTimeout(function() {
					waitForIt.resolve();
				}, milliseconds)

				return waitForIt.promise();
			}
		}
	}

	// have this rely on waiting for that spinny thing to go away? $('.loading-block').length
	timing.pause = timing.wait(3000);

	return timing;
})();

var Logging = (function() {

	var logging = {
		console: function(message) {
			return function() {
				console.log(message);
			}
		},
		alert: function(message) {
			return function() {
				alert(message);
			}
		}
	};

	return logging;
})();

var Tasks = {
	gather: {
		ore: {
			high: 'Gather High quality Iron Ore'
		}
	}
};

// make a mapping table of profession -> known tasks and have it auto navigate by passing in string/const?
function gatherHighQualityIronOre() {
	processChain(
		NavigateTo.platesmithing,
		Timing.pause,
		NavigateTo.pageWithTask(Tasks.gather.ore.high),
		[Logging.alert('found'), Logging.alert('not found')]
	);
}

main();