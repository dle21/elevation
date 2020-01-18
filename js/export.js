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

// function exportPDF() {
//     var divContents = $(pdf).html();
//     console.log(divContents);
//     var printWindow = window.open('', '', 'height=400,width=800');
//     printWindow.document.write('<html><head><title>PDF Viewer</title>');
//     printWindow.document.write('</head><body>');
//     printWindow.document.write(divContents);
//     printWindow.document.write('</body></html>');
//     printWindow.document.close();
//     printWindow.print();
// }

// //Create PDf from HTML...
function exportPDF() {
    var HTML_Width = $("#pdf").width();
    var HTML_Height = $("#pdf").height();
    var top_left_margin = 15;
    var PDF_Width = HTML_Width + (top_left_margin * 2);
    var PDF_Height = (PDF_Width * 1.5) + (top_left_margin * 2);
    var canvas_image_width = HTML_Width;
    var canvas_image_height = HTML_Height;

    var totalPDFPages = Math.ceil(HTML_Height / PDF_Height) - 1;

    html2canvas($("#pdf")[0]).then(function (canvas) {
        var imgData = canvas.toDataURL("image/jpeg", 1.0);
        var pdf = new jsPDF('p', 'pt', [PDF_Width, PDF_Height]);
        pdf.addImage(imgData, 'JPG', top_left_margin, top_left_margin, canvas_image_width, canvas_image_height);
        for (var i = 1; i <= totalPDFPages; i++) { 
            pdf.addPage(PDF_Width, PDF_Height);
            pdf.addImage(imgData, 'JPG', top_left_margin, -(PDF_Height*i)+(top_left_margin*4),canvas_image_width,canvas_image_height);
        }
        pdf.save("Your_PDF_Name.pdf");
        $("#pdf").hide();
    });

    $("#pdf").show();
}