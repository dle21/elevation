// https://developers-dot-devsite-v2-prod.appspot.com/maps/documentation/javascript/examples/elevation-paths?_sm_au_=iVVQ0SRMrjTRq8D7BNT0NK6RWkLVC
// https://jsfiddle.net/api/post/library/pure/


// Load the Visualization API and the columnchart package.
google.load('visualization', '1', {packages: ['columnchart']});

function initMap() {
  // The following path marks a path from Mt. Whitney, the highest point in the
  // continental United States to Badwater, Death Valley, the lowest point.
  var path = [

    // West Branch
      {lat: -37.717074532, lng: 145.738043553},
      {lat: -37.71692, lng: 145.73973},
      {lat:-37.71366, lng: 145.7473}
      ];

    // East Branch
      // {lat : -37.704613099, lng: 145.742565545},
      // {lat: -37.70877, lng: 145.74574},
      // {lat:-37.71118, lng: 145.7455},
      // {lat: -37.71366, lng: 145.7473}
      // ]; 

    //   Confluence
      // {lat: -37.71366, lng: 145.7473},
      // {lat: -37.71602, lng: 145.74905},
      // {lat: -37.7224, lng:145.75411},
      // {lat: -37.72332, lng: 145.75231},
      // {lat: -37.7258, lng: 145.75235}     
      // ];

  var map = new google.maps.Map(document.getElementById('map'), {
    zoom: 20,
    center: path[1],
    mapTypeId: 'terrain'
  });

  // Create an ElevationService.
  var elevator = new google.maps.ElevationService;

  // Draw the path, using the Visualization API and the Elevation service.
  displayPathElevation(path, elevator, map);
}

function displayPathElevation(path, elevator, map) {
  // Display a polyline of the elevation path.
  var poly = new google.maps.Polyline({
    path: path,
    strokeColor: '#0000CC',
    strokeOpacity: 0.4,
    map: map
  });
  var sam_num = 256
  
	console.log(google.maps.geometry.spherical.computeLength(poly.getPath()) + ", " + sam_num);
  // Create a PathElevationRequest object using this array.
  // Ask for 256 samples along that path.
  // Initiate the path request.
  elevator.getElevationAlongPath({
    'path': path,
    'samples': sam_num
  }, plotElevation);
}

// Takes an array of ElevationResult objects, draws the path on the map
// and plots the elevation profile on a Visualization API ColumnChart.
function plotElevation(elevations, status) {
  var chartDiv = document.getElementById('elevation_chart');
  if (status !== 'OK') {
    // Show the error code inside the chartDiv.
    chartDiv.innerHTML = 'Cannot show elevation: request failed because ' +
        status;
    return;
  }
  // Create a new chart in the elevation_chart DIV.
  var chart = new google.visualization.ColumnChart(chartDiv);

  // Extract the data from which to populate the chart.
  // Because the samples are equidistant, the 'Sample'
  // column here does double duty as distance along the
  // X axis.
  var data = new google.visualization.DataTable();
  var ele = "";
  data.addColumn('string', 'Sample');
  data.addColumn('number', 'Elevation');
  for (var i = 0; i < elevations.length; i++) {
    data.addRow(['', elevations[i].elevation]);
    ele += elevations[i].elevation + ", ";
  }
  console.log(ele)
  
  // Draw the chart using the data within its DIV.
  chart.draw(data, {
    height: 150,
    legend: 'none',
    titleY: 'Elevation (m)'
  });
}