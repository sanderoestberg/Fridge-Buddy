"use strict";

import SpaService from "./spa-service.js";

let _spaService = new SpaService("login");

// ========== GLOBAL VARIABLES ========== //
const _userRef = _db.collection("users")
let _currentUser;


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
  _currentUser = user;
  hideTabbar(false);
  //init();
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