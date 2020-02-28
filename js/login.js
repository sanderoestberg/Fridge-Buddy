"use strict";

import SpaService from "./spa-service.js";

let _spaService = new SpaService("login");

// ========== GLOBAL VARIABLES ========== //
const _userRef = _db.collection("users")
let _currentUser;
const _madRef = _db.collection("madvarer");
let _madvarer;
let ExpireDate;
// ========== FIREBASE AUTH ========== //
// Listen on authentication state change
firebase.auth().onAuthStateChanged(function(user) {
  if (user) { // if user exists and is authenticated
    userAuthenticated(user);
  } else { // if user is not logged in
    userNotAuthenticated();
  }
});

function userAuthenticated(user) {
  //appendUserData(user);
  _currentUser = user;
  hideTabbar(false);
  init();
  _spaService.showPage("fridge");
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

// Show/Hide tab- og topbaren. Skal gemmes på login siden, og vises på alle andre sider. Ved hjælp af at tilføje og fjerne classen "hide"
function hideTabbar(hide) {
  let tabbar = document.querySelector('#tabbar');
  let topbar = document.querySelector('.topbar')
  if (hide) {
    tabbar.classList.add("hide");
    topbar.classList.add("hide");
  } else {
    tabbar.classList.remove("hide");
    topbar.classList.remove("hide");
  }
}

// Gør det muligt for HTML DOM'en at læse funktionen logout()
window.logout = function() {
  logout();
}


// Logout-funktion og reset på #name under profil siden med en tom string "".
function logout() {
  firebase.auth().signOut();
  // reset input fields

  document.querySelector('#name').value = "";
}

//User data der skal vises på profil siden:
function appendUserData() {
  document.querySelector('#name').value = _currentUser.displayName;
  document.querySelector('#mail').value = _currentUser.email;
}

/*
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
*/

// initialize food references - all food and user's favourite food
function init() {
  // init user data and favourite food
  _userRef.doc(_currentUser.uid).onSnapshot({
    includeMetadataChanges: true
  }, function(userData) {
    if (!userData.metadata.hasPendingWrites && userData.data()) {
      _currentUser = {
        ...firebase.auth().currentUser,
        ...userData.data()
      }; //concating two objects: authUser object and userData objec from the db
      appendUserData();
      appendFridge(_currentUser.Fridge);
      if (_madvarer) {
        appendMadvarer(_madvarer); // refresh movies when user data changes
      }
      //showLoader(false);
    }
  });

  // init alt mad
  _madRef.onSnapshot(function(snapshotData) {
    _madvarer = [];
    snapshotData.forEach(function(doc) {
      let mad = doc.data();
      mad.id = doc.id;
      _madvarer.push(mad);
    });
    appendMadvarer(_madvarer);
  });
}


// Mad forslag under add-menu'en appended, ved hjælp af et for-loop kan vi iterere over al mad i vores databse "madvarer" og herefter ved hjælp af backtick eller template string `` få dem vist.
function appendMadvarer(madvarer) {
  let htmlTemplate = "";
  for (let mad of madvarer) {
    htmlTemplate += `
      <article class="madvarer">
      <div class="mad highlight" onclick="appendDatoButton('${mad.title}')">
      <h4>${mad.title}</h4>
      <p>Vejledende<br>${mad.holdbarhed}</p>
      <img src="${mad.img}">
    </div>
    </article>
    <article class="${mad.title} add-dato" style="display:none;" >
      <p>Udløbsdato</p><input onchange="setExpireDate(this.value);" type="date">
      ${generateFavFridgeButton(mad.id)}
      </article>
    `;
  }
  document.querySelector('#add-menu-forslag').innerHTML = htmlTemplate;
}

window.setExpireDate = function (dato){
 ExpireDate = dato
}

// Tilføj-knappen under add-menuen bliver lavet her og srkevet ind i 'appendMadvarer' backtick-string. onclick der kører funktionen "addToFridge" og hvis Fridge eller undeholder det mad ID skal den ændre style og sige "tilføjet"

function generateFavFridgeButton(madId) {
  let btnTemplate = `
    <button onclick="addToFridge('${madId}')">Tilføj</button>`;
  if (_currentUser.Fridge && _currentUser.Fridge.includes(madId)) {
    btnTemplate = `
      <button onclick="addedToFridge('${madId}')" class="rm">Tilføjet</button>`;
  }
  return btnTemplate;
}

window.addToFridge = function(madId) {
  addToFridge(madId);
}


function addToFridge(madId) {
  //showLoader(true);

  // Array med madID til Firestore Database
  _userRef.doc(_currentUser.uid).set({
    Fridge: firebase.firestore.FieldValue.arrayUnion({madId,ExpireDate})
  }, {
    merge: true
  });
}


window.addedToFridge = function (madId, ExpireDate) {
  console.log(madId, ExpireDate)
  addedToFridge(madId, ExpireDate);
  
}

function addedToFridge(madId, ExpireDate) {
  //showLoader(true);
  console.log(madId, ExpireDate)
  _userRef.doc(_currentUser.uid).update({
    Fridge: firebase.firestore.FieldValue.arrayRemove({madId, ExpireDate})
  });
}

// onclick funktion på save-knappen under profil siden.
window.updateUser = function() {
  updateUser();
}

function updateUser() {
  let user = firebase.auth().currentUser;

  // For at opdatere navnet under Firebase Auth properties.
  user.updateProfile({
    displayName: document.querySelector('#name').value
  });

  // Fot at opdatere og tilføje brugerens navn og email i Databasen "users"
  _userRef.doc(_currentUser.uid).set({
    displayName: document.querySelector('#name').value,
    email: document.querySelector('#mail').value

  }, {
    merge: true
  });
}

async function appendFridge(FridgeIds = []) {
  let htmlTemplate = "";
  if (FridgeIds.length === 0) {
    htmlTemplate = "<br><br><br><br><p>Tilføj ting til dit køleskab</p> <img src='images/favicon.png'>";
  } else {
    for (let mad of FridgeIds) {
      await _madRef.doc(mad.madId).get().then(function (doc) {
        let madData = doc.data();
        madData.id = doc.id;
        htmlTemplate += `
        <article class="madvarer">
          <div id="${madData.id}" class="madAppended ${foodStatus(mad.ExpireDate)}" onclick="appendDeleteBtn('${madData.title}')">
            <h4>${madData.title}</h4>
            <img src="${madData.img}">
          </div>
        </article>
        <article class="${madData.title} add-dato deletebtn" style="display:none;">
        ${generateDeleteButton(mad)}
      </article>
      `;
      });

    }
  }
  document.querySelector('#madvarer-container').innerHTML = htmlTemplate;
  //foodStatus(madId);
}


function generateDeleteButton(mad) {
  let btnTemplate = "";
  if (_currentUser.Fridge && _currentUser.Fridge.includes(mad)) {
    btnTemplate = `
    <img src="images/skraldespand.svg" onclick="addedToFridge('${mad.madId}, ${mad.ExpireDate}')" alt="slet-knap">`;
  }
  return btnTemplate;
}


function foodStatus(value, madId) {
  console.log(madId)
  console.log(value)
  // UDLØBSDATO
  var today = new Date();
  today.setMilliseconds(0)
  today.setSeconds(0)
  today.setHours(0)
  today.setMinutes(0)
  var dato = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
  console.log(dato)
  var expireDate = value;
  console.log(expireDate)
  var expire = new Date(expireDate)
  expire.setMilliseconds(0)
  expire.setSeconds(0)
  expire.setHours(0)
  expire.setMinutes(0)

  var res = expire.getTime() - today.getTime();
  // One day Time in ms (milliseconds)
  var one_day = 1000 * 60 * 60 * 24;
  let udløbsdato = res / one_day
  console.log(udløbsdato)

  //let madStatus = document.querySelector(`#${madId}`);

   if (udløbsdato<=0){
    console.log("Udløbet")
    return "udløbet";
   }
   else if (udløbsdato<3) {
    console.log("Udløber snart")
    return "udløber";
   }
   else {
    console.log("Frisk")
    return "frisk";
   }

  }
