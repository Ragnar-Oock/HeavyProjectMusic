// variable declaration
// AJAX parameters
const Url = 'http://91.161.139.103:50000/HeavyChatMusique/sampleMusique.json';
const pingDelay = 1000;

// define the AJAX result storage
let lastResult = [];
let newResult = [];

// instenciate the storage of the element to animate (for order change)
let target;

$(document).ready(function() {
  ajaxd();
  setInterval(ajaxd, pingDelay);

  // for debug purpose only
  // $('.btn').click(function(){
  //   ajaxd();
  // })
});

/**
* perform the AJAX request and trigger the needed fonction
*/
function ajaxd() {
  $.ajax({
    url: Url,
    type: 'GET',
    cache: false,
    crossDomain: true,
    success: playlistProcessing(result){,
    error: function(error){
      console.error(error);
    }
  });
}

/**
 * all the actions to do if the request succeded
 * @param  {object} result JSON object from the AJAX request
 */
function playlistProcessing(result) {
  lastResult = newResult;
  newResult = result;
  // if two request are differentes => delete, add or move the incriminated items
  if (newResult!==lastResult) {
    // run throught the precedent result
    for (var i = 0; i < lastResult.length; i++) {
      /*on enregistre l'index de la musique dans la nouvelle et l'ancienne requete*/
      // store the index of the current item of the last result in the new one
      let newIndex = isIn(lastResult[i].id, newResult);
      /*si l'index n'est pas le meme on la deplace*/
      // if the indexes are differents move the item to the correct position
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
      // else if the index found in the new result is -1, the item is not anymore in the playlist, remove it
      else if (newIndex===-1) {
        let selector = '#id'+lastResult[i].id;
        $(selector).addClass('playlist_item_hidden');
        setTimeout(function() {
          $(selector).remove();
        }, 300)
      }
    }

    /*si l'ancienne requete est vide*/
    // if the last result is empty (ie : first execution)
    if (typeof(lastResult[0])=='undefined') {
      // run throught the new result and add all the item to the list
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
      // run throught the new result
      for (var i = 0; i < newResult.length; i++) {
        // if the current song is in the last result
        if (typeof(lastResult[i])!=='undefined') {
          /*on enregistre l'index de la musique dans l'ancienne requete*/
          // store the index of the item current in the last result
          let oldIndex = isIn(newResult[i].id, lastResult);
          /*si la musique n'etait pas dans l'ancienne requete on l'ajoute*/
          // if the item isn't in the last result, add it to the list
          if (oldIndex===-1) {
            let musique = new Musique(newResult[i]);
            musique.htmlPrint();
            setTimeout(function() {
              $('#id'+musique.id).removeClass('playlist_item_hidden');
            }, 10);
          }
        }

        // DEBUG: test si cette partie est importe (normalement non car redondante (ligne 76))
        // // else the current song is not in the last result, remove it
        // else {
        //   let musique = new Musique(newResult[i]);
        //   musique.htmlPrint();
        //   setTimeout(function() {
        //     $('#id'+musique.id).removeClass('playlist_item_hidden');
        //   }, 10);
        // }
      }
    }
  }
  // $('#playlist_length_displayed').html(newResult.length);
  // update the length indicator
  $('#playlist_length_total').html(newResult.length);
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
