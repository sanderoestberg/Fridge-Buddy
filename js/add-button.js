
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
  
  // Vi har tilføjet en onclick function på ${mad.title} vha. javascript. Når den klikses og den ikke er vist skal den vises. og hvis den er vist skal den ikke vises (if else)  */
  appendDatoButton(madtitle) {
    let menu = document.querySelector(`#add-menu-forslag > .${madtitle}`)
    if (menu.style.display === "none") {
        menu.style.display = "flex";
        
      } else {
        menu.style.display = "none";
       
      }
  }

  appendDeleteBtn(madtitle) {
    let menu = document.querySelector(`#madvarer-container > .${madtitle}`)
    if (menu.style.display === "none") {
        menu.style.display = "flex";
        
      } else {
        menu.style.display = "none";
       
      }
  }


}
