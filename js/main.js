import SpaService from "./spa-service.js";
import shoplist from "./shoplist.js";

let _spaService = new SpaService("login");
let _shoplist = new shoplist();

window.pageChange = function () {
    _spaService.pageChange();
}

window.selectAll = function () {
    _shoplist.selectAll();
}



