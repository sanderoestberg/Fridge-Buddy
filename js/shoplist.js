export default class shoplist {
constructor() {
    
  }


// "Marker alle" knap
selectAll(){
    /* var items gemmer på værdien 'madvarer' som er shoplistens input's name*/
  var items=document.getElementsByName('madvarer');
      /* (var i = 0) defineren variabelen, inden loopen starter. */
      /* (i<items.length) Definerer betingelsen for, at loopen skal køre, altså at "lenght" indstiller eller returnerer antallet af elementer i items. */
      /* (i++) øger en værdi hver gang kodeblokken i loppet er udført.*/
    for(var i=0; i<items.length; i++){
      /* items[i].type og 'checkbox' sammenlignes på værdi. Hvis de har samme værdi udføres koden så de markeres */  
      if(items[i].type=='checkbox')
            items[i].checked=true;
    }
}	

}