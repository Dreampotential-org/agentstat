data_map = [
  'first_name', 'last_name', 'phone_number', 'email', 'screen_name',
  'license_number', 'brokerage_name', 'city', 'state', 'zipcode', 'buyer_rebate', 'listing_fee',
  'provide_cma', 'about_me', 'type_of_listing_service'
];


function get_profile(callback) {
  call_api(callback, 'agent-profile/');
}

function get_combo(callback, end_point) {
  call_api(callback, end_point + '/');
}


function display_profile(profile) {
  // console.log(profile_data);
  $('#first_name').val(profile.first_name);
  $('#last_name').val(profile.last_name);
  $('#phone_number').val(profile.phone_number);
  $('#email').val(profile.email);
  $('#screen_name').val(profile.screen_name);
  $('#profile_slug').text(profile.screen_name);
  $('#license_number').val(profile.license_number);
  $('#brokerage_name').val(profile.brokerage_name);
  $('#brokerage_address').val(profile.brokerage_address);
  $('#city').val(profile.city);
  $('#state').val(profile.state);
  $('#zipcode').val(profile.zipcode);

  $('#buyer_rebate').val(profile.buyer_rebate);
  $('#listing_fee').val(profile.listing_fee);
  $('#type_of_listing_service').val(profile.type_of_listing_service);

  $('#provide_cma').prop('checked', profile.provide_cma);
  $('#about_me').val(profile.about_me);

  if(profile.picture != '' && profile.pictue !== null) {
    console.log(profile.picture);
    $('#profile-img').prop('src', profile.picture);
  }

  // console.log(profile.language_fluencies);
  get_languages();
  $.each(profile.language_fluencies, function(k, lang_id) {
    $('#lang-' + lang_id).prop('checked', true);
  });

  $.each(profile.specialty, function(k, specialty_id) {
    $('#specialty-'+specialty_id).prop('checked', true);
  });
}

function update_profile() {
  var data = {};

  $.each(data_map, function(k, val) {
    data[val] = $('#'+val).val();
  });

  // fluent languages
  data['language_fluencies'] = $('.lng-checkbox:checked').map(
    function() { return $(this).val() }
  ).get();

  data['specialties'] = $('.specialty-checkbox:checked').map(
    function() { return $(this).val() }
  ).get();

  var picture_data = $('#picture')[0].files[0]
  var reader = new FileReader();
  var picture_base64 = '';

  if (picture_data != null) {
    reader.readAsDataURL(picture_data);
    reader.onload = function () {
      console.log(reader.result);
      picture_base64 = reader.result;
      data['picture'] = picture_base64;
      settings = get_settings('agent-profile/', 'PUT', JSON.stringify(data))

      $.ajax(settings).done(function (response) {
          var msg = JSON.parse(response);
      }).fail(function(err) {
          // alert('Got err');
          console.log(err);
          show_error(err);
      });

    };
    reader.onerror = function (error) {
     console.log('Error: ', error);
    };
  } else {
      settings = get_settings('agent-profile/', 'PUT', JSON.stringify(data))

      $.ajax(settings).done(function (response) {
          var msg = JSON.parse(response);
      }).fail(function(err) {
          // alert('Got err');
          show_error(err);
      });
  }


}

function load_combo(data, combo) {
  // console.log(data, combo);
  $.each(data, function( key, val ) {
    combo = combo.split('-').join('_')
    $('#' + combo).append(new Option(val['val'], val['id']));
  });
}

function get_specilities() {
  settings = get_settings('specialty/', 'GET')
  $.ajax(settings).done(function (response) {
      var response = JSON.parse(response);
      $.each(response, function(k, v) {
        console.log(v.id, v.val);
        $('#specialties').append(`<div class='year-wrapper-check-one'>
          <input type='checkbox' value='`+ v.id +`' class='specialty-checkbox' id='specialty-` + v.id + `'>
          <label for='specialty-`+ v.id + `'>` + v.val + `</label>
        </div>
        `);
      });
  }).fail(function(err) {
      // alert('Got err');
      console.log(err);
  });

}

function get_languages() {
  settings = get_settings('language-fluency', 'GET')

  $.ajax(settings).done(function (response) {
      var response = JSON.parse(response);
      console.log(response);
      $.each(response, function(k, v) {
        console.log(v.id, v.val);
        $('#languages').append(`<div class='col-lg-3 col-6'>
          <div class='lar-left'>
          <input class='lng-checkbox' value='` + v.id + `' id='lang-` + v.id + `' type='checkbox' >
          <label for='lang-` + v.id + `'>` + v.val + `</label>
          </div>
        </div>
        `);
      });
    }).fail(function(err) {
      // alert('Got err');
      console.log(err);
    });
}

combo_boxes = ['listing-fee', 'buyer-rebate', 'type-of-listing-service'];

$.each(combo_boxes, function(k, val){
  get_combo(function(resp) { load_combo(resp, val) }, val);
});

get_specilities();

get_profile(function(resp) { display_profile(resp) });


$(document).on('change click', '.submit_btn', function() {
  update_profile();
});

