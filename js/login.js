"use strict";

import SpaService from "./spa-service.js";

let _spaService = new SpaService("login");

// ========== GLOBAL VARIABLES ========== //
const _userRef = _db.collection("users")
let _currentUser;
const _madRef = _db.collection("madvarer");
let _madvarer;

// ========== FIREBASE AUTH ========== //
// Listen on authentication state change
firebase.auth().onAuthStateChanged(function (user) {
  if (user) { // if user exists and is authenticated
    userAuthenticated(user);
  } else { // if user is not logged in
    userNotAuthenticated();
  }
});

function userAuthenticated(user) {
  appendUserData(user);
  _currentUser = user;
  hideTabbar(false);
  init();
  //showLoader(false);
}

function userNotAuthenticated() {
  _currentUser = null; // reset _currentUser
  hideTabbar(true);
  _spaService.showPage("login");

  // Firebase UI configuration
  const uiConfig = {
    credentialHelper: firebaseui.auth.CredentialHelper.NONE,
    signInOptions: [
      firebase.auth.EmailAuthProvider.PROVIDER_ID
    ],
    signInSuccessUrl: '#fridge'
  };
  // Init Firebase UI Authentication
  const ui = new firebaseui.auth.AuthUI(firebase.auth());
  ui.start('#firebaseui-auth-container', uiConfig);
  //showLoader(false);
}

// show and hide tabbar
function hideTabbar(hide) {
  let tabbar = document.querySelector('#tabbar');
  if (hide) {
    tabbar.classList.add("hide");
  } else {
    tabbar.classList.remove("hide");
  }
}

window.logout = function () {
    logout();
}

// sign out user
function logout() {
  firebase.auth().signOut();
  // reset input fields
  /*
  document.querySelector('#name').value = "";
  document.querySelector('#mail').value = "";
  document.querySelector('#birthdate').value = "";
  document.querySelector('#hairColor').value = "";
  document.querySelector('#imagePreview').src = "";*/
}

function appendUserData(user) {
  document.querySelector('#profile').innerHTML += `
  <h2 class="page_overskrift"> Profil oplysninger </h2>
  <section class="profil-oplysninger">
  <article id="profil_center">
  <img src="images/profile-icon.svg">
  </article>
  <article>
    <h5>navn</h5>
    <h3>${user.displayName}</h3>
    <div class="line"></div>
    </article>
    <article>
    <h5>email</h5>
    <p>${user.email}</p>
    <div class="line"></div>
    </article>
  </section>`;
}

// initialize movie references - all movies and user's favourite movies
function init() {
  // init user data and favourite movies
  _userRef.doc(_currentUser.uid).onSnapshot({
    includeMetadataChanges: true
  }, function (userData) {
    if (!userData.metadata.hasPendingWrites && userData.data()) {
      _currentUser = {
        ...firebase.auth().currentUser,
        ...userData.data()
      }; //concating two objects: authUser object and userData objec from the db
      appendUserData();
      appendFavMovies(_currentUser.favMad);
      if (_madvarer) {
        appendMadvarer(_madvarer); // refresh movies when user data changes
      }
      //showLoader(false);
    }
  });

  // init all movies
  _madRef.onSnapshot(function (snapshotData) {
    _madvarer = [];
    snapshotData.forEach(function (doc) {
      let mad = doc.data();
      mad.id = doc.id;
      _madvarer.push(mad);
    });
    appendMadvarer(_madvarer);
  });
}

function appendMadvarer(madvarer) {
  let htmlTemplate = "";
  for (let mad of madvarer) {
    htmlTemplate += `
      <article class="madvarer">
      <div class="mad highlight" onclick="appendDatoButton()">
      <h4>${mad.title}</h4>
      <p>Vejledende Holdbarhed<br>${mad.holdbarhed}</p>
      <img src="${mad.img}">
    </div>
    </article>
    <article class="add-dato" style="display:none;" >
      <p>Udløbsdato</p><input type="date">
      <button type="button">Tilføj</button>
      </article>
    `;
  }
  document.querySelector('#add-menu-forslag').innerHTML = htmlTemplate;
} /* <input type="number" max="2"><span>/</span>
<input type="number" max="2"><span>/</span>
<input type="number" max="4"> */