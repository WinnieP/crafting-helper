var queue = Async.processChain([]);

chrome.runtime.onConnect.addListener(function(port) {
	console.assert(port.name == 'commands');
	port.onMessage.addListener(function(msg) {
		switch(msg.action) {
			case 'addTask':
				addToQueue(Tasks.startTask(msg.profession, msg.name), msg.id, port);
				break;
			case 'collectAll':
				addToQueue(Tasks.collectAll(), msg.id, port);
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

function clickElement($element) {
	var event = document.createEvent("MouseEvent");
	event.initMouseEvent("click", true, true, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
	$element[0].dispatchEvent(event);
}
