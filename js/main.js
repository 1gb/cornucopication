$(document).ready(function() {

  var events = [];

  $.getJSON( "data/festivals.json", function( data ) {

    $.each( data, function() {
      events.push({
        name: this.name,
        url: this.url,
        city: this.city,
        dateStart: moment(this.dateStart).format('MMM Do'),
        dateEnd: moment(this.dateEnd).format('MMM Do'),
        dayOfYear: moment(this.dateStart).format('DDD'),
        month: moment(this.dateStart).format('MM'),
        monthString: moment(this.dateStart).format('MMM'),
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
  }

  var format = function() {

//check to see if a div with the id month exists
//if not, make it and append item
// else append item

    events.forEach( function(element) {
      var thisMonth = element.monthString.toLowerCase();
      // console.log('"' + element.monthString.toLowerCase() + '"');

      if ( document.getElementById(thisMonth) === null ) {
        console.log('I do not exist!', element.monthString);
        $('#date-list').append('<div class="month-group" id="' + thisMonth + '"><h3>' + element.monthString + '</h3><br><ul class="festival-list"><li class="item"><strong>' + element.name + '</strong><br><span class="date">' + element.dateStart + ' - ' + element.dateEnd
          + '<span><br>' + element.city + '</li> <a href="' + element.url + '">' + element.url + '</a>' );
      } else {
      $('#' + thisMonth + ' .festival-list').append('<li class="item"><strong>' + element.name + '</strong><br><span class="date">' + element.dateStart + ' - ' + element.dateEnd
      + '<span><br>' + element.city + '</li> <a href="' + element.url + '">' + element.url + '</a>' )
    };
  });
}

  $('#date-sort a').click(function (e) {
    e.preventDefault();
    $('#map-list').hide();
    $('#date-list').show();
  });

  $('#map-sort a').click(function (e) {
    e.preventDefault();
    $('#date-list').hide();
    $('#map-list').show();
  });
});
