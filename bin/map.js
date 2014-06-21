js2map = {};
js2map.markers = {};
js2map.markedIcon;
js2map.bounds = new google.maps.LatLngBounds();
js2map.icons = {g : ["mappins/green-sm.png"], r : ["mappins/red-sm.png"], o : ["mappins/orange-sm.png"]};
var smlg = {sm : ['lg'], lg : ['sm'] };
js2map.trackLine;

js2map.load = function(_d, callback) {
  var marker;
  var track = [];
  var infowindow = new google.maps.InfoWindow();
//  var data = (xml2json.parser((dhtmlxAjax.getSync(_d.url)).xmlDoc.responseText)).locs.loc;
  var x2js = new X2JS();
  var data = (x2js.xml_str2json((dhtmlxAjax.getSync(_d.url)).xmlDoc.responseText)).locs.loc;
  var i = data.length;
  while (i--) {
    var point = new google.maps.LatLng(data[i].lat, data[i].lon);
    this.bounds.extend(point);
    if (data[i].type == 'pin') {
      var mark = new google.maps.Marker( { position: point, map: window[_d.id], icon: this.icons[data[i].icon] + '' } );
      this.markers[((data[i].id !== undefined)?[i]:data[i].id)] = mark;
      if (data[i].track !== undefined) {
        google.maps.event.addListener(mark, 'click', 
          ( function(_url) { return function() { this.load({id: _d.id, url:_url, type:'track'}); } })
          ( data[i].track )
        );
      }
      if (data[i].caption !== undefined) {
        google.maps.event.addListener(mark, 'click', ( 
          function(marker, i) { return function() { 
            infowindow.setContent(data[i].caption.replace(/\\n/g,'<br>')); infowindow.open(map, this); } } ) (marker,i));
      }
    } else if (data[i].type == 'track') {
      track.push(point);
    } else
      {alert('invalid map type: '+_d.url);console.dir(data[i]);return;}
  }
  window[_d.id].fitBounds(this.bounds);
//  if (data[i].type == 'track') {
  if (track.length != 0) {
    this.trackLine = new google.maps.Polyline({
      path: track,
      strokeColor: "#FF0000",
      strokeOpacity: 1.0,
      strokeWeight: 2
    });
    this.trackLine.setMap(window[_d.id]);
  }
  if (_d.zoom !== undefined && _d.zoom != 0) {
    var listener = google.maps.event.addListener(map, "idle", function() {
      map.setZoom(window[_d.id].getZoom()+_d.zoom);
    google.maps.event.removeListener(listener);
    });
  }
  if (callback !== undefined)
    var listener = google.maps.event.addListener(map, "idle", function() {
      callback();
    });
  return data.length;
}

js2map.popIcon = function(_m,_id) {
  if (typeof js2map.markers[_id] == 'undefined') return;
  var ico = js2map.markers[_id].icon;
  var pos = ico.indexOf('.');
  var siz = ico.substring(pos - 2, pos);
  if (markedIcon != '') {
    var icosl = markers[markedIcon].icon;
    var possl = icosl.indexOf('.');
    var sizsl = icosl.substring(possl - 2, possl);
    js2map.markers[js2map.markedIcon].setIcon(icosl.replace('-'+sizsl+'.','-'+smlg[sizsl]+'.'));
  }
  js2map.markers[_id].setIcon(ico.replace('-'+siz+'.','-'+smlg[siz]+'.'));
  window[_m].setCenter(js2map.markers[_id].position);
  js2map.markedIcon = _id;
}


js2map.clear = function() {
  for (var i in this.markers)
    this.markers[i].setMap(null);
  if (this.trackLine !== undefined) 
  this.trackLine.setMap(null);
  this.markers = [];
  this.bounds = new google.maps.LatLngBounds();
  this.trackLine = undefined;
}