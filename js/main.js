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

    events.forEach( function(element, i) {
      var thisMonth = element.monthString.toLowerCase();
      var downIcon = '<div class="downIcon"><i class="fa fa-angle-double-down fa-3x" aria-hidden="true"></i></div>';
      var eventUrl = '<div class="event-url"><a href="' + element.url + '" target="_blank">Visit the ' + element.name + ' Website</a></div>';

      // If a month section doesn't exist, create one

      if ( document.getElementById(thisMonth) === null ) {
        $('#date-list').append('<div class="month-group" id="' + thisMonth + '"><h3 class="month-name">' + element.monthString + '</h3><br><ul class="festival-list"><li class="item collapsed" data-toggle="collapse" data-target="#' + element.eventId + '">' + downIcon + '<div class="festival-name">' + element.name + '</div><div class="entry"><span class="date">' + element.dateStart + ' - ' + element.dateEnd + '</span> • ' + element.city +
        '<div id="' + element.eventId + '" class="single-event collapse">' + element.desc + eventUrl + '</div></li></div>');
      } else {
      $('#' + thisMonth + ' .festival-list').append('<li class="item collapsed" data-toggle="collapse" data-target="#' + element.eventId + '">' + downIcon + '<div class="festival-name">' + element.name + '</div><div class="entry"><span class="date">' + element.dateStart + ' - ' + element.dateEnd + '</span> • ' + element.city +
      '<div id="' + element.eventId + '" class="single-event collapse">' + element.desc + eventUrl + '</div></li></div>');
    }
  });
};

  $('#date-sort a').click(function (e) {
    e.preventDefault();
    $('#map-list').hide().toggleClass('active');
    $('#date-list').show().toggleClass('active');
    $('#date-sort a').addClass('active');
    $('#map-sort a').removeClass('active');
  });

  $('#map-sort a').click(function (e) {
    e.preventDefault();
    $('#date-list').hide();
    $('#map-list').show();
    $('#map-sort a').addClass('active');
    $('#date-sort a').removeClass('active');
  });

});
