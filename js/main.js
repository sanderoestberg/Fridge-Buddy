//======== FÆLLES ========== //

import SpaService from "./spa-service.js";
import Shoplist from "./shoplist.js";
import AddBtn from "./add-button.js";


let _spaService = new SpaService("login");
let _shoplist = new Shoplist();
let _addButton = new AddBtn();

// Gør det muligt for HTML DOM'en at læse funktionen pageChange
window.pageChange = function () {
    _spaService.pageChange();
}

// Gør det muligt for HTML DOM'en at læse funktionen selectAll
window.selectAll = function () {_shoplist.selectAll();
}

// Gør det muligt for HTML DOM'en at læse funktionen addButton
window.addButton = function () {
    _addButton.addButton();

}
window.appendDatoButton = function (madtitle) {
    _addButton.appendDatoButton(madtitle);
}
window.appendDeleteBtn = function (madtitle) {
    _addButton.appendDeleteBtn(madtitle);
}


