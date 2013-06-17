

function clickElement($element) {
	var event = document.createEvent("MouseEvent");
	event.initMouseEvent("click", true, true, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
	$element[0].dispatchEvent(event);
}

function findByDataUrl(dataUrl) {
	return $('a[data-url="' + dataUrl + '"]');
}

function goToProfessions() {
	clickElement(findByDataUrl('/professions'));
}

function goToPlatesmithing() {
	clickElement(findByDataUrl('/professions-tasks/Armorsmithing_Heavy'));
}

function wait(milliseconds) {
	return function(deferred) {
		var waitForIt = $.Deferred();

		setTimeout(function() {
			waitForIt.resolve();
		}, milliseconds)

		return waitForIt.promise();
	}
}

function main() {
	var chain = $.Deferred();

	chain
		.then(goToProfessions)
		.then(wait(3000))
		.then(goToPlatesmithing);

	chain.resolve();
}

main();