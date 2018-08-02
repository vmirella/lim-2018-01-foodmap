const divMap = document.getElementById('map');
let map;
function initMap() {
	map = new google.maps.Map(divMap, {
	center: {lat: -34.397, lng: 150.644},
	zoom: 8
	});
}
 