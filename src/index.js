const input = document.getElementById('searchTextField');
const divMap = document.getElementById('map');
const buttonSearch =document.getElementById('button-search');
let map;
let service;
let infowindow;
function initMap() {
	var mapCenter = new google.maps.LatLng(-33.8617374,151.2021291);
	map = new google.maps.Map(divMap, {
	center: mapCenter,
	zoom: 13
	});

	var request = {
		query: 'Museum of Contemporary Art Australia',
		fields: ['photos', 'formatted_address', 'name', 'rating', 'opening_hours', 'geometry'],
	
	  service = new google.maps.places.PlacesService(map);
	  service.findPlaceFromQuery(request, callback);
	}
	
	function callback(results, status) {
	  if (status == google.maps.places.PlacesServiceStatus.OK) {
		for (var i = 0; i < results.length; i++) {
		  var place = results[i];
		  createMarker(results[i]);
		}
	  }
	}
}

buttonSearch.addEventListener('click', () => {
	/* var options = {
  types: ['establishment']
}; */
//const searchBox = new google.maps.places.SearchBox(input, {
	//bounds: defaultBounds
  //});
//results.searchBox;
});

