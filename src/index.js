const input = document.getElementById('searchTextField');
const divMap = document.getElementById('map');
const buttonSearch = document.getElementById('button-search');
const listResults = document.getElementById('results');
//Objetos del modal
const modalImage = document.getElementById('modal-image');
const modalName = document.getElementById('modal-name');
const modalAddress = document.getElementById('modal-address');
const modalPhone = document.getElementById('modal-phone');

//contenedores
const splash = document.getElementById('splash');
const divContainer = document.getElementById('div-container');

let map;
let service;
let infoWindow;
let markers = [];

window.onload = () => {
	setTimeout(() => {
		splash.style.display = 'none';
		divContainer.style.display = 'block';
	}, 2000); //tiempo en milisegundos
};

function initMap() {
	map = new google.maps.Map(document.getElementById('map'), {
		center: {lat: -12.145486, lng: -77.021850}, 
		zoom: 16
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
				radius: 1500, 
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

	//let placeLoc = place.geometry.location;
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

	service.getDetails(request, function(place, status) {
		let photos = [
			{
			   "html_attributions" : [],
			   "height" : 40,
			   "width" : 40,
			   "photo_reference" : "CnRvAAAAwMpdHeWlXl-lH0vp7lez4znKPIWSWvgvZFISdKx45AwJVP1Qp37YOrH7sqHMJ8C-vBDC546decipPHchJhHZL94RcTUfPa1jWzo-rSHaTlbNtjh-N68RkcToUCuY9v2HNpo5mziqkir37WU8FJEqVBIQ4k938TI3e7bf8xq-uwDZcxoUbO_ZJzPxremiQurAYzCTwRhE_V0"
			}];
		//Imprimimos el local en la lista de resultados
		let output = `<li class="media result-data" data-name="${place.name}" data-phone="${place.formatted_phone_number}" data-address="${place.formatted_address}" data-image="${place.icon}">
			<img class="mr-3" src="${place.icon}" alt="image">
			<div class="media-body">
				<h5 class="mt-0 mb-1">${place.name}</h5>
				${place.formatted_address}
			<br>`;
		
		if (!!place.formatted_phone_number) { //Si tiene telefono
			output += `${place.formatted_phone_number}`;
		}
		
		output += `</div>
			</li>`;

		//console.log(place.photos[0].html_attributions[0]); Imagen solo se muestra en consola

		listResults.insertAdjacentHTML('beforeend', output);
	});

	//Ponemos evento clic a la marca
	google.maps.event.addListener(marker,'click',function(){
		service.getDetails(request, function(place, status) {
			if (status == google.maps.places.PlacesServiceStatus.OK) { //Verifica el permiso place de la API
				let contentStr = '<h5><strong>' + place.name + '</strong></h5><p>' + place.formatted_address;
				if (!!place.formatted_phone_number) {
					contentStr += '<br>' + place.formatted_phone_number;
				}
				
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

	listResults.innerHTML = '';

	let service = new google.maps.places.PlacesService(map);

	service.nearbySearch({
		location: map.getCenter(),
		radius: 1500, 
		types: ['restaurant']
	}, callback);
});

//Funciones jquery
$(document).ready(function() {

	//No funciona con arrow function
	$('#results').on('click', 'li', function() {
		let name = $(this).attr('data-name');
		let phone = $(this).attr('data-phone');
		let address = $(this).attr('data-address');
		let image = $(this).attr('data-image');

		modalImage.src = image;
		modalName.innerHTML = name;
		modalAddress.innerHTML = address;
		if(phone != 'undefined'){
			modalPhone.innerHTML = phone;
		}
		

		$('#modal-result').modal('show');
	});
	
});
