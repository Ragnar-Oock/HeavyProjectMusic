
var badges = {
  "broadcaster": "https://static-cdn.jtvnw.net/badges/v1/5527c58c-fb7d-422d-b71b-f309dcb85cc1/3",
  "vip": "https://static-cdn.jtvnw.net/badges/v1/b817aba4-fad8-49e2-b88a-7cc744dfa6ec/3",
  "partner": "https://static-cdn.jtvnw.net/badges/v1/d12a2e27-16f6-41d0-ab77-b780518f00a3/3",
  "moderator": "https://static-cdn.jtvnw.net/badges/v1/3267646d-33f0-4b17-b3df-f923a41db1d0/3",
  "mod": "https://static-cdn.jtvnw.net/badges/v1/3267646d-33f0-4b17-b3df-f923a41db1d0/3",
  "admin": "https://static-cdn.jtvnw.net/chat-badges/admin.png",
  "global_mod": "https://static-cdn.jtvnw.net/chat-badges/globalmod.png",
  "staff": "https://static-cdn.jtvnw.net/badges/v1/d97c37bd-a6f5-4c38-8f57-4e4bef88af34/3"
}

/*AJAX parameters*/
const wrapperId = 'playlist';
const Url = 'http://91.161.139.103:50000/HeavyChatMusique/sampleMusique.json';
const pingDelay = 1000;

/*define the AJAX result storage*/
let lastResult = [];
let newResult = [];

/*instenciate the storage of the element to animate (for order change)*/
let target;

$(document).ready(function() {
  ajaxd();
  // setInterval(ajaxd, pingDelay);

  $('.btn').click(function(){
    ajaxd();
  })
});

/**
* main thread function, retreive the playlist from the server, analyse it and disply it
* @return {none} function without return value
*/
function ajaxd() {
  $.ajax({
    url: Url,
    type: 'GET',
    cache: false,
    crossDomain: true,
    success: function(result){
      lastResult = newResult;
      newResult = result;
      /*si deux requetes sont differentes => suppression, ajout, deplacement, musique*/
      if (newResult!==lastResult) {
        /*on parcourt l'ancienne requete*/
        for (var i = 0; i < lastResult.length; i++) {
          /*on enregistre l'index de la musique dans la nouvelle et l'ancienne requete*/
          let newIndex = isIn(lastResult[i].id, newResult);
          /*si l'index n'est pas le meme on la deplace*/
          if (newIndex!==i) {
            target = $('#id'+lastResult[i].id).first()[0];
            let newLocation = (10.66 * (newIndex - i)) + 'em';
            anime({
              targets: target,
              translateY: newLocation,
              duration: 300,
              easing: 'easeInOutQuad'
            });
            setTimeout(function(lastResult, target, i, newIndex) {
              let destination = $('#playlist>div:nth-child('+(newIndex+1)+')');
              $('#id'+lastResult[i].id).first().insertAfter(destination);
              anime({
                targets: target,
                duration: 0,
                translateY: 0,
              });
            }, 1000, lastResult, target, i, newIndex);
          }
          /*sinon la musique n'est plus dans la liste on la supprime*/
          else if (newIndex===-1) {
            let selector = '#id'+lastResult[i].id;
            $(selector).addClass('playlist_item_hidden');
            setTimeout(function() {
              $(selector).remove();
            }, 300)
          }
        }

        /*si l'ancienne requete est vide*/
        if (typeof(lastResult[0])=='undefined') {
          for (var i = 0; i < newResult.length; i++) {
            let musique = new Musique(newResult[i], i);
            musique.htmlPrint();
            setTimeout(function() {
              $('#id'+musique.id).removeClass('playlist_item_hidden');
            }, 10);
          }
        }
        else {
          i=0;
          /*on parcourt la nouvelle requete*/
          for (var i = 0; i < newResult.length; i++) {
            if (typeof(lastResult[i])!=='undefined') {
              /*on enregistre l'index de la musique dans l'ancienne requete*/
              let oldIndex = isIn(lastResult[i].id, newResult);
              /*si la musique n'etait pas dans l'ancienne requete on l'ajoute*/
              if (oldIndex===-1) {
                let musique = new Musique(newResult[i]);
                musique.htmlPrint();
                setTimeout(function() {
                  $('#id'+musique.id).removeClass('playlist_item_hidden');
                }, 10);
              }
            }
            else {
              let musique = new Musique(newResult[i]);
              musique.htmlPrint();
              setTimeout(function() {
                $('#id'+musique.id).removeClass('playlist_item_hidden');
              }, 10);
            }
          }
        }
      }
      // $('#playlist_length_displayed').html(newResult.length);
      $('#playlist_length_total').html(newResult.length);
    },
    error: function(error){
    }
  });
}
/**
* return the position into the array of an object with an id [id]
* @param  {int}  id       id of the music to find in the array
* @param  {array}  array  array to search in
* @return {int}           index of the object for the id id
*/
function isIn(id, array) {
  let i=array.length;
  while (typeof(array[i-1])!=='undefined' && array[i-1].id!==id) {
    i--;
  }
  return i-1;
}
