const input = document.getElementById('searchTextField');
const divMap = document.getElementById('map');
const buttonSearch = document.getElementById('button-search');
const divResults = document.getElementById('results');
let map;
let service;
let infoWindow;
let markers = [];

function initMap() {
	map = new google.maps.Map(document.getElementById('map'), {
		center: {lat: -12.145486, lng: -77.021850}, 
		zoom: 15
	});
	infoWindow = new google.maps.InfoWindow;
	
	// Try HTML5 geolocation.
	if (navigator.geolocation) {
		navigator.geolocation.getCurrentPosition(function(position) {
			let pos = {
				lat: position.coords.latitude,
				lng: position.coords.longitude
			};

			infoWindow.setPosition(pos);
			infoWindow.setContent('Tu ubicación');
			infoWindow.open(map);
			map.setCenter(pos);

			let service = new google.maps.places.PlacesService(map);
			service.nearbySearch({
				location: pos,
				radius: 500, 
				types: ['restaurant']
			}, callback);

		}, function() {
			handleLocationError(true, infoWindow, map.getCenter());
		});
	} else {
		// Browser doesn't support Geolocation
		handleLocationError(false, infoWindow, map.getCenter());
	}
}

function handleLocationError(browserHasGeolocation, infoWindow, pos) {
	infoWindow.setPosition(pos);
	infoWindow.setContent(browserHasGeolocation ?
	'Error: El servicio de geolocalización falló.' :
	'Error: Tu navegador no soporta la geolocalización.');
	infoWindow.open(map);
}

function callback(results, status) {
	if (status === google.maps.places.PlacesServiceStatus.OK) {
		for (let i = 0; i < results.length; i++) {
			createMarker(results[i]);
		}
	}
}

function createMarker(place) {
	//Si el texto a buscar esta contenido en el nombre del lugar
	let placeName = (place.name).toUpperCase();
	let search = (input.value).toUpperCase();

	//Busqueda por nombre
	if (placeName.indexOf(search) === -1 ) {
		return;
	}

	let placeLoc = place.geometry.location;
	let image;
	if (place.icon) {
		image = new google.maps.MarkerImage(
			place.icon, new google.maps.Size(71, 71),
			new google.maps.Point(0, 0), new google.maps.Point(17, 34),
			new google.maps.Size(25, 25));
	} 
	else {
		image = null;
	}
	let marker = new google.maps.Marker({
		map: map,
		icon: image,
		position: place.geometry.location
	});

	markers.push(marker); //Guardamos las marcas en el array markers

	service = new google.maps.places.PlacesService(map);
	let request =  {
		reference: place.reference
	};
	google.maps.event.addListener(marker,'click',function(){
		service.getDetails(request, function(place, status) {
			if (status == google.maps.places.PlacesServiceStatus.OK) {
				let contentStr = '<h5><strong>'+place.name+'</strong></h5><p>'+place.formatted_address;
				if (!!place.formatted_phone_number) contentStr += '<br>'+place.formatted_phone_number;
				if (!!place.website) contentStr += '<br><a target="_blank" href="'+place.website+'">'+place.website+'</a>';
				//contentStr += '<br>'+place.types+'</p>';
				//contentStr += '<br>ID: '+place.place_id+'</p>';
				infoWindow.setContent(contentStr);
				infoWindow.open(map,marker);
			} else { 
				let contentStr = "<h5>No Hubo Resultados, status="+status+"</h5>";
				infoWindow.setContent(contentStr);
				infoWindow.open(map,marker);
			}
		});
	});
}

function setMapOnAll(map) {
	for (var i = 0; i < markers.length; i++) {
		markers[i].setMap(map);
	}
	markers = [];
}

buttonSearch.addEventListener('click', () => {
	setMapOnAll(null); //Borrar las marcas actuales
	let service = new google.maps.places.PlacesService(map);
	service.nearbySearch({
		location: map.getCenter(),
		radius: 500, 
		types: ['restaurant']
	}, callback);
});

