// Load the Visualization API and the columnchart package.
google.load('visualization', '1', {packages: ['columnchart']});

var poly;
var map;
var elevator;
// var markers = [];
var infowindow;
var deleteMenu;

function initialize() {

map = new google.maps.Map(document.getElementById('map'), {
    zoom: 10,
    center: {lat: -37.8136, lng: 144.9631},
    mapTypeId: 'terrain'
});

// Display a polyline of the elevation path.
poly = new google.maps.Polyline({
    editable: true,
    strokeColor: '#0000CC',
    strokeOpacity: 0.4,
    strokeWeight: 2,
    map: map
});

// Create an ElevationService.
elevator = new google.maps.ElevationService;

infowindow = new google.maps.InfoWindow({map: map});

// Draw the path, using the Visualization API and the Elevation service.
displayPathElevation(elevator, map);

// Add a listener for the click event
map.addListener('click', addLatLng);
google.maps.event.addListener(poly, "dragend", displayPathElevation);
google.maps.event.addListener(poly.getPath(), "insert_at", displayPathElevation);
google.maps.event.addListener(poly.getPath(), "remove_at", displayPathElevation);
google.maps.event.addListener(poly.getPath(), "set_at", displayPathElevation);

deleteMenu = new DeleteMenu();

google.maps.event.addListener(poly, 'rightclick', function(e) {
    // Check if click was on a vertex control point
    if (e.vertex == undefined) {
    return;
    }
    deleteMenu.open(map, poly.getPath(), e.vertex);
});
}

// Handles click events on a map, and adds a new point to the Polyline.
function addLatLng(event) {
var path = poly.getPath();

// Because path is an MVCArray, we can simply append a new coordinate
// and it will automatically appear.
if (!deleteMenu.isOpen) {
    path.push(event.latLng);
    poly.setPath(path);
} else {
    deleteMenu.isOpen = false;
}

// Draw the path, using the Visualization API and the Elevation service.
displayPathElevation(elevator, map);
}

google.maps.event.addDomListener(window, 'load', initialize);