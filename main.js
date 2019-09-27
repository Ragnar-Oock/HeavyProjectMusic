// variable declaration
// AJAX parameters
const pingDelay = 10000; //default : 10000
const url = 'sampleMusique.json';

// define the AJAX result storage
let lastResult = [];
let newResult = [];

// instenciate the storage of the element to animate (for order change)
let target;

// end of variables declaration

// on document ready
$(document).ready(() => {
  // init
  // initiate the processing
  let playlist = new playlistProcessing(pingDelay, url);

  // if dark mode was activated on previous visite get it up
  if (window.localStorage.getItem('dark') == "true") {
    // set dark mode to true
    $('body').toggleClass('dark', true);
    // check option checkbox
    $('#dark_mode').prop('checked', true);
  }
  // if streaming mode was activated on previous visite get it up
  if (window.localStorage.getItem('stream') == "true" || $('#stream_mode').prop('checked')) {
    // set stream mode to true
    $('body').toggleClass('stream', true);
    // check option checkbox
    $('#stream_mode').prop('checked', true);
  }
  // if autoRefresh was deactiveted on previous visite get it down and show refresh button
  let locAutoRefresh = window.localStorage.getItem("autoRefresh")
  if (locAutoRefresh == "true" || locAutoRefresh == null || locAutoRefresh == undefined) {
    // enable autoRefresh
    playlist.setAutoRefresh(true);
    // hide refresh button
    $('#refresh').toggleClass('hidden', true);
    // ckeck option checkbox
    $('#autoRefresh').prop('checked', true);
  }
  else {
    playlist.setAutoRefresh(false);
  }
  // if the ids was shown on previous visite get it up
  if (window.localStorage.getItem('show_id') == "true" || $('#show_id').prop('checked')) {
    // set show id to true
    $('body').toggleClass('show_id', true);
    // check option checkbox
    $('#show_id').prop('checked', true);
  }

  // toggle refresh button display
  $('#autoRefresh').change(() => {
    // toggle autoRefresh
    playlist.toggleAutoRefresh();

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

  // force the refresh
  $('#refresh').click(() => {
    playlist.process(true);
  })

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

  // toggle show id
  $('#show_id').change(() => {
    // toggle dark mode
    $('body').toggleClass('show_id');
    // store the seting localy
    if (window.localStorage.getItem('show_id') == "true" ) {
      window.localStorage.setItem('show_id', false);
    }
    else {
      window.localStorage.setItem('show_id', true);
    }
  });

  // on blur of the option menu, hide it
  $('.screen').click(() => {
    $('#menu').prop('checked', !1);
  });
});
// end of on document ready

// array comparison function as provided at :
// https://stackoverflow.com/a/14853974/9989341

// Warn if overriding existing method
if(Array.prototype.equals)
    console.warn("Overriding existing Array.prototype.equals. Possible causes: New API defines the method, there's a framework conflict or you've got double inclusions in your code.");
// attach the .equals method to Array's prototype to call it on any array
Array.prototype.equals = function (array) {
    // if the other array is a falsy value, return
    if (!array)
        return false;

    // compare lengths - can save a lot of time
    if (this.length != array.length)
        return false;

    for (var i = 0, l=this.length; i < l; i++) {
        // Check if we have nested arrays
        if (this[i] instanceof Array && array[i] instanceof Array) {
            // recurse into the nested arrays
            if (!this[i].equals(array[i]))
                return false;
        }
        else if (this[i] != array[i]) {
            // Warning - two different object instances will never be equal: {x:20} != {x:20}
            return false;
        }
    }
    return true;
}
// Hide method from for-in loops
Object.defineProperty(Array.prototype, "equals", {enumerable: false});
