$( document ).ready(function () {

  // Display status
  $.get('http://0.0.0.0:5001/api/v1/status/', function (data) {
    const result = data.status;
    if(result === 'OK') {
      if(!($('div#api_status').hasClass('available')));
        $('div#api_status').addClass('available');
    } else {
      if($('div#api_status').hasClass('available'));
        $('div#api_status').removeClass('available');
    }
  });

  // collect amenities based on checkbox ticked
  var ameni_dict = {};
    $('.amenities input:checkbox').change(function() {
      // this will contain a reference to the checkbox   
      var $input = $( this );
      var id = $input.attr('data-id');
      var name = $input.attr('data-name');
      if (this.checked) {
        ameni_dict[id] = name;
      } else {
        if (id in ameni_dict) {
          delete ameni_dict[id];
        }
      }
      $('div.amenities h4').empty();

      let entry = $.map(ameni_dict, function (value) {
        return value;
      }).join(', ');

      $('div.amenities h4').text(entry);
    });
 
  // Collect data from state based on checkbox ticked
  var state_dict = {};
  $('.locations .popover li > h2 > input[type="checkbox"]').change(function() {
    var $input = $( this );
      var id = $input.attr('data-id');
      var name = $input.attr('data-name');
      if (this.checked) {
        state_dict[id] = name;
      } else {
        if (id in state_dict) {
          delete state_dict[id];
        }
      }
      const locations = Object.assign({}, state_dict, city_dict);
      if (Object.values(locations).length === 0) {
        $('.locations h4').html('&nbsp;');
      } else {
      $('.locations h4').text(Object.values(locations).join(', '));
      }
  });

 // Collect data from city based on checkbox ticked
  var city_dict = {};
  $('.locations .popover li > ul li > input[type="checkbox"]').change(function() {
    var $input = $( this );
      var id = $input.attr('data-id');
      var name = $input.attr('data-name');
      if (this.checked) {
        city_dict[id] = name;
      } else {
        if (id in city_dict) {
          delete city_dict[id];
        }
      }
      const locations = Object.assign({}, state_dict, city_dict);
      if (Object.values(locations).length === 0) {
        $('.locations h4').html('&nbsp;');
      } else {
      $('.locations h4').text(Object.values(locations).join(', '));
      }
  });



  // Posting amentities data to api
  $('section.filters button').on('click', function () {
    $.ajax({
      url: 'http://0.0.0.0:5001/api/v1/places_search/',
      type: 'POST',
      data: JSON.stringify({ 
	      'state_dict': Object.keys(state_dict), 
	      'city_dict': Object.keys(city_dict), 
	      'ameni_dict': Object.keys(ameni_dict), 
      }),
      contentType: 'application/json',
      dataType: 'json',
      success: function (data) {
	$('section.places').empty();
        $('section.places').append(data.map(place => {
          return `<article>
                    <div class="title">
                      <h2>${place.name}</h2>
                      <div class="price_by_night">
                        ${place.price_by_night}
                      </div>
                    </div>
                    <div class="information">
                      <div class="max_guest">
                        <i class="fa fa-users fa-3x" aria-hidden="true"></i>
                        </br>
                        ${place.max_guest} Guests
                      </div>
                      <div class="number_rooms">
                        <i class="fa fa-bed fa-3x" aria-hidden="true"></i>
                        </br>
                        ${place.number_rooms} Bedrooms
                      </div>
                      <div class="number_bathrooms">
                        <i class="fa fa-bath fa-3x" aria-hidden="true"></I>
                        </br>
                        ${place.number_bathrooms} Bathrooms
                      </div>
                    </div>
                    <div class="description">
                      ${place.description}
                    </div>
                  </article>`;
        }));
      }
    });
  });



});
