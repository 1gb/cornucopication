$(document).ready(function() {

  var events = [];

  $.getJSON( "data/festivals.json", function( data ) {

    $.each( data, function() {
      events.push({
        name: this.name,
        eventId: this.eventId,
        url: this.url,
        city: this.city,
        dateStart: moment(this.dateStart).format('MMM Do'),
        dateEnd: moment(this.dateEnd).format('MMM Do'),
        dayOfYear: moment(this.dateStart).format('DDD'),
        month: moment(this.dateStart).format('MM'),
        monthString: moment(this.dateStart).format('MMMM'),
        datesCertain: this.datesCertain,
        type: this.type,
        desc: this.desc
      });

    });
    sortByMonth();
    format();
  });

  var now = moment().format('DDD');

  var sortByMonth = function() {
    events = events.sort(function (a, b) {
      return a.dayOfYear - b.dayOfYear;
    });

    for (i = 0; i < events.length; i++) {
      if (parseInt(events[i].dayOfYear) >= now) {
        return;
      } else {
        events.push(events.shift());
      }
    }
  };

  var format = function() {

    events.forEach( function(element) {
      var thisMonth = element.monthString.toLowerCase();
      var downIcon = '<div class="downIcon"><i class="fa fa-angle-double-down fa-3x" aria-hidden="true"></i></div>';
      var eventUrl = '<div class="event-url"><a href="' + element.url + '" target="_blank">Visit the ' + element.name + ' Website</a></div>';

      // If a month section doesn't exist, create one

      if ( document.getElementById(thisMonth) === null ) {
        $('#date-list').append('<div class="month-group" id="' + thisMonth + '"><h3 class="month-name">' + element.monthString + '</h3><ul class="festival-list"><li class="item collapsed" data-toggle="collapse" data-target="#' + element.eventId + '">' + downIcon + '<div class="festival-name">' + element.name + '</div><div class="entry"><span class="date">' + element.dateStart + ' - ' + element.dateEnd + '</span> • ' + element.city +
        '<div id="' + element.eventId + '" class="single-event collapse">' + element.desc + eventUrl + '</div></li></div>');
      } else {
      $('#' + thisMonth + ' .festival-list').append('<li class="item collapsed" data-toggle="collapse" data-target="#' + element.eventId + '">' + downIcon + '<div class="festival-name">' + element.name + '</div><div class="entry"><span class="date">' + element.dateStart + ' - ' + element.dateEnd + '</span> • ' + element.city +
      '<div id="' + element.eventId + '" class="single-event collapse">' + element.desc + eventUrl + '</div></li></div>');
    }
  });
};

  $('#date-sort a').click(function (e) {
    e.preventDefault();
    $('#map-list').hide();
    $('#date-list').show();
    $('#date-sort').addClass('active');
    $('#map-sort').removeClass('active');
  });

  $('#map-sort a').click(function (e) {
    e.preventDefault();
    initMap();
    $('#date-list').hide();
    $('#map-list').show();
    $('#map-sort').addClass('active');
    $('#date-sort').removeClass('active');
  });

  // GOOGLE MAP
  function detectBrowser() {
    var useragent = navigator.userAgent;
    var mapdiv = document.getElementById("map");

    if (useragent.indexOf('iPhone') != -1 || useragent.indexOf('Android') != -1 ) {
      mapdiv.style.width = '100%';
      mapdiv.style.height = '100%';
    } else {
      mapdiv.style.width = '600px';
      mapdiv.style.height = '800px';
    }
  }

  function initMap() {
    console.log('initMap');
    // var uluru = {lat: -25.363, lng: 131.044};
    var liberty = {lat: 47.25372, lng: -120.6710793};
    var map = new google.maps.Map(document.getElementById('map'), {
      zoom: 6,
      center: liberty
    });

    events.forEach(function(element) {

      var marker = new google.maps.Marker({
        position: events.city,
        map: map
      });
    });
    // var marker = new google.maps.Marker({
    //   position: uluru,
    //   map: map
    // });
  }


});
