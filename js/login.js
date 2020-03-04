"use strict";
//======== LOGIN og APPENDMADVARER LAVET AF JOAHNNE OG SANDER ========== //
//======== INIT, ADDFRIDGE og DATO LAVET AF SANDER ========== //

// Importere classen SpaService fra modulet spa-service.js
import SpaService from "./spa-service.js";

//Definere SpaService i en nye variable _spaService så vi kan tilgå den i login.js dokumentet.
let _spaService = new SpaService("login");

// ========== DATABASE VARIABLER ========== //
const _userRef = _db.collection("users")
const _madRef = _db.collection("madvarer");
// ========== GLOBALE VARIABLER ========== //
let _currentUser;
let _madvarer;
let ExpireDate;


// ========== FIREBASE AUTH ========== //

// En del af Firebase Authentication som checker om brugeren er logget ind eller ej, med if og else statement
// Som kører en af de to funktioner:
firebase.auth().onAuthStateChanged(function(user) {
  if (user) { // if user exists and is authenticated
    userAuthenticated(user);
  } else { // if user is not logged in
    userNotAuthenticated();
  }
});

// Hvis brugeren er logget ind bliver de sendt via _spaService.showPage videre til forsiden 'Fridge'
// Tabbaren bliver vist og funktionen init, initialiserer meget indhold fra Databasen til siden.

function userAuthenticated(user) {
  //appendUserData(user);
  _currentUser = user;
  hideTabbar(false);
  init();
  _spaService.showPage("fridge");
  //showLoader(false);
}

// Denne function er til hvis brugeren ikke er logget ind, som derfor sender brugeren videre til siden "login"
// Her efter kommer Firebase Authentication login UI frem og giver brugeren mulighed for at sign-in eller sign-up.
// Når log-in er fuldført bliver man sendt videre til forsiden "#fridge"
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

// Show/Hide tab- og topbaren. Skal gemmes på login siden, og vises på alle andre sider. 
// Ved hjælp af at tilføje og fjerne classen "hide"  (true/false) (show/hide)

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

// Gør det muligt for HTML DOM'en at læse funktionen logout() pga type=module
window.logout = function() {
  logout();
}

//============ PROFIL SIDE ==========//
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

window.updateUser = function() {
  updateUser();
}

// Variable der definere user som firebase.auth().currentUser. Hvilket gør Authentication og Databasens user ID's matcher.
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



//======== INIT LAVET AF SANDER ========== //

// Her bliver database elementer, både fra madvarer, men også brugerens egne madvarer initialized
function init() {
  // init user data og mad i digitalt køleskab
  _userRef.doc(_currentUser.uid).onSnapshot({
    includeMetadataChanges: true
  }, function(userData) {
    if (!userData.metadata.hasPendingWrites && userData.data()) {
      _currentUser = {
        ...firebase.auth().currentUser,
        ...userData.data()
      }; //concating two objects: authUser object and userData objec from the db
      appendUserData();
      //appendFridge(_currentUser.Fridge);
      // Kører function til at append tilføjede mad i brugerens digitale køleskab.
      initFridge();

    }
  });

  // Function som skal viser mad-forslag ud fra databasen 'madvarer' til tilføj-menuen.
  // Intet at gøre med brugens madvarer, men vores mad-database.
  _madRef.onSnapshot(function(snapshotData) {
    // Tomt array til madvarer
    _madvarer = [];
    snapshotData.forEach(function(doc) {
      let mad = doc.data();
      mad.id = doc.id;
      _madvarer.push(mad);
    });
    appendMadvarer(_madvarer);
  });
}


//======== APPENDMADVARER LAVET AF JOHANNE OG SANDER ========== //


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
  // Maden bliver appended i containeren '#add-menu-forslag' i HTML DOM'en
  document.querySelector('#add-menu-forslag').innerHTML = htmlTemplate;
}
// Tilføj-knappen under add-menuen bliver lavet her og srkevet ind i 'appendMadvarer' backtick-string. 
// onclick der kører funktionen "addToFridge" og hvis Fridge eller undeholder det mad ID skal den ændre style og sige "tilføjet"
function generateFavFridgeButton(madId) {
  let btnTemplate = `
    <button onclick="addToFridge('${madId}')">Tilføj</button>`;
  if (_currentUser.Fridge && _currentUser.Fridge.includes(madId)) {
    btnTemplate = `
      <button onclick="addedToFridge('${madId}')" class="rm">Tilføjet</button>`;
  }
  return btnTemplate;
}


//======== INIT, ADDFRIDGE og DATO LAVET AF SANDER ========== //


// setExpireDate functionen bliver executed ovenfor ved onchange på kalender-inputet.
// Det vil sige den tager dato (this.value) med sig som et parameter i functionen

window.setExpireDate = function (dato){
  // Her bliver Global Variablen ExpireDate sat til at være lig med dato (value) fra parametret
  ExpireDate = dato
 }

 
window.addToFridge = function(madId) {
  addToFridge(madId);
}

function addToFridge(madId) {
  //showLoader(true);
  // Når man har valgt dato og klikker på knappen "tilføj" laver den en ny collection under userID
  // Hvor den tilføjer madId. Samt ExpireDate fra global variablen. 
  _userRef.doc(_currentUser.uid).collection('fridge').add({
    madId,
    ExpireDate
  });
}

window.removeFromFridge = function (id) {
  removeFromFridge(id);
}

// Function til at slette ting fra dit køleskab, hvad at fjerne det mad fra collectionen 'fridge'
// Functionen bliver tilføjet under initFridge og executed når brugeren klikker på skraldespanden
function removeFromFridge(id) {
  _userRef.doc(_currentUser.uid).collection('fridge').doc(id).delete();
}



//  initFridge functionen bliver kørt i init functionen længere oppe, som allerede bliver kørt,
//  når brugeren er logget ind (userAuthenticated).
function initFridge() {
  _userRef.doc(_currentUser.uid).collection('fridge').onSnapshot(function (fridgeData) {
    let htmlTemplate = "";

    // If-statement der viser teksten 'Tilføj ting til dit køleskab' hvis 'fridge' er tomt (fridgeData.docs.length === 0)
    if (fridgeData.docs.length === 0) {
      document.querySelector('#madvarer-container').innerHTML = "<br><br><br><br><p>Tilføj ting til dit køleskab</p> <img src='images/favicon.png'>";
    }
    // Her bliver lavet et forEach hvert document i fridge, det fungerer lidt ligesom et for-loop, hvor den iterer igennem alle elementerne.
    fridgeData.forEach(async function (doc) {
      // Variabler der definerer hvad den skal skal tilgå inde i Databasen.
      let fridgeDoc = doc.data();
      fridgeDoc.id = doc.id
      await _madRef.doc(fridgeDoc.madId).get().then(function (doc) {
        let madData = doc.data();
        madData.id = doc.id;
        // Backtick-string som bruges til at appende maden til brugerens køleskabside.
        // 
        htmlTemplate += `
          <article class="madvarer">
            <div id="${madData.id}" class="madAppended ${foodStatus(fridgeDoc.ExpireDate)}" onclick="appendDeleteBtn('${madData.title}')">
              <h4>${madData.title}</h4>
              <img src="${madData.img}">
            </div>
          </article>
          <article class="${madData.title} add-dato deletebtn" style="display:none;">
          <img src="images/skraldespand.svg" onclick="removeFromFridge('${fridgeDoc.id}')" alt="slet-knap">
        </article>
        `;
      });
      // Her bliver maden appended i containeren '#madvarer-container'
      document.querySelector('#madvarer-container').innerHTML = htmlTemplate;
    });
  });
}

// I fucntionen ovenfor i initFridge er functionen ${foodStatus(fridgeDoc.ExpireDate)} tilføjet under classes,
// det er fordi vi har gemt udløbsdatoen (ExpireDate) i Databasen under Fridge, sammen med madID'et.
// Så functionen foodStatus(value) bliver kørt med parametret 'ExpireDate' som brugeren valgte.

function foodStatus(value) {
  console.log(value)
  // UDLØBSDATO
  // Først laver vi en variable 'today' som et nyt Date()-objekt, herefter kan vi ved hjælp af javascript finde datoen lige nu med:
  // today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();. Moth er +1 fordi den tæller fra 0-11.
  let today = new Date();
  today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
  
// Herefter sætter vi millisekunder, sekunder, minutter og timer til 0, fordi vi kun er interesseret i datoen.
  today.setMilliseconds(0)
  today.setSeconds(0)
  today.setHours(0)
  today.setMinutes(0)
  console.log(today)

  // Variable som definerer ExpireDate til at være det samme som value
  let ExpireDate = value;
  // Laver igen en variable som et nyt Date()-objekt med ExpireDate og Sætter tid til 0.
  let expire = new Date(ExpireDate)
  expire.setMilliseconds(0)
  expire.setSeconds(0)
  expire.setHours(0)
  expire.setMinutes(0)
  console.log(ExpireDate)

  // Herefter beregner vi resultatet altså forskllen mellem de to datoer, som bliver beregnet i millisekunder.
  let res = expire.getTime() - today.getTime();
  console.log(res)
  
  // En dag beregnes i millisekunder:
  let one_day = 1000 * 60 * 60 * 24;
  // Variable udløbsdato som er resultaten lavet om til dage istedet for millisekunder
  let udløbsdato = res / one_day
  console.log(udløbsdato)
  // Ud fra if, else if, og else-statements kan vi så give maden en farve ud fra hvor mange dage den har til gode.
  // Efter hver statement sker der en return, som tilføjer den rette værdi 'udløbet, udløber, eller frisk'
  // op som en class maden, så brugeren visuelt kan se hvornår maden udløber.

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



/*
===================GAMMEL KODE=====================

Dette herunder er kode hvor vi havde tilføjede brugerens madvarer til et array i brugerens fields, 
men støtte på et problem da vi skulle slette varene igen, da den af eller anden grund fandt et 'undefined' element inde i arrayet
Datastrukturern er lavet om, så vi laver en ny collection under brugerns ID med fridge, som indeholder dokumenter
omkring hvad mad de har i køleskabet og hvornår det udløber.



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
*/

// onclick funktion på save-knappen under profil siden.


/*
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

*/