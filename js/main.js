import SpaService from "./spa-service.js";

let _spaService = new SpaService("login");

window.pageChange = function () {
    _spaService.pageChange();
}
