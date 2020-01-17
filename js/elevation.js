function displayPathElevation() {
    var path = poly.getPath();
    localStorage.setItem('step', 256);
    var step = parseFloat(localStorage.getItem('step'));

    localStorage.setItem('distance', google.maps.geometry.spherical.computeLength(path));
    // Create a PathElevationRequest object using this array.
    // Ask for 256 samples along that path.
    // Initiate the path request.

    if(path.getLength() == 1) {
        var start = new google.maps.Marker({
            position: path.getAt(0),
            title: 'Start',
            icon: 'images/start.png',
            map: map
       });

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
        'samples': step
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
    var chart = new google.visualization.LineChart(chartDiv);

    // Extract the data from which to populate the chart.
    // Because the samples are equidistant, the 'Sample'
    // column here does double duty as distance along the
    // X axis.
    var data = new google.visualization.DataTable();

    var step = parseFloat(localStorage.getItem('step'));
    var distance = parseFloat(localStorage.getItem('distance'));

    var data_str = "Distance, Elevation\n";
    data.addColumn('string', 'Distance');
    data.addColumn('number', 'Elevation');
    for (var i = 0; i < elevations.length; i++) {
        var d = i * distance/step;

        if (i % 20 == 0 || i == elevations.length-1) {
            data.addRow([Math.round(d).toString(), elevations[i].elevation]);
        } else {
            data.addRow(['', elevations[i].elevation]);
        }
        
        data_str += d + ", " + elevations[i].elevation + "\n";
    }

    data_str = data_str.replace(/[\s\r\n]+$/, '');

    localStorage.setItem('data', data_str);

    // Draw the chart using the data within its DIV.
    chart.draw(data, {
        height: 150,
        legend: 'none',
        titleY: 'Elevation (m)',
        titleX: 'Distance (m)'
    });
}

function exportCSV() {
    var data = localStorage.getItem('data');
    var blob = new Blob([data], { type: 'text/csv;charset=utf-8;' });
    if (navigator.msSaveBlob) { // IE 10+
        navigator.msSaveBlob(blob, filename);
    } else {
        var link = document.createElement("a");
        if (link.download !== undefined) { // feature detection
            // Browsers that support HTML5 download attribute
            var url = URL.createObjectURL(blob);
            link.setAttribute("href", url);
            link.setAttribute("download", "pipeline-elevation.csv");
            link.style.visibility = 'hidden';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    }
}