//A set of methods, that might be extremely useful, but should be used with attention and care.




//Прогрессор
class Progresser{
    constructor(func, cfunc = function(){}) {
        this.is_complete = false;
        this.func = func;
        this.cfunc = cfunc;
        this.timeout = null;
        this.time = 0;
        this.time_delta = 500;
    }
    
    run(){
        this.is_complete = false;
        this.dofunc();
    }    
    
    dofunc(){
        if (!this.is_complete){
            this.time += this.time_delta / 1000;
            this.func();
            
            var self = this;
            this.timeout = setTimeout(function(){
                self.dofunc();
            }, this.time_delta);
        }
    }
    
    complete(){
        this.is_complete = true;
        this.cfunc();
        this.time = 0;
    }
    
    abort(){
        this.is_complete = true;
        this.time = 0;
    }
}


//Добавление параметра к url
function SetSearchParam(param, value) {
    var url = new URL(window.location.href);
    var query_string = url.search;
    var search_params = new URLSearchParams(query_string); 
    
    var old_value = search_params.get(param);
    
    if (old_value != value) {
        if (value != null)
            search_params.set(param, value);
        else
            search_params.delete(param)
    
        url.search = search_params.toString();
        window.history.pushState("", document.title, url);
    }
}

//Взятие параметра из url
function GetSearchParam(param) {
    var url = new URL(window.location.href);
    var query_string = url.search;
    var search_params = new URLSearchParams(query_string); 
    
    return search_params.get(param);
}


//Добавление кода к методу. Вызывать только один раз за сессию!
function ExpandFunction(func, before = function(){}, after = function(){}) {
    return (function() {
        let cached_function = func;
        return function() {
            before();
            let result = cached_function.apply(this, arguments);
            after();

            return result;
        };
    })();
}

//Получение элемента страницы по id
function GE(el) {
  return document.getElementById(el);
}

//Получение параметра которого может не быть
function get(x, def_value){
    return (typeof x === 'undefined') ? def_value : x;
}


//обрезка числа до значений
Number.prototype.clamp = function(min, max) {
	return Math.min(Math.max(this, min), max);
};

//Картинка с прогрессом загрузки
var image_cache = {};
Image.prototype.load = function(url, onload = function(){}, onprogress = function(){}, onerror = function(){}, params = {}){
    var headers = (typeof params.headers != 'undefined') ? params.headers : {};
	
    var thisImg = this;
    if (url in image_cache){
        thisImg.src = window.URL.createObjectURL(image_cache[url]);
        onload();
    } else {
        var xmlHTTP = new XMLHttpRequest();
        xmlHTTP.open('GET', url,true);
        xmlHTTP.responseType = 'arraybuffer';
	    
        for (var key in headers) xmlHTTP.setRequestHeader(key, headers[key]);
        
        xmlHTTP.onreadystatechange = function (oEvent) {  
            if (xmlHTTP.readyState === 4) {  
                if (xmlHTTP.status === 200) {  
                   //console.log(xmlHTTP.statusText)  
                } else {  
                   console.log("Error", xmlHTTP.statusText);  
                   onerror();
                }  
            }  
        }; 
        
        xmlHTTP.onload = function(e) {
            var blob = new Blob([this.response]);
            thisImg.src = window.URL.createObjectURL(blob);
            image_cache[url] = blob;
            onload();
        };
        xmlHTTP.onprogress = function(e) {
            thisImg.completedPercentage = parseInt((e.loaded / e.total) * 100);
            onprogress();
        };
        xmlHTTP.onloadstart = function() {
            thisImg.completedPercentage = 0;
        };
        xmlHTTP.onerror = function() {
            console.error('ONERROR', url);
            onerror();
        };
        
        xmlHTTP.send();
        
        thisImg.xmlHTTP = xmlHTTP;
    }
};

Image.prototype.abort = function(func){
    var thisImg = this;
    if (thisImg.xmlHTTP!=null) thisImg.xmlHTTP.abort()
    thisImg.completedPercentage = 0;
};

/*
Image.prototype.onProgress = function(func){
    var thisImg = this;
    if (thisImg.completedPercentage < 100){
        func();
        thisImg.progressTimeout = setTimeout(function(){thisImg.onProgress(func);}, 200);
    }
};*/

Image.prototype.completedPercentage = 0;
Image.prototype.progressTimeout = null;


//normal gaussian random
function randn_bm() {
    var u = 0, v = 0;
    while (u === 0) u = Math.random(); //Converting [0,1) to (0,1)
    while (v === 0) v = Math.random();
    return Math.sqrt( -2.0 * Math.log( u ) ) * Math.cos( 2.0 * Math.PI * v );
}

//Random string generator
function makeid(length) {
  var text = "";
  var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  for (var i = 0; i < length; i++)
    text += possible.charAt(Math.floor(Math.random() * possible.length));

  return text;
}

//guid generator
function uuidv4() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

/// HTML CONTAINER ///
function CreateContainer(id, css_data, html_data){
  var head = document.head || document.getElementsByTagName('head')[0];
  var style = document.createElement('style');
  style.setAttribute("id", id + "_css");
  head.appendChild(style);
	
  style.type = 'text/css';
  if (style.styleSheet){
    // This is required for IE8 and below.
    style.styleSheet.cssText = css_data;
  } else {
    style.appendChild(document.createTextNode(css_data));
  }
		
  var container = document.createElement('div');
  container.setAttribute("id", id + "_html");
  container.innerHTML = html_data;
	
  return container;
}

function RemoveContainer(id){
  if (GE(id + '_css')) GE(id + '_css').remove();
  if (GE(id + '_html')) GE(id + '_html').remove();
}

function CheckContainer(id){
  return GE(id + '_css') || GE(id + '_html');
}

//------------------------
// CODING PATTERNS
//------------------------

//--------- JS Template's functions pattern -------------
//var func_name = 'f_' + makeid(8);
//window[func_name] = function() {*your function*};
//template = `<button onclick="${func_name}()">`;
//GE('*html element id*').innerHTML = template;

//--------- JS app page template -----------
//<!DOCTYPE html>
//<html>
//<head>
//    <meta charset="utf-8" />
//    <script src="https://cdn.jsdelivr.net/gh/volotat/DarkMagic.js@master/DarkMagic.js?53"></script>
//    <style type="text/css" id="dynamic_css"></style>
//</head>
//<body id='body'></body>
//<script type="text/javascript">
//	document.write('<scr'+'ipt defer type="text/javascript" src="script.js?'+Math.random()+'"></scr'+'ipt>');
//</script>
//</html>

//use GE('body').innerHTML to add elements to the page
//use GE('dynamic_css').innerHTML to add style to the elements
//use functions pattern from above to make new elements active 
