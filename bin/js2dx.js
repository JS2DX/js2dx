//
//  UNDER CONSTRUCTION
//  UNDER CONSTRUCTION
//
//  JS2DX BETA
//
//  js2dx.com
//  info@js2dx.com
//
//
//  see "js2dx.scripts" variable below to set up DHTMLX codebase paths
//
//  copyright 2014 JS2DX
//  Programmer: Sergei Sheinin sergei.sheinin@gmail.com
//
//  JS2DX is client-side GUI driver for Sprout (http://sproutpl.wordpress.com)
//
//  please donate
//

var js2dx = {}

js2dx.scripts = [
   {type: 'css', src: './codebase/dhtmlx.css'}
  ,{type: 'js',  src: './codebase/dhtmlx.js' }
  ,{type: 'js', src: 'js/map.js',    key: 'map'}
  ,{type: 'js', src: 'js/str2xml.js',key: 'map'}]

js2dx.struct = {}
js2dx.scriptStruct = {}

js2dx.attrib = {
  layout: [{V: {cmd: 'dhtmlXLayoutObject', params: ['parent','pattern']}}
          ,{W: {cmd: 'setSkin',            params: ['skin'], default: ['dhx_web']}}
          ,{C: {cmd: [{CA: {cmd: 'setText'   , params: ['caption']   }}
                     ,{CA: {cmd: 'setWidth'  , params: ['width']     }}
                     ,{CA: {cmd: 'setHeight' , params: ['height']    }}
                     ,{CB: {cmd: {true:'showHeader',false: 'hideHeader'}, params: ['header']}}
                     ,{CC: {cmd: 'fixSize' ,   params: ['fix']       }}]
               ,key: 'cells'}}]
 ,grid:  [{Z: {cmd: 'attachGrid', default: ['']}}
         ,{W: {cmd: 'setImagePath', params: ['imgPath'], default: ['./codebase/imgs/']}}
         ,{D: {cmd: [{cmd: 'setHeader'    , params: 'name'  , default: ''    }
                    ,{cmd: 'setColAlign'  , params: 'align' , default: 'left'}
                    ,{cmd: 'setColTypes'  , params: 'type'  , default: 'ro'  }
                    ,{cmd: 'setColSorting', params: 'sort'  , default: 'str' }
                    ,{cmd: 'attachHeader' , params: 'filter', default: ''    }]
              ,key: 'columns'}}
         ,{W: {cmd: 'init', default: ['']}}
         ,{U: {cmd: 'js2dx.load', params: ['url']}}]
 ,tree:  [{Z: {cmd: 'attachTree'  ,    default: ['']}}
         ,{W: {cmd: 'setImagePath',    params: ['imgPath'], default: ['./codebase/imgs/']}}
         ,{W: {cmd: 'setEscapingMode', params: ['escapingMode'],  default: ['none']}}
         ,{U: {cmd: 'js2dx.load', params: ['url']}}]
 ,form:  [{Z: {cmd: 'attachForm', params: ['fields']}}]
 ,map :  [{Z: {cmd: 'attachMap', default: ['']}}
         ,{U: {cmd: 'js2dx.load', params: ['url']}}]
 ,htm:  [{O: {cmd: 'attachObject', params: ['id']}}]
 ,dataview:  [{K: {cmd: 'attachDataView', params: ['type']}}]}
  

js2dx.load = function (_id, _url, _call) {
  function fin(){
    if (_call !== undefined) _call()
    window[l]["cells"](c)["progressOff"]()}
  var loader = {
    map: function(){
      js2map.clear()
      js2map.load(({id: _id, url: _url}), function() {fin()})},
    grid: function() {
      window[_id].clearAll()
      window[_id].load(_url, function() {fin()})},
    tree: function(_d) {
      window[_id].loadXML(_url, function() {fin()})},
    form: function(_d) {
      window[_id].clear();
      window[_id].load(_url, function() {fin()})},
    dataview: function(_d) {
      window[_id].clearAll();
      window[_id].load(_url, 'xml', function() {fin()})}}
  var l = js2dx.struct[_id].layout
  var c = js2dx.struct[_id].cell
  window[l]["cells"](c)["progressOn"]()
  loader[js2dx.struct[_id].type]()}

js2dx.init = function dx(data){
  js2dx.scan(data)
  var parent = document.body
  for (var i in data) {
    data[i].parent = parent
    dxelem(data[i],js2dx.attrib[i])}}
                                        
function construct(constructor, args) {
  function F() {return constructor.apply(this, args)}
  F.prototype = constructor.prototype
  return new F()}

function executeFunctionByName(functionName, context , args ) {
  var args = Array.prototype.slice.call(arguments).splice(2)
  var namespaces = functionName.split(".")
  var func = namespaces.pop()
  for(var i = 0; i < namespaces.length; i++) {context = context[namespaces[i]]}
  return context[func].apply(this, args)}

function parseParams(_a,_d) { 
  var ret = []
  if (_a.params)
    for (var i=0; i<_a.params.length; i++) ret[ret.length] = ((!_a.params[i] || !_d || !_d[_a.params[i]])?_a.default[i]:_d[_a.params[i]])
  else ret = _a.default
  return ret}

js2dx.c = function (_c,_d,_a) {
  var comp = {
    V: function() {
      window[_d.id] = construct(window[_a.cmd],[((js2dx.struct[_d.id].cell === undefined)?
        document.body:window[js2dx.struct[_d.id].layout]['cells'](js2dx.struct[_d.id].cell)),_d['pattern']])},
    W: function() {window[_d.id][_a.cmd].apply(window[_d.id],parseParams(_a,_d))},
    U: function() {
      if(_d.url !== undefined)
        executeFunctionByName(_a.cmd, window, _d.id, _d.url)},
    Z: function() {
      window[_d.id] = window[l]['cells'](c)[_a.cmd].apply(window[l]['cells'](c),parseParams(_a,_d))},
    K: function() {
      var o = {}
      o[_a.params[0]] = (parseParams(_a,_d))[0]
      window[_d.id] = window[l]['cells'](c)[_a.cmd].call(window[l]['cells'](c),o)},
    O: function() {
      window[l]['cells'](c)[_a.cmd].apply(window[l]['cells'](c),parseParams(_a,_d))},
    C: function() {
      var com = {
         CB: CB
        ,CA: CA
        ,CC: CC}
      function CA() {
        window[l]['cells'](cl)[_a.cmd[i][cm].cmd].apply(window[l]['cells'](cl),parseParams(_a.cmd[i][cm],_d[_a.key][j]))}
      function CB() {
        window[l]['cells'](cl)[_a.cmd[i][cm].cmd[_d[_a.key][j][_a.cmd[i][cm].params]]].call(window[l]['cells'](cl),'')}
      function CC() {
        window[l]['cells'](cl)[_a.cmd[i][cm].cmd].apply(window[l]['cells'](cl),(_d[_a.key][j][(Object.keys(_d[_a.key][j])[0])]))}
      var cl = 'a'
      l = _d.id
      for (var j in _d[_a.key]) {
        cl = String.fromCharCode((97+(j/1)))
        c = cl
        for (var i in _a.cmd) {
          var cm = Object.keys(_a.cmd[i])[0]
          if (_d[_a.key][j][_a.cmd[i][cm].params[0]] !== undefined)
            com[cm]()}
        var k = Object.keys(_d[_a.key][j]).length
        while(k--)
          if (Object.keys(js2dx.attrib).indexOf(Object.keys(_d[_a.key][j])[k]) != -1)
            dxelem(_d[_a.key][j][Object.keys(_d[_a.key][j])[k]],js2dx.attrib[Object.keys(_d[_a.key][j])[k]])}},
    D: function() {
      var str = []
      for (var i in _a.cmd) {
        for (var j in _d[_a.key])
          str[j] = ((_d[_a.key][j][_a.cmd[i].params] === undefined)?_a.cmd[i].default:_d[_a.key][j][_a.cmd[i].params])
          if ((str.join(',')).length >= _d[_a.key].length) window[_d.id][_a.cmd[i].cmd](str.join(','))}}}
  var l = js2dx.struct[_d.id].layout
  var c = js2dx.struct[_d.id].cell
  comp[_c]()}

function dxelem(_d,_a) {
  for (var i in _a)
    js2dx.c(Object.keys(_a[i])[0],_d,_a[i][Object.keys(_a[i])])
  for (var i in Object.keys(_d))
    if ((Object.keys(_d))[i].substring(0,2) == 'on')
     window[_d.id].attachEvent((((Object.keys(_d))[i])),_d[(Object.keys(_d))[i]])}

js2dx.ScriptLoader = {
  LoadedFiles: [],
  RelativeToAbsolute: function (a){
    var b = String(window.location).replace(/\/[^\/]+$/, "").replace(/\/$/, "")+"\/"+"codebase\/";
    a = String(a)
    a = a.replace(/url\(\'[.]![..]\//gi, "url('{PATH}");
    a = a.replace(/url\(\'([a-z])/gi, "url('{PATH}$1");
    a = a.replace(/url\(\'\{PATH\}([^)]+[)])/gi, "url('"+b+"$1");
    a = a.replace(/url\(\"[.]\//gi, 'url("{PATH}');
    a = a.replace(/url\(\"([a-z])/gi, 'url("{PATH}$1');
    a = a.replace(/url\(\"\{PATH\}([^)]+[)])/gi, 'url("'+b+'$1');
    return a},
  LoadFile: function (url, type) {
    var self = this
    var i = this.LoadedFiles.length;
    while (i--) { if (this.LoadedFiles[i] === url) return }
    var xhr = new XMLHttpRequest();
    xhr.onload = function () {
      if (xhr.readyState === 4)
        if (xhr.status === 200) {
          self.LoadedFiles[self.LoadedFiles.length] = url
          self.AddScript(xhr.responseText, type)
        } else
          if (console) console.error(xhr.statusText)}
    xhr.open("GET", url, false)
    xhr.send(null)},
  AddScript: function (code, type) {
    if (type == 'js') {
      var oNew = document.createElement("script")
      oNew.type = 'text/javascript'
      oNew.textContent = code}
    else {
      var oNew = document.createElement('style')
      oNew.rel = 'STYLESHEET'
      oNew.type = 'text/css'
      oNew.textContent = this.RelativeToAbsolute(code)}
    document.getElementsByTagName("head")[0].appendChild(oNew)}}

js2dx.includes = function(_d) {
  for (var i=0; i<js2dx.scripts.length; i++)
    if (!js2dx.scripts[i].key) js2dx.ScriptLoader.LoadFile(js2dx.scripts[i].src, js2dx.scripts[i].type)
    else {      
      if (!js2dx.scriptStruct[js2dx.scripts[i].key]) js2dx.scriptStruct[js2dx.scripts[i].key] = []
      js2dx.scriptStruct[js2dx.scripts[i].key].push(i)}}

js2dx.includes()

js2dx.scan = function(_d,_t,_l,_c) {
  if (!_l) _l = document.body
  for (var i in _d) {
    if (js2dx.scriptStruct[i] !== undefined)
      for (var j in js2dx.scriptStruct[i])
        if ((js2dx.scripts[js2dx.scriptStruct[i][j]].val === undefined) ||
            (js2dx.scripts[js2dx.scriptStruct[i][j]].val !== undefined && js2dx.scripts[js2dx.scriptStruct[i][j]].val == _d[i]))
          js2dx.ScriptLoader.LoadFile(js2dx.scripts[js2dx.scriptStruct[i][j]].src,js2dx.scripts[js2dx.scriptStruct[i][j]].type)
    if (typeof _d[i] == 'object') {
      if (i == 'cells') {
        for (var j in _d[i]) {
          _c = ((_c === undefined || _l != _d.id)?'a':String.fromCharCode((_c.charCodeAt()+1)));
          var k = Object.keys(_d[i][j]).length
          while(k--)
            if (Object.keys(js2dx.attrib).indexOf(Object.keys(_d[i][j])[k]) != -1)
              _t = Object.keys(_d[i][j])[k]
          _l = _d.id
          js2dx.scan(_d[i][j],_t,_l,_c)}
        break}
      else
        js2dx.scan(_d[i],_t,_l,_c)}
    else if (i == 'id')
      js2dx.struct[_d[i]] = {type: _t, layout: _l, cell: _c}}}

js2dx.attach = function(_l,_c,_d,_call) {
  var key = (Object.keys(_d))[0];
  for (var i in this.struct)
    if (this.struct[i].layout && this.struct[i].cell && this.struct[i].layout == _l && this.struct[i].cell == _c && i != _d[key].id)
      delete this.struct[i]
  this.struct[_d[key].id] = {type: key, layout: _l, cell: _c}
  dxelem(_d[key], this.attrib[key])
  if (_d[key].url)
    js2dx.load(_d[key].id,_d[key].url,_call)}