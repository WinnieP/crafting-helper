function main() {
	gatherHighQualityIronOre();
}

function processChain() {
	var chain = $.Deferred(),
		lastRet = chain;

	for (var i = 0; i < arguments.length; i++) {
		lastRet = lastRet.then(arguments[i]);
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

		// Add a param for number of times allowed to go next until reject?
		pageWithTask: function(taskTitle) {
			return function() {
				var d = $.Deferred(),
					chain = $.Deferred();

				if (taskExists(taskTitle)) {
					d.resolve();
				} else {
					processChain(
						nextPage,
						Timing.pause,
						navigateTo.pageWithTask(taskTitle),
						d.resolve
					);
				}

				return d.promise();
			}
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
		Logging.alert('found')
	);
}

main();