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
Image.prototype.load = function(url, onload = function(){}, onprogress = function(){}, onerror = function(){}, max_size = null){
    var thisImg = this;
    if (url in image_cache){
        thisImg.src = window.URL.createObjectURL(image_cache[url]);
        onload();
    } else {
        var xmlHTTP = new XMLHttpRequest();
        xmlHTTP.open('GET', url,true);
        xmlHTTP.responseType = 'arraybuffer';
        
        //xmlHTTP.setRequestHeader("Content-Type", "application/json");
        xmlHTTP.setRequestHeader("X-ApiKey", "CADA8974-D3E2-4FE0-8A78-DC20CC798FBC");
        xmlHTTP.setRequestHeader("X-Authorization", "3AA12351-A89C-4450-8C27-2C1FE8B23384");
        //xmlHTTP.setRequestHeader("X-ClientType", "Android");
        //xmlHTTP.setRequestHeader("X-ClientVersion", "1.5.3");
        //xmlHTTP.setRequestHeader("X-Auth-Token", TOKEN);
        
        if (max_size != null) xmlHTTP.setRequestHeader("MAX_SIZE", max_size);
        
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


//------------------------
// CODING PATTERNS
//------------------------

//--------- Template's functions pattern -------------
//var func_name = 'f_' + makeid(8);
//window[func_name] = function() {*your function*};
//template = `<button onclick="${func_name}()">`;
//GE('*html element id*').innerHTML = template;
