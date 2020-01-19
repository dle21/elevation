/**
 * A menu that lets a user delete a selected vertex of a path.
 * @constructor
 */
function DeleteMenu() {
    this.isOpen = false;
    this.div_delete = document.createElement('div');
    this.div_delete.className = 'delete-menu';
    this.div_delete.innerHTML = 'Delete';
    this.div_clear = document.createElement('div');
    this.div_clear.className = 'delete-menu';
    this.div_clear.innerHTML = 'Clear';

    var menu = this;
    google.maps.event.addDomListener(this.div_delete, 'click', function() {
        menu.removeVertex();
    });

    google.maps.event.addDomListener(this.div_clear, 'click', function() {
        menu.clearVertices();
    });
}

DeleteMenu.prototype = new google.maps.OverlayView();

DeleteMenu.prototype.onAdd = function() {
    var deleteMenu = this;
    var map = this.getMap();
    this.getPanes().floatPane.appendChild(this.div_delete);
    this.getPanes().floatPane.appendChild(this.div_clear);
    this.isOpen = true;
    // mousedown anywhere on the map except on the menu div will close the
    // menu.
    this.divListener_ = google.maps.event.addDomListener(map.getDiv(), 'mousedown', function(e) {
        if (e.target != deleteMenu.div_delete & e.target != deleteMenu.div_clear) {
            deleteMenu.close();
        }
    }, true);
};

DeleteMenu.prototype.onRemove = function() {
    google.maps.event.removeListener(this.divListener_);
    this.div_delete.parentNode.removeChild(this.div_delete);
    this.div_clear.parentNode.removeChild(this.div_clear);

    // clean up
    this.set('position');
    this.set('path');
    this.set('vertex');
};

DeleteMenu.prototype.close = function() {
    this.setMap(null);
};

DeleteMenu.prototype.draw = function() {
    var position = this.get('position');
    var projection = this.getProjection();

    if (!position || !projection) {
        return;
    }

    var point = projection.fromLatLngToDivPixel(position);
    this.div_delete.style.top = point.y + 'px';
    this.div_delete.style.left = point.x + 'px';
    this.div_clear.style.top = point.y+20 + 'px';
    this.div_clear.style.left = point.x + 'px';
};

/**
 * Opens the menu at a vertex of a given path.
 */
DeleteMenu.prototype.open = function(map, path, vertex) {
    this.set('position', path.getAt(vertex));
    this.set('path', path);
    this.set('vertex', vertex);
    this.setMap(map);
    this.draw();
};

/**
 * Deletes the vertex from the path.
 */
DeleteMenu.prototype.removeVertex = function() {
    var path = this.get('path');
    var vertex = this.get('vertex');

    if (!path || vertex == undefined) {
        this.close();
        return;
    }

    path.removeAt(vertex);
    this.close();
};

/**
 * Deletes the vertex from the path.
 */
DeleteMenu.prototype.clearVertices = function() {
    var path = this.get('path');

    if (!path) {
        this.close();
        return;
    }

    path.clear();
    this.close();
};