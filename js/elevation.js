function displayPathElevation() {
    var path = poly.getPath();

    localStorage.setItem("Alignment", path.getArray())

    var step = parseFloat(document.getElementById("step").value);

    if(!step) {
        step = 54;
        document.getElementById("stepLabel").innerHTML = step;
    }

    localStorage.setItem('step', step);

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
    // var chart = new google.charts.Line(chartDiv);

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
        var d = i * distance/(step-1);
        if (i % 5 == 0 || i == elevations.length-1) {
            data.addRow([Math.round(d).toString(), elevations[i].elevation]);
        } else {
            data.addRow(['', elevations[i].elevation]);
        }
        // data.addRow([Math.round(d), elevations[i].elevation]);
        data_str += d + ", " + elevations[i].elevation + "\n";
    }

    data_str = data_str.replace(/[\s\r\n]+$/, '');

    localStorage.setItem('elevation', data_str);

    // Draw the chart using the data within its DIV.
    chart.draw(data, {
        height: '100%',
        width: '100%',
        legend: 'none',
        titleY: 'Elevation (m)',
        titleX: 'Distance (m)',
        // hAxis: {
        //     title: 'Distance (m)',
        //     titleTextStyle: {
        //         fontName: 'arial',
        //         fontSize: '20',
        //         bold: 'true',
        //     }
        // },
        // vAxis: {
        //     title: 'Elevation (m)',
        //     titleTextStyle: {
        //         fontName: 'arial',
        //         fontSize: '20',
        //         bold: 'true',
        //     }
        // }

    });
}