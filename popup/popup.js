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
			forgeSteelPlates: 'Forge Steel Plates',
			forgeIronPlates: 'Forge Iron Plates'
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
				var items = [];

				for (var name in professionTaskNames) {
					items.push(Handlebars.templates['task-item']({
						profession: profession,
						name: name,
						text: professionTaskNames[name]
					}));
				}

				var menu = Handlebars.templates['task-profession-menu']({
					profession: profession,
					items: items.join(''),
				})

				$('#actions').append(menu);
			}
		},

		connectToPort: function() {
			chrome.tabs.query({active: true, currentWindow: true}, function(tab) {
				try {
					port = chrome.tabs.connect(tab[0].id, {name: 'commands'});
					port.onMessage.addListener(function(msg) {
						if (msg.result == 'done') {
							removeFromQueue(msg.id);
						}
					});
				} catch (e) {
					console.log('Failed to connect to tab: ', tab[0])
				}
			});
		},

		bindButtons: function() {
			$('.task-menu-heading').click(function() {
				$(this).closest('.pure-menu').toggleClass('pure-menu-open')
			});

			$('.task').click(function(event) {
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

			$('.collect-all').click(function(event) {
				var id = sendMessage({ action: 'collectAll' });
				addToQueue('Collect All', id)
			});
		}
	};
}