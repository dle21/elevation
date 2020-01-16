function displayPathElevation() {
    var path = poly.getPath();
    localStorage.setItem('size', 256);
    var size = parseFloat(localStorage.getItem('size'));

    localStorage.setItem('distance', google.maps.geometry.spherical.computeLength(path));
    // Create a PathElevationRequest object using this array.
    // Ask for 256 samples along that path.
    // Initiate the path request.

    if(path.getLength() == 1) {
        elevator.getElevationForLocations({
        'locations': path.getArray()
        }, function(results, status) {
        infowindow.setPosition(path.getAt(0));
        if (status === 'OK') {
            // Retrieve the first result
            if (results[0]) {
            // Open the infowindow indicating the elevation at the clicked position.
            infowindow.setContent(results[0].elevation + ' meters.');
            } else {
            infowindow.setContent('No results found');
            }
        } else {
            infowindow.setContent('Elevation service failed due to: ' + status);
        }
        });
    } else if (path.getLength() > 1) {
        infowindow.close()
        elevator.getElevationAlongPath({
        'path': path.getArray(),
        'samples': size
        }, plotElevation);
    };
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

    var size = parseFloat(localStorage.getItem('size'));
    var distance = parseFloat(localStorage.getItem('distance'));

    var elev_str = "";
    data.addColumn('string', 'Distance');
    data.addColumn('number', 'Elevation');
    for (var i = 0; i < elevations.length; i++) {
        var d = i * distance/size;

        if (i%20 == 0) {
            data.addRow([Math.round(d).toString(), elevations[i].elevation]);
        } else {
            data.addRow(['', elevations[i].elevation]);
        }
        
        elev_str += elevations[i].elevation + "\n";
    }

    elev_str = elev_str.replace(/[\s\r\n]+$/, '');

    localStorage.setItem('elevation_string', elev_str);

    // Draw the chart using the data within its DIV.
    chart.draw(data, {
        height: 150,
        legend: 'none',
        titleY: 'Elevation (m)',
        titleX: 'Distance (m)'
    });
}