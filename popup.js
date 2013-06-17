

document.addEventListener('DOMContentLoaded', function () {
	chrome.tabs.getSelected(null, function(tab) {
		var app = createApp(tab);
		app.start();
	});
});

// This probably isn't a good idea
var TaskNames = {
	platesmithing: {
		gatherHighQualityOre: 'Gather High quality Iron Ore',
		forgeSteelPlates: 'Forge Steel Plates'
	}
};

function createApp(tab) {
	function sendMessage(data, handler) {
		chrome.tabs.sendMessage(tab.id, data, handler || function(response) {});
	}

	return {
		start: function() {
			$('button').click(function(event) {
				var $el = $(event.target),
					profession = $el.data('profession'),
					taskName = TaskNames[profession][$el.data('name')];

				sendMessage({
					action: 'addTask',
					profession: profession,
					name: taskName
				});
			});
		}
	}
}