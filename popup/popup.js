document.addEventListener('DOMContentLoaded', function () {
	var app = createApp();
	app.start();
});


function createApp() {

	var port;

	// This probably isn't a good idea
	var TaskNames = {
		platesmithing: {
			gatherHighQualityOre: 'Gather High quality Iron Ore',
			massSteelPlateForging: 'Mass Steel Plate Forging',
			forgeSteelPlates: 'Forge Steel Plates'
		},
		leadership: {
			feedTheNeedy: 'Feed the Needy',
			assistLocalWizard: 'Assist Local Wizard'
		}
	};

	function sendMessage(data) {
		var id = _.uniqueId('queue-item-');
		data.id = id;
		port.postMessage(data)
		return id;
	}

	function addToQueue(name, id) {
		$('#queue').append($('<li>').text(name).addClass(id));
	}

	function removeFromQueue(id) {
		$('#queue').find('li.' + id).remove();
	}


	return {	

		start: function() {
			this.connectToPort();
			this.addTaskButtons();
			this.bindButtons();
		},

		addTaskButtons: function() {
			for (var profession in TaskNames) {
				var professionTaskNames = TaskNames[profession];

				for (var name in professionTaskNames) {
					var html = Handlebars.templates['task-button']({
						profession: profession,
						name: name,
						text: professionTaskNames[name]
					})
					$('#actions').append(html);
				}
			}
		},

		connectToPort: function() {
			chrome.tabs.query({active: true, currentWindow: true}, function(tab) {
				console.log(tab);
				port = chrome.tabs.connect(tab[0].id, {name: 'commands'});
				port.onMessage.addListener(function(msg) {
					if (msg.result == 'done') {
						removeFromQueue(msg.id);
					}
				});
			});
		},

		bindButtons: function() {
			$('button.task').click(function(event) {
				var $el = $(event.target),
					profession = $el.data('profession'),
					taskName = TaskNames[profession][$el.data('name')],
					id;
					

				id = sendMessage({
					action: 'addTask',
					profession: profession,
					name: taskName
				});

				addToQueue(taskName, id);
			});

			$('button.collect-all').click(function(event) {
				var id = sendMessage({ action: 'collectAll' });
				addToQueue('Collect All', id)
			});
		}
	};
}