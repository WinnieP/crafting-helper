function main() {
	goToProfessions();
}

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

main();