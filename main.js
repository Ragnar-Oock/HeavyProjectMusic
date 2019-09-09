// variable declaration
// AJAX parameters
const url = 'http://91.161.139.103:50000/HeavyChatMusique/sampleMusique.json';
const pingDelay = 10000; //default : 10000

// define the AJAX result storage
let lastResult = [];
let newResult = [];

// instenciate the storage of the element to animate (for order change)
let target;

// end of variables declaration

// on document ready
$(document).ready(() => {
  // init
  // if dark mode was activated on previous visite get it up
  if (window.localStorage.getItem('dark') == "true") {
    // set dark mode to true
    $('body').toggleClass('dark', true);
    // check option checkbox
    $('#dark_mode').prop('checked', true);
  }
  // if streaming mode was activated on previous visite get it up
  if (window.localStorage.getItem('stream') == "true" || $('#stream_mode').prop('checked')) {
    // set dark mode to true
    $('body').toggleClass('stream', true);
    // check option checkbox
    $('#stream_mode').prop('checked', true);
  }
  // if autoRefresh was deactiveted on previous visite get it down and show refresh button
  let locAutoRefresh = window.localStorage.getItem("autoRefresh")
  if (locAutoRefresh == "true" || locAutoRefresh == null || locAutoRefresh == undefined) {
    // disable autoRefresh
    autoRefresh = true;
    // hide refresh button
    $('#refresh').toggleClass('hidden', true);
    // ckeck option checkbox
    $('#autoRefresh').prop('checked', true);
  }
  else {
    autoRefresh = false;
  }
  // if the ids was shown on previous visite get it up
  if (window.localStorage.getItem('show_id') == "true" || $('#show_id').prop('checked')) {
    // set dark mode to true
    $('body').toggleClass('show_id', true);
    // check option checkbox
    $('#show_id').prop('checked', true);
  }
  // first API call
  ajaxd(true);
  // set API call delay to pingDelay [default 10000]
  setInterval(ajaxd, pingDelay);

  // toggle refresh button display
  $('#autoRefresh').change(() => {
    // toggle autoRefresh
    autoRefresh = !autoRefresh;
    // toggle refresh button visibility
    $('#refresh').toggleClass('hidden');
    // store the setting localy
    if (window.localStorage.getItem('autoRefresh') == "true") {
      window.localStorage.setItem('autoRefresh', false);
    }
    else {
      window.localStorage.setItem('autoRefresh', true);
    }
  });

  // toggle dark mode
  $('#dark_mode').change(() => {
    // toggle dark mode
    $('body').toggleClass('dark');
    // store the seting localy
    if (window.localStorage.getItem('dark') == "true" ) {
      window.localStorage.setItem('dark', false);
    }
    else {
      window.localStorage.setItem('dark', true);
    }
  });

  // toggle stream mode
  $('#stream_mode').change(() => {
    // toggle dark mode
    $('body').toggleClass('stream');
    // store the seting localy
    if (window.localStorage.getItem('stream') == "true" ) {
      window.localStorage.setItem('stream', false);
    }
    else {
      window.localStorage.setItem('stream', true);
    }
  });

  // on blur of the option menu, hide it
  $('.screen').click(() => {
    $('#menu').prop('checked', !1);
  });
});
// end of on document ready

// fonction declaration
/**
* perform the AJAX request and trigger the needed fonction
*/
function ajaxd(force = false) {
  if (autoRefresh || force) {
    $.ajax({
      url: url,
      type: 'GET',
      cache: false,
      crossDomain: true,
      success: function(result){
        playlistProcessing(result);
      },
      error: function(error){
        console.error(error);
      }
    });
  }
}

/**
 * all the actions to do if the request succeded
 * @param  {object} result JSON object from the AJAX request
 */
function playlistProcessing(result) {

  lastResult = newResult;
  newResult = result;

  // if two request are differentes => add, move or delete the incriminated items
  if (newResult!==lastResult) {

    // the last result is empty (i.e. : first execution)
    if (typeof(lastResult[0])=='undefined') {
      // run throught the new result and add all the item to the list
      for (var i = 0; i < newResult.length; i++) {
        let item = new Music(newResult[i], i);
        item.htmlPrint();
      }
    }
    // (i.e. : not first execution)
    else {
      // reset the counter
      let i = 0;
      // run throught the new result
      while (typeof(newResult[i])!=='undefined') {
        // store the index of the current item in the last result
        let oldIndex = isIn(newResult[i].id, lastResult);
        // if the item isn't in the last result,
        // add it visualy and in the lastResult (simplfy the animation)
        if (oldIndex===-1) {
          lastResult.splice(i, 0, newResult[i]);
          let item = new Music(newResult[i], i);
          item.htmlPrint();
        }
        // next item
        i++;
      }
    }

    // run throught the precedent result
    for (let i = 0; i < lastResult.length; i++) {

      // store the index of the current item from the last result in the new one
      let newIndex = isIn(lastResult[i].id, newResult);

      // if the index found in the new result is -1, the item is not in the playlist anymore, remove it
      if (newIndex===-1) {
        // delete the item in the last result (simplify the animation)
        suppr(i);
      }
      else {
        // if the titles didn't match (i.e. the request has bein edited)
        if (newResult[i]['title'] != lastResult[i]['title'] || newResult[i]['artist'] != lastResult[i]['artist']) {
          suppr(i);
          let item = new Music(newResult[i], i);
          item.htmlPrint();
        }
        // if the indexes are differents move the item to the correct position
        if (newIndex!==i) {
          // move the item around visualy
          target = $('#id'+lastResult[i].id).first()[0];
          let newLocation = (8.5 * (newIndex - i)) + 'em';
          anime({
            targets: target,
            translateY: newLocation,
            duration: 300,
            easing: 'easeInOutQuad'
          });
          // move the item in the DOM
          setTimeout((lastResult, target, i, newIndex) => {
            let destination = $('#playlist>div:nth-child('+(newIndex+1)+')');
            $('#id'+lastResult[i].id).first().insertAfter(destination);
            anime({
              targets: target,
              duration: 0,
              translateY: 0,
            });
          }, 305, lastResult, target, i, newIndex);
        }
      }
    }

  }
  // update the length indicator
  $('#playlist_length_total').html(newResult.length);
}

/**
* return the position into the array of an object with an id [id]
* @param  {int}    id     id of the music to find in the array
* @param  {array}  array  array to search in
* @return {int}           index of the object for the id id
*/
function isIn(id, array) {
  let i = array.length;
  while (typeof(array[i-1]) !== 'undefined' && array[i-1].id !== id) {
    i--;
  }
  return i-1;
}

/**
 * delete the item at the designited index
 * @param  {int} i index of the item to delete
 */
function suppr(i) {
  let deleted = lastResult.splice(i, 1);
  // animate the deletion
  let selector = '#id'+deleted[0].id;
  $(selector).addClass('playlist_item_hidden');
  setTimeout(() => {
    $(selector).remove();
  }, 300)
}
// end of function declaration
