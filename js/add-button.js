
//======== BUTTONS LAVET AF SANDER ========== //


export default class AddBtn {
// Hele den her class bliver brugt til forskellige knapper for ændre noget fra display 'none' til display block/flex


// Åbner og lukker add-menuen ud fra vores add knap.
// Starter med at lave to variabler, en til knappen og en til menuen.
// Udover at show/hide add-menuen tilføjer vi også en to css classes, begge er transitions som giver menuen en
// animation når den bliver åbnet, så det ligner knappen lukker op for menuen, og knappen rotere fra et + til et x.

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

  // Delete knappen fungere på samme måde som de andre, men her skal vi nok have have ramt en anden property eller class
  // da hvis man tilføjer flere elementer med samme title, åbner og lukke de hinanden. 
  appendDeleteBtn(madtitle) {
    let menu = document.querySelector(`#madvarer-container > .${madtitle}`)
    if (menu.style.display === "none") {
        menu.style.display = "flex";
        
      } else {
        menu.style.display = "none";
       
      }
  }


}
