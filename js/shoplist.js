export default class Shoplist {

// "Marker alle" knap
 /* Ved hjælp af et for-loop markeres alle madvarer når onclick eventet udføres*/  
selectAll(){
  let items=document.getElementsByName('madvarer');
    for(var i=0; i<items.length; i++){
      if(items[i].type=='checkbox')
            items[i].checked=true;
    }
}	

}

