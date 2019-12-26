// API_URL = "http://54.67.62.45:8001/api/";
API_URL = "http://localhost:8000/api/";

data_map = [
  'first_name', 'last_name', 'phone_number', 'email', 'screen_name',
  'license_number', 'brokerage_name', 'city', 'state', 'zipcode', 'buyer_rebate', 'listing_fee',
  'provide_cma', 'about_me', 'type_of_listing_service'
];


function call_api(callback, url) {
  settings = {
    "async": true,
    "crossDomain": true,
     "headers": {
     "Authorization": "Token " + localStorage.getItem("session_id"),
    },
    "url": API_URL + url,
    "method": "GET",
    "processData": false,
    "contentType": false,
    "mimeType": "multipart/form-data",
  }

  $.ajax(settings).done(function (response) {
      var msg = JSON.parse(response);
      callback(msg);
      //console.log(msg);
  }).fail(function(err) {
      alert("Got err");
  });

}

function get_profile(callback) {
  call_api(callback, 'agent-profile/7/');
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

  $("#provide_cma").prop('checked', profile.provide_cma);
  $('#about_me').val(profile.about_me);
}

function update_profile() {
  var data = {};

  // data_map = ['first_name', 'last_name', 'phone_number'];
  $.each(data_map, function(k, val) {
    data[val] = $('#'+val).val();
  });

  settings = {
    "async": true,
    "crossDomain": true,
     "headers": {
     "Authorization": "Token " + localStorage.getItem("session_id"),
    },
    "url": API_URL + 'agent-profile/7/',
    "method": "PUT",
    "processData": false,
    "contentType": 'application/json',
    "data": JSON.stringify(data),
    "mimeType": "multipart/form-data",
  }

  $.ajax(settings).done(function (response) {
      var msg = JSON.parse(response);
      // callback(msg);
      console.log(msg);
  }).fail(function(err) {
      alert("Got err");
      console.log(err);
  });

  console.log(data);
}

function load_combo(data, combo) {
  // console.log(data, combo);
  $.each(data, function( key, val ) {
    combo = combo.split('-').join('_')
    $("#" + combo).append(new Option(val['val'], val['id']));
  });
}

function get_languages() {
  settings = {
    "async": true,
    "crossDomain": true,
     "headers": {
     "Authorization": "Token " + localStorage.getItem("session_id"),
    },
    "url": API_URL + 'language-fluency/',
    "method": "GET",
    "processData": false,
    "contentType": 'application/json',
    "mimeType": "multipart/form-data",
  }

  $.ajax(settings).done(function (response) {
      var response = JSON.parse(response);
      // callback(msg);
      console.log(response);
    $.each(response, function(k, v) {
      console.log(v.id, v.val);
      $('#languages').append(`<div class="col-lg-3 col-6">
      <div class="lar-left">
        <input id="lang-` + v.id + `" type="checkbox" >
        <label for="lang-` + v.id + `">` + v.val + `</label>
        </div>
      </div>
      `);
    });
  }).fail(function(err) {
      alert("Got err");
      console.log(err);
  });

}

combo_boxes = ['listing-fee', 'buyer-rebate', 'type-of-listing-service'];

$.each(combo_boxes, function(k, val){
  get_combo(function(resp) { load_combo(resp, val) }, val);
});

get_profile(function(resp) { display_profile(resp) });

get_languages()

$(document).on('change click', '.submit_btn', function() {
  update_profile();
});
