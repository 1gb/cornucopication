// TODO: add map to description
// TODO: If within 3 months prior to current day, default to unverified


$(document).ready(function() {

  var events = [];
  var locations = [];
  var months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  var currentMonth = moment().month() + 1;
  var now = parseInt(moment().format('DDD'));

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
        dayOfYear: parseInt(moment(this.dateStart).format('DDD')),
        dayOfYearEnd: parseInt(moment(this.dateEnd).format('DDD')),
        numericMonth: moment(this.dateEnd).month() + 1,
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
    sortFromToday();
    sortMonths();
    additionalCurrentMonth();
    createMonths();
    format();
    removeEmptyMonths();
  });

  var sortByMonth = function() {
    // put the events in order from beginning of year to end of year
    events = events.sort(function (a, b) {
      return a.dayOfYear - b.dayOfYear;
    });
  };

  var sortFromToday = function() {
    var counter = 0;
    var tempArray = [];
    // rearrange them against today's date to show the next upcoming event first
    for (i = 0; i < events.length; i++) {
      if (events[i].dayOfYearEnd <= now) {
        counter++;
      } else if (events[i].dayOfYearEnd > now ){
        tempArray = events.splice(0, counter);
        events = events.concat(tempArray);
        return;
      }
    }
  };

  var sortMonths = function() {
    var tempArray;
    if (currentMonth === events[0].numericMonth) {
      tempArray = months.splice(0, currentMonth - 1);
      months = months.concat(tempArray);
    } else {
      tempArray = months.splice(0, events[0].numericMonth - 1);
      months = months.concat(tempArray);
    }
  };

  //Check if the current month has past events, if so, adds another month to end.
  var additionalCurrentMonth = function() {
    if (events[0].month === events[events.length - 1].month) {
      months.push(months[0]);
    }
  };

  var createMonths = function() {
    for (i = 0; i < months.length; i++) {
      //if the last month is same as first month... add it with an id of month + '2'
      if (i === 12) {
        $('#date-list').append(
          '<div class="month-group" id="' + months[i].toLowerCase() + '2' + '">' +
            '<h3 class="sub-heading">' + months[i] + '</h3>' +
            '<ul class="festival-list">' +
          '</div>');
      } else {
        $('#date-list').append(
          '<div class="month-group" id="' + months[i].toLowerCase() + '">' +
            '<h3 class="sub-heading">' + months[i] + '</h3>' +
            '<ul class="festival-list">' +
          '</div>');
      }
    }
  };

  var datesCertain = '';
  var datesUncertain = '<span class="dates-uncertain">Unverified</span>';

  var format = function() {
    events.forEach( function(element) {
      // console.log(element.name + ' ' + element. );
      var thisMonth = element.monthString.toLowerCase();
      var downIcon = '<span class="downIcon"><i class="fa fa-angle-double-down" aria-hidden="true"></i></span>';
      var eventUrl = '<div class="event-url"><a href="' + element.url + '" target="_blank">Visit the ' + element.name + ' Website</a></div>';
      var calendar = '<div class="calAdd"><a href="https://www.google.com/calendar/render?action=TEMPLATE&text=' + element.name +
        '&dates=' + moment(element.dateStartO).format('YYYYMMDD') + '/' + moment(element.dateEndO).add(1, 'd').format('YYYYMMDD') + '&details=' + element.desc +
        '&location=' + element.city + '&sf=true&output=xml" target="_blank">' +
        '<i class="fa fa-calendar" aria-hidden="true"></i>  Add to Google Calendar</a></div>';

      // If the month is split, add to second month
      if (thisMonth === months[0].toLowerCase() && element.dayOfYearEnd < now) {
        $('#' + thisMonth + '2' + ' .festival-list').append(
          '<li class="item collapsed" data-toggle="collapse" data-target="#' + element.eventId + '">' +
            '<div class="festival-name">' + downIcon + element.name + '</div>' +
            '<div class="entry">' +
              '<span class="date">' + 
              // If the dateStart and dateEnd is the same, just list one and not both
              (element.dateStart === element.dateEnd ? element.dateStart + ' ' : element.dateStart + ' - ' + element.dateEnd + ' ') +
              (element.datesCertain === true ? datesCertain : datesUncertain) + '</span> • ' + element.city + calendar +
              '<div id="' + element.eventId + '" class="single-event collapse">' + element.desc + eventUrl + '</div>' +
            '</div>' +
          '</li>');
      } else {
        $('#' + thisMonth + ' .festival-list').append(
          '<li class="item collapsed" data-toggle="collapse" data-target="#' + element.eventId + '">' +
            '<div class="festival-name">' + downIcon + element.name + '</div>' +
            '<div class="entry">' +
              '<span class="date">' + 
              (element.dateStart === element.dateEnd ? element.dateStart + ' ' : element.dateStart + ' - ' + element.dateEnd + ' ') + 
              (element.datesCertain === true ? datesCertain : datesUncertain) + '</span> • ' + element.city + calendar +
              '<div id="' + element.eventId + '" class="single-event collapse">' + element.desc + eventUrl + '</div>' +
            '</div>' +
          '</li>');
      }
    });
  };

  var removeEmptyMonths = function() {
    months.forEach(function(month) {
      month = month.toLowerCase();
      if ($('#' + month + ' ul').is(':empty')) {
        $('#' + month).remove();
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
