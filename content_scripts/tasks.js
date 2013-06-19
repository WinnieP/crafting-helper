var Tasks = (function() {

	var intervalId;

	function clickContinue($task) {
		clickElement($task.find('button')); // brittleness alert
	}

	function clickStart() {
		clickElement($('button:contains("Start Task")'));
	}

	function collectSlot(slot) {
		return function() {
			clickElement($('.professions-slots > li:nth-child(' + (slot + 1) + ') button:contains("Collect Result")'));
		}
	}

	function collectModal() {
		clickElement($('#modal_content button:contains("Collect Result")'));
	}

	function getCompletedSlots() {
		var slots = [];

		$('.professions-slots > li').each(function(idx, el) {
			if ($(el).find('*:contains("Task Complete!")').length) {
				slots.push(idx);
			}
		})

		return slots;
	}

	function repeat(val, times) {
		if (times <= 0) {
			return [];
		} else {
			return repeat(val, times-1).concat(val);
		}
	}
	
	function openTask(taskTitle) {
		return Async.createStep([
				NavigateTo.pageWithTask(taskTitle, 20),
				clickContinue,
				Timing.pause
		]);
	}

	var tasks = {

		collect: function(slot) {
			return Async.createStep([
				NavigateTo.profession('overview'),
				Timing.pause,
				collectSlot(slot),
				Timing.pause,
				collectModal
			]);
		},

		collectAll: function() {
			console.log('collectAll:called');
			var navigation = Async.createStep([NavigateTo.profession('overview'), Timing.pause]),
				collectCompleted = function() {
						var slots = getCompletedSlots(),
							steps = _.map(slots, function(slotNumber) {
									return tasks.collect(slotNumber);
								}),
							stepsWithPauses = _.flatten(
									_.zip(steps, repeat(Timing.pause(1000), steps.length))
								)

						return Async.processChain(stepsWithPauses);
					}

			return Async.createStep([navigation, collectCompleted]);
		},

		startTask: function(profession, taskName) {
			return Async.createStep([
				NavigateTo.profession(profession),
				Timing.pause,
				openTask(taskName),
				clickStart
			]);
		},

		repeat: function(task) {
			var openSlots;

			Async.processChain([
				NavigateTo.profession('overview'),
				Timing.pause
			]).then(function() {

				var func = function() {
					console.log('tick');
					if (mode != 'auto') {
						clearInterval(intervalId);
					} else {						
						openSlots = getCompletedSlots();
						if (openSlots.length) {
							clearInterval(intervalId);

							Async.processChain([
								tasks.collect(openSlots[0]),
								Timing.pause,
								task,
								Timing.pause,
								NavigateTo.profession('overview'),
								Timing.pause
							]).then(function() {
								intervalId = setInterval(func, 1000)
							});
						}
					}
				};

				intervalId = setInterval(func, 1000);
			})
		}

		stop: function() {
			clearInterval(intervalId);
			intervalId = null;
		}
	};

	return tasks;

})();