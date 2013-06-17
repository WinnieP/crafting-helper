// This probably isn't a good idea
var TaskNames = {
	platesmithing: {
		gatherHighQualityOre: 'Gather High quality Iron Ore',
		forgeSteelPlates: 'Forge Steel Plates'
	}
};

function main() {
	processChain([
		Tasks.collect(1),
		Timing.pause,
		Tasks.startTask('platesmithing', TaskNames.platesmithing.gatherHighQualityOre)
	]);
}

function processChain(steps) {
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
}

function createStep() {
	var args = arguments;

	return function() {
		var d = $.Deferred();

		processChain(args).then(d.resolve, d.reject)

		return d.promise();
	}
}

function clickElement($element) {
	var event = document.createEvent("MouseEvent");
	event.initMouseEvent("click", true, true, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
	$element[0].dispatchEvent(event);
}

var NavigateTo = (function() {

	var dataUrls = {
		overview: '/professions',
		platesmithing: '/professions-tasks/Armorsmithing_Heavy'
	};

	function findByDataUrl(dataUrl) {
		return $('a:visible[data-url="' + dataUrl + '"]'); // visible b/c not sure what that other thing is
	}

	function findTask(title) {
		var $title = $('span:contains("' + title + '")');
		return $title.closest('tr'); // brittleness alert
	}


	function nextPage() {
		clickElement($('#tasklist_next'));
	}

	var navigateTo = {

		overview: function() {
			clickElement(findByDataUrl(dataUrls.overview));
		},

		platesmithing: function() {
			clickElement(findByDataUrl(dataUrls.platesmithing));
		},

		// Returns callback that will go to next page until task is found
		// and resolve with the jQuery row entry corresponding to that task
		// Probably better to just keep going until on last page and then reject	
		pageWithTask: function(taskTitle, pagesToTry) {
			return function() {
				var d = $.Deferred(),
					task = findTask(taskTitle);

				if (pagesToTry <= 0) {
					d.reject();
				} else {
					if (task.length) {
						d.resolve(task);
					} else {
						processChain([
							nextPage,
							Timing.pause,
							navigateTo.pageWithTask(taskTitle, pagesToTry-1),
							[d.resolve, d.reject]
						]);
					}
				}


				return d.promise();
			}
		}

	};

	return navigateTo;

})();

var Tasks = (function() {

	function clickContinue($task) {
		clickElement($task.find('button')); // brittleness alert
	}

	function clickStart() {
		clickElement($('button:contains("Start Task")'));
	}

	function collectSlot(slot) {
		return function() {
			clickElement($('.professions-slots li:nth-child(' + (slot + 1) + ') button:contains("Collect Result")'));
		}
	}

	function collectModal() {
		clickElement($('#modal_content button:contains("Collect Result")'));
	}
	
	function openTask(taskTitle) {
		// When should we start worrying?
		return function() {
			var d = $.Deferred();

			processChain([
				NavigateTo.pageWithTask(taskTitle, 20),
				clickContinue,
				Timing.pause,
				[d.resolve, d.reject]
			]);

			return d.promise();
		};
	}

	var tasks = {

		collect: function(slot) {
			return createStep(
				NavigateTo.overview,
				Timing.pause,
				collectSlot(slot),
				Timing.pause,
				collectModal
			);
		},

		startTask: function(profession, taskName) {
			return createStep(
				NavigateTo[profession],
				Timing.pause,
				openTask(taskName),
				clickStart
			);
		}
	};

	return tasks;

})();


var Timing = (function() {

	var timing = {

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


main();