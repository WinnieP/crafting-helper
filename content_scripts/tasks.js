var Tasks = (function() {

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
				NavigateTo.overview,
				Timing.pause,
				collectSlot(slot),
				Timing.pause,
				collectModal
			]);
		},

		collectAll: function() {
			var slots = getCompletedSlots(),
				steps = _.map(slots, function(slotNumber) {
						return tasks.collect(slotNumber);
					}),
				stepsWithPauses = _.flatten(
						_.zip(steps, repeat(Timing.wait, steps.length))
					);

				Async.processChain(stepsWithPauses);
		},

		startTask: function(profession, taskName) {
			return Async.createStep([
				NavigateTo[profession],
				Timing.pause,
				openTask(taskName),
				clickStart
			]);
		}
	};

	return tasks;

})();