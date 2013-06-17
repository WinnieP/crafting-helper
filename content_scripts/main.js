var queue = [];

chrome.runtime.onMessage.addListener(
	function(request, sender, sendResponse) {
		switch(request.action) {
			case 'addTask':
				queue.push(Tasks.startTask(request.profession, request.name));
				break;
			case 'collectAll':
				queue.push(Tasks.collectAll);
				break;
		}

		if (queue.length == 1) {
			
		}
	}
);


function clickElement($element) {
	var event = document.createEvent("MouseEvent");
	event.initMouseEvent("click", true, true, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
	$element[0].dispatchEvent(event);
}
