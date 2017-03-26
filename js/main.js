$(document).ready(function() {

  var events = [];
  var locations = [];

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

    $.each( data, function() {
      locations.push({
        name: this.name,
        dateStart: moment(this.dateStart).format('MMM Do'),
        dateEnd: moment(this.dateEnd).format('MMM Do'),
        desc: this.desc,
        lat: this.coords.lat,
        lon: this.coords.lon,
        url: this.url
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
      var downIcon = '<span class="downIcon"><i class="fa fa-angle-double-down" aria-hidden="true"></i></span>';
      var eventUrl = '<div class="event-url"><a href="' + element.url + '" target="_blank">Visit the ' + element.name + ' Website</a></div>';
      // var calendar = '<span class="addtocalendar atc-style-blue">' + // From http://addtocalendar.com/
      //         '<var class="atc_event">' +
      //             '<var class="atc_date_start">' + '</var>' +
      //             '<var class="atc_date_end">2016-05-04 18:00:00</var>' +
      //             '<var class="atc_title">Star Wars Day Party</var>' +
      //             '<var class="atc_description">May the force be with you</var>' +
      //             '<var class="atc_location">Tatooine</var>' +
      //         '</var>' +
      //     '</span>';

      // If a month section doesn't exist, create one
      if ( document.getElementById(thisMonth) === null ) {
        $('#date-list').append(
          '<div class="month-group" id="' + thisMonth + '">' +
            '<h3 class="sub-heading">' + element.monthString + '</h3>' +
            '<ul class="festival-list">' +
              '<li class="item collapsed" data-toggle="collapse" data-target="#' + element.eventId + '">' +
                '<div class="festival-name">' + downIcon + element.name + '</div>' +
                '<div class="entry">' +
                  '<span class="date">' + element.dateStart + ' - ' + element.dateEnd + '</span>' + ' • ' + element.city +
                  '<div id="' + element.eventId + '" class="single-event collapse">' + element.desc + eventUrl + '</div>' +
                '</div>' +
              '</li>' +
          '</div>');
      } else {
        $('#' + thisMonth + ' .festival-list').append(
          '<li class="item collapsed" data-toggle="collapse" data-target="#' + element.eventId + '">' +
            '<div class="festival-name">' + downIcon + element.name + '</div>' +
            '<div class="entry">' +
              '<span class="date">' + element.dateStart + ' - ' + element.dateEnd + '</span> • ' + element.city +
              '<div id="' + element.eventId + '" class="single-event collapse">' + element.desc + eventUrl + '</div>' +
            '</div>' +
          '</li>');
      }
    });
  };

  // Tab functionality
  $('.tab-item').on('click touchstart', function(e) {
      e.preventDefault();
      var showTab = $(this).find('a').attr('href');
      $('.active').removeClass('active');
      $(this).addClass('active');
      $('.visible-section:visible').hide();
      $(showTab).show();

      if (showTab === '#map-list') {
        initMap();
      }
    });

  // Google Map Mobile
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

// Google Map
  function initMap() {
    var liberty = {lat: 47.25372, lng: -120.6710793};
    var map = new google.maps.Map(document.getElementById('map'), {
      center: liberty,
      zoom: 6,
    });

    var infowindow = null;

    locations.forEach( function(element) {
      var position = new google.maps.LatLng(element.lat, element.lon);
      marker = new google.maps.Marker({
        position: position,
        map: map,
        title: element.name
      });

      marker.addListener('click', function() {
        if (infowindow) {
          infowindow.close();
        }
        infowindow = new google.maps.InfoWindow();
        infowindow.setContent('<div class="mapInfo"><a href="' + element.url + '" target="_blank">' + element.name + '</a></div><div>' + element.dateStart + ' to ' + element.dateEnd + '</div>');
        infowindow.open(map, this);
      });
    });
  } //end initMap
});
