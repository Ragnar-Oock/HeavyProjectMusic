// variable declaration
// AJAX parameters
const pingDelay = 10000; // default : 10000
const streamPingDelay = 1000 // default : 1000
const url = 'sampleMusique.json'; // default : sampleMusique.json

// define the AJAX result storage
let lastResult = [];
let newResult = [];

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
    // crank up updates to 1 every sec
    playlist.updateInterval(1000);
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
    // force refresh
    playlist.process()
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
    playlist.process();
  })

  // toggle dark mode
  $('#dark_mode').change(() => {
    // toggle dark mode
    $('body').toggleClass('dark');
    // store the seting localy
    if (window.localStorage.getItem('dark') == "true") {
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
    if (window.localStorage.getItem('stream') == "true") {
      window.localStorage.setItem('stream', false);
      playlist.updateInterval(pingDelay);
    }
    else {
      window.localStorage.setItem('stream', true);
      playlist.updateInterval(streamPingDelay);
    }
  });

  // toggle show id
  $('#show_id').change(() => {
    // toggle dark mode
    $('body').toggleClass('show_id');
    // store the seting localy
    if (window.localStorage.getItem('show_id') == "true") {
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
