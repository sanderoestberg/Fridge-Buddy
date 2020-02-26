import SpaService from "./spa-service.js";

let _spaService = new SpaService("login");

window.pageChange = function () {
    _spaService.pageChange();
}

window.selectAll = function () {
    selectAll();
}

function selectAll(){
    var items=document.getElementsByName('madvarer');
    for(var i=0; i<items.length; i++){
        if(items[i].type=='checkbox')
            items[i].checked=true;
    }
}	