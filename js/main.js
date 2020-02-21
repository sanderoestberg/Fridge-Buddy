import SpaService from "./spa-service.js";

let _spaService = new SpaService("fridge");

window.pageChange = function () {
    _spaService.pageChange();
}