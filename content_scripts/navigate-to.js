var NavigateTo = (function() {

	var dataUrls = {
		overview: '/professions',
		platesmithing: '/professions-tasks/Armorsmithing_Heavy',
		leadership: '/professions-tasks/Leadership'
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

		profession: function(profession) {
			return function() {
				clickElement(findByDataUrl(dataUrls[profession]));
			}
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
						Async.processChain([
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