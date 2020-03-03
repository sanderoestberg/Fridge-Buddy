import SpaService from "./spa-service.js";
import shoplist from "./shoplist.js";
import addBtn from "./add-button.js";


let _spaService = new SpaService("login");
let _shoplist = new shoplist();
let _addButton = new addBtn();


window.pageChange = function () {
    _spaService.pageChange();
}

window.selectAll = function () {
    _shoplist.selectAll();
}


window.addButton = function () {
    _addButton.addButton();

}
window.appendDatoButton = function (madtitle) {
    _addButton.appendDatoButton(madtitle);
}
window.appendDeleteBtn = function (madtitle) {
    _addButton.appendDeleteBtn(madtitle);
}


