"use strict";


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

// fetch all movies from WP
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
        showLoader(false);
      }, 200);
    });
}

getRecipes();

// append movies to the DOM
function appendRecipes(recipes) {
  let htmlTemplate = "";

  for (let recipe of recipes) {
    htmlTemplate += `
      <article class="${recipe.slug} children" onclick="myFunction('${recipe.slug}')">
        <img src="${recipe.acf.img}">
        <h2>${recipe.title.rendered}</h2>
        <h3>~ ${recipe.acf.time} minutter ~</h3>
        <p>${recipe.acf.description}</p> <br>
        <div class="moreInfo" style="display: none;">
        <h4> Ingridienser </h4> <br>
        <ul>${recipe.acf.ingredients}</ul> <br>
          <h4> Step-By-Step </h4> <br>
          <ul>${recipe.acf.stepbystep}</ul> <br>
        </div>
      </article>
    `;
  }


  document.querySelector('#recipe-container').innerHTML = htmlTemplate;


}

function myFunction(recipeslug) {
  console.log(recipeslug);
  let moreinfo = document.querySelector(`.${recipeslug} .moreInfo`)
  console.log(moreinfo);
  if (moreinfo.style.display === "none") {
    moreinfo.style.display = "block";
  } else {
    moreinfo.style.display = "none";
  }

}

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

  }
  console.log(filteredRecipes);
  appendRecipes(filteredRecipes);

  if (searchQuery.length === 0) {
    appendRecipes(recipes)
  }
}
