$(document).ready(function() {

  var events = [];

  $.getJSON( "data/festivals.json", function( data ) {

    $.each( data, function() {
      events.push({
        name: this.name,
        url: this.url,
        city: this.city,
        dateStart: this.dateStart,
        dateEnd: this.dateEnd,
        datesCertain: this.datesCertain,
        type: this.type,
        desc: this.desc
      });

      $('.festival-list').append('<li><strong>' + this.name + '</strong><br><span class="date">' + this.dateStart + ' - ' + this.dateEnd
        + '<span><br>' + this.city + '</li> <a href="' + this.url + '">' + this.url + '</a>' );
    });
  });

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
