
export default class addBtn {

// Åbner og lukker add-menuen ud fra vores add knap.

addButton(show) {
    let btn = document.querySelector('#add-button p');
    let menu = document.querySelector('.add-button-menu')
    if (menu.style.display === "none") {
        menu.classList.add("add-menu-animation");
        menu.style.display = "block";
        btn.classList.add("rotate-trans");
      } else {
        menu.classList.remove("add-menu-animation");
        menu.style.display = "none";
        btn.classList.remove("rotate-trans");
        
      }
  }
  
  appendDatoButton(madtitle) {
    let menu = document.querySelector(`.${madtitle}`)
    if (menu.style.display === "none") {
        menu.style.display = "flex";
        
      } else {
        menu.style.display = "none";
       
      }
  }

  
}
