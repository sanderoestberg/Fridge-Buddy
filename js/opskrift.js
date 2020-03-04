"use strict";

//======== OPSKRIFT SIDEN LAVET AF OSKAR ========== //


// sidst i vores html har vi placeret en spinner der indikerer om indholdet på
// siden er hentet eller stadig er ved at downloade.

// Vi opretter variablen "loader" inde i showLoader og sætter
// den i forbindelse med elementet/div "#loader" fra vores HTML.
// showLoader har fået (show) da den skal være til stede fra start.
// efter vi har fetchet vores data fra WP bliver showLoader sat til false og den vil derfor få tildelt classen hide og forsvinde.

function showLoader(show) {
  let loader = document.querySelector('#loader');
  if (show) {
    loader.classList.remove("hide");
  } else {
    loader.classList.add("hide");
  }
}

// =========== Recipe SPA functionality =========== //

let recipes = [];
// Her opretter vi et tomt array med navnet "recipes".
// Så initiere vi functionen "get Recipes" hvor vi fetcher alt data om vores recipies som Json data fra vores opskriftdatabase på wordpress.
// json og javascript kan frit konverteres frem og tilbage.
// Når fetch er færdiggjort afslutter vores spinner.
function getRecipes() {
  fetch('http://oskarwiegaard.dk/wp/wp-json/wp/v2/posts?=_embed')
    .then(function(response) {
      return response.json();
    })
    .then(function(json) {
      console.log(json);
      appendRecipes(json);
      recipes = json;
      setTimeout(function() {
        //fjerner spinner efter load.
        showLoader(false);
      }, 200);
    });
}

getRecipes();

// Da vores json er fetchet kan vi nu append det til DOM.
// vi initiere herefter et for-loop hvor vi kører gennem den samme kodeblok igen og igen inditl alle opskrifterne er gennemgået.
// noget af dataen er gemt væk under "moreInfo" classen som bliver vist ved at trykke på objectet på siden.
function appendRecipes(recipes) {
  let htmlTemplate = "";

  for (let recipe of recipes) {
    htmlTemplate += `
      <article class="${recipe.slug} children" onclick="myFunction('${recipe.slug}')">
        <img src="${recipe.acf.img}">
        <h2>${recipe.title.rendered}</h2>
        <h3>~ ${recipe.acf.time} minutter ~</h3>
        <div class="moreInfo" style="display: none;">
        <p>${recipe.acf.description}</p> <br>
        <h4> Ingridienser </h4> <br>
        <ul>${recipe.acf.ingredients}</ul> <br>
          <h4> Step-By-Step </h4> <br>
          <ul>${recipe.acf.stepbystep}</ul> <br>
        </div>
      </article>
    `;
  }


//Opskrifterne bliver hermed appended til innerHTML i vores container "#recipe-container"

  document.querySelector('#recipe-container').innerHTML = htmlTemplate;


}
//ovenover har vi oprettet en onClick funktion recipeslug. Denne vil vi nu benytte til at vise og skjule data og styling.
// så når man trykker på en opskrift, folder den sig ud ved at vise mere information og opskriften går fra at fylde 46% til 90% width.
// Samme ændring bliver fjernet ved at trykke igen.
function myFunction(recipeslug) {
  console.log(recipeslug);
  // child og moreinfo ændrer størrelsen på et "child" i containeren og viser extra information. Den folder sig ud ved tryk
  let child = document.querySelector(`.${recipeslug}`)
  let moreinfo = document.querySelector(`.${recipeslug} .moreInfo`)
  console.log(moreinfo);
  if (moreinfo.style.display === "none") {
    moreinfo.style.display = "block";
    child.style.width = "90%";
  } else {
    moreinfo.style.display = "none";
    child.style.width = "46%";
  }

}
// her opretter vi så en søgefunktion til vores opskrifter.
// Vi søger efter en value for title eller category fra vores data på wordpress.
// ved at anvende || fortæller vi at den skal lede efter title eller category. Den skal søge efter begge.
// search functionality
function search(value) {
  let searchQuery = value.toLowerCase();
  let filteredRecipes = [];
  for (let recipe of recipes) {
    let title = recipe.title.rendered.toLowerCase();
    let category = recipe.acf.category.toLowerCase();
    if (title.includes(searchQuery) || category.includes(searchQuery)) {
      filteredRecipes.push(recipe);
    }


// efter de er filtreret efter søgning, bliver de filtreret objecter appended.
  }
  console.log(filteredRecipes);
  appendRecipes(filteredRecipes);
// hvis søgfeltet er tomt (=== 0) bliver alle opskrifter vist igen.
  if (searchQuery.length === 0) {
    appendRecipes(recipes)
  }
  else if (filteredRecipes.length === 0) {
    let htmlTemplate = ""
    htmlTemplate = `
      <p>Der er desværre ingen opskrifter. Prøv en anden.</p>
    `;
    document.querySelector('#recipe-container').innerHTML = htmlTemplate;

  }
}
