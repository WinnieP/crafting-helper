var queue = Async.processChain([]),
	mode = 'manual';

chrome.runtime.onConnect.addListener(function(port) {
	console.assert(port.name == 'commands');
	port.onMessage.addListener(function(msg) {
		switch(msg.action) {
			case 'addTask':
				// should disable inputs instead
				if (mode == 'manual') {
					addToQueue(Tasks.startTask(msg.profession, msg.name), msg.id, port);
				}
				break;
			case 'collectAll':
				if (mode == 'manual') {
					addToQueue(Tasks.collectAll(), msg.id, port);
				}
				break;
			case 'changeMode':
				changeMode(msg.mode, msg.profession, msg.name)
				break;
		}
	});
});

function addToQueue(action, id, port) {
	queue = queue
		.then(action)
		.then(function(val) {
				try {
					port.postMessage({ result: 'done', id:  id });
				} catch (e) {
					console.log('failed to notify popup using (id, port)', id, port);
				}
				return $.Deferred().resolve(val).promise();
			})
		.then(Timing.wait(2500));
}

function changeMode(newMode, profession, name) {
	if (mode != newMode) {
		if (newMode == 'auto') {
			switchToAuto(profession, name);
		} else {
			switchToManual();
		}
	}

	mode = newMode;
}

function switchToAuto(profession, name) {
	Tasks.repeat(Tasks.startTask(profession, name));
}

function switchToAuto() {
	Tasks.stop();
}

function clickElement($element) {
	var event = document.createEvent("MouseEvent");
	event.initMouseEvent("click", true, true, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
	$element[0].dispatchEvent(event);
}
