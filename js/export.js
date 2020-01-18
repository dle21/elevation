function exportSHP_excel() {
    var shp_str = localStorage.getItem('Alignment');
    shp_str = "Latitude, Longitude\n" + shp_str.replace(/[()]/g, "")

    var num = 1;
    var header = true;
    for(i = 0; i < shp_str.length; i++) {
        if(shp_str[i] == ',') {
            if(num %2 == 1) {
                if(header) {
                    header = false;
                } else {
                    shp_str = shp_str.substr(0, i) + "\n"+ shp_str.substr(i + "\n".length);
                };
            };
            num++;
        };
    };

    _exportCSV(shp_str, 'pipeline-alignment-shp.csv');
};

function export_data() {
    var elevation = localStorage.getItem('elevation');
    _exportCSV(elevation, 'pipeline-elevation.csv');
}

function exportPDF() {
    var divContents = $("#pdf").html();
    var printWindow = window.open('', '', 'height=400,width=800');
    printWindow.document.write('<html><head><title>PDF Viewer</title>');
    printWindow.document.write('</head><body>');
    printWindow.document.write(divContents);
    printWindow.document.write('</body></html>');
    printWindow.document.close();
    printWindow.print();
}

function _exportCSV(data, name) {
    var blob = new Blob([data], { type: 'text/csv;charset=utf-8;' });
    if (navigator.msSaveBlob) { // IE 10+
        navigator.msSaveBlob(blob, filename);
    } else {
        var link = document.createElement("a");
        if (link.download !== undefined) { // feature detection
            // Browsers that support HTML5 download attribute
            var url = URL.createObjectURL(blob);
            link.setAttribute("href", url);
            link.setAttribute("download", name);
            link.style.visibility = 'hidden';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    }
}