function clickElement($element) {
	var event = document.createEvent("MouseEvent");
	event.initMouseEvent("click", true, true, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
	$element[0].dispatchEvent(event);
}

function doIt() {
	var $platesmithingLink = $('a[data-url="/professions-tasks/Armorsmithing_Heavy"]');
	clickElement($platesmithingLink);
}

doIt();