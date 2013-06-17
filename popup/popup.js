document.addEventListener('DOMContentLoaded', function () {
	var app = createApp();
	app.start();
});


function createApp() {

	// This probably isn't a good idea
	var TaskNames = {
		platesmithing: {
			gatherHighQualityOre: 'Gather High quality Iron Ore',
			forgeSteelPlates: 'Forge Steel Plates'
		}
	};

	function sendMessage(data, handler) {
		chrome.tabs.query({active: true, currentWindow: true}, function(tab) {
			chrome.tabs.sendMessage(tab[0].id, data, handler);
		});
	}

	function addToQueue(name, id) {
		$('#queue').append($('<li>').text(name).addClass(id));
	}

	return {	

		start: function() {
			$('button.task').click(function(event) {
				var $el = $(event.target),
					profession = $el.data('profession'),
					taskName = TaskNames[profession][$el.data('name')],
					id = _.uniqueId('queue-item-');

				sendMessage({
					action: 'addTask',
					profession: profession,
					name: taskName,
					id: id
				});

				addToQueue(taskName, id);
			});


			$('button.collect-all').click(function(event) {
				sendMessage({ action: 'collectAll' });
			});
		}
	}
}