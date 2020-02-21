import SpaService from "./spa-service.js";

let _spaService = new SpaService("home");

window.pageChange = function () {
    _spaService.pageChange();
}