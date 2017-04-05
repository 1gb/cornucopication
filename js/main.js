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
        dateStartO: this.dateStart,
        dateEndO: this.dateEnd,
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
    // put the events in order from beginning of year to end of year
    events = events.sort(function (a, b) {
      return a.dayOfYear - b.dayOfYear;
    });

    // rearrange them against today's date to show the next upcoming event first
    for (i = 0; i < events.length; i++) {
      if (parseInt(events[i].dayOfYear) <= now) {
        events.push(events.shift());
      }
    }
  };

  var format = function() {

    events.forEach( function(element) {
      var thisMonth = element.monthString.toLowerCase();
      var downIcon = '<span class="downIcon"><i class="fa fa-angle-double-down" aria-hidden="true"></i></span>';
      var eventUrl = '<div class="event-url"><a href="' + element.url + '" target="_blank">Visit the ' + element.name + ' Website</a></div>';
      var calendar = '<div class="calAdd"><a href="https://www.google.com/calendar/render?action=TEMPLATE&text=' + element.name +
        '&dates=' + moment(element.dateStartO).format('YYYYMMDD') + '/' + moment(element.dateEndO).add(1, 'd').format('YYYYMMDD') + '&details=' + element.desc +
        '&location=' + element.city + '&sf=true&output=xml" target="_blank">' +
        '<i class="fa fa-calendar" aria-hidden="true"></i>  Add to Google Calendar</a></div>';

      // If a month section doesn't exist, create one
      if ( document.getElementById(thisMonth) === null ) {
        $('#date-list').append(
          '<div class="month-group" id="' + thisMonth + '">' +
            '<h3 class="sub-heading">' + element.monthString + '</h3>' +
            '<ul class="festival-list">' +
              '<li class="item collapsed" data-toggle="collapse" data-target="#' + element.eventId + '">' +
                '<div class="festival-name">' + downIcon + element.name + '</div>' +
                '<div class="entry">' +
                  '<span class="date">' + element.dateStart + ' - ' + element.dateEnd + '</span>' + ' • ' + element.city + calendar +
                  '<div id="' + element.eventId + '" class="single-event collapse">' + element.desc + eventUrl + '</div>' +
                '</div>' +
              '</li>' +
          '</div>');
      } else {
        $('#' + thisMonth + ' .festival-list').append(
          '<li class="item collapsed" data-toggle="collapse" data-target="#' + element.eventId + '">' +
            '<div class="festival-name">' + downIcon + element.name + '</div>' +
            '<div class="entry">' +
              '<span class="date">' + element.dateStart + ' - ' + element.dateEnd + '</span> • ' + element.city + calendar +
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
