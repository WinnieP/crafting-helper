var queue = Async.processChain([]);

chrome.runtime.onMessage.addListener(
	function(request, sender, sendResponse) {
		switch(request.action) {
			case 'addTask':
				addToQueue(Tasks.startTask(request.profession, request.name));
				break;
			case 'collectAll':
				addToQueue(Tasks.collectAll());
				break;
		}
	}
);

function addToQueue(action) {
	queue = queue.then(action).then(Timing.pause);
}

function clickElement($element) {
	var event = document.createEvent("MouseEvent");
	event.initMouseEvent("click", true, true, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
	$element[0].dispatchEvent(event);
}
