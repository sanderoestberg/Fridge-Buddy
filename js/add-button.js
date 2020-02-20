// Åbner og lukker add-menuen ud fra vores add knap.

function addButton(show) {
    let btn = document.querySelector('#add-button p');
    let menu = document.querySelector('.add-button-menu')
    if (menu.style.display === "none") {
        menu.style.display = "block";
        btn.classList.add("rotate-trans");
      } else {
        menu.style.display = "none";
        btn.classList.remove("rotate-trans");
      }
  }


  
