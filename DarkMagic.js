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
    
    old_value = search_params.get(param);
    
    if (old_value != value) {
        console.log('SET', param, value)
        
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