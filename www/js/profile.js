var profile_id = null;
var data_map = [
  'first_name', 'last_name', 'phone_number', 'email', 'screen_name',
  'brokerage_name', 'city', 'state', 'zipcode', 'buyer_rebate', 'listing_fee',
  'provide_cma', 'about_me', 'type_of_listing_service'
];

function get_profile(callback) {
  call_api(callback, 'agent-profile/');
}

function get_combo(callback, end_point) {
  call_api(callback, end_point + '/');
}


function display_profile(profile) {
  //console.log(profile);
  $('#first_name').val(profile.first_name);
  $('#last_name').val(profile.last_name);
  $('#email').val(profile.email);
  $('#screen_name').val(profile.screen_name);
  $('#profile_slug').text(profile.screen_name);
  $('#brokerage_name').val(profile.brokerage_name);
  $('#brokerage_address').val(profile.brokerage_address);
  $('#city').val(profile.city);
  $('#state').val(profile.state);
  $('#zipcode').val(profile.zipcode);
  profile_id = profile.id;

  if (profile.phone_number !== null) {
    $('#phone_number_1').val(profile.phone_number.substring(0, 3));
    $('#phone_number_2').val(profile.phone_number.substring(3, 6));
    $('#phone_number_3').val(profile.phone_number.substring(6, 10));
  }

  if (profile.screen_name === null && profile.connector != '' && profile.connector !== null) {
    var screen_name = profile.connector.agent_name.replace(/\s/g, '-').toLowerCase();
    $('#screen_name').val(screen_name);
    $('#profile_slug').html(screen_name)
  } else {
    $('#screen_name').val(profile.screen_name);
  }

  get_specilities(profile.specialties);

  $.each(profile.licenses, function(k, val) {
    $("#added-license").append(`
        <div class="fragment" >
          <input value="` + val + `" type="text" name="mytext[]" class="license_number" disabled style="width: 150px;">
            <button type="button" class='remove-license'><i class="fa fa-times"></i></button> 
        </div>`);
  });

  if (profile.buyer_rebate !== null) {
    $('#buyer_rebate').val(profile.buyer_rebate);
    $('#buyer_rebate_checkbox').prop('checked', true);
  } else {
    $('#buyer_rebate_checkbox').prop('checked', false);
    $('#buyer_rebate').prop('disabled', true);
  }

  if (profile.type_of_listing_service !== null) {
    $('#type_of_listing_service').val(profile.type_of_listing_service);
    $('#type_of_listing_service_checkbox').prop('checked', true);
  } else {
    $('#type_of_listing_service_checkbox').prop('checked', false);
    $('#type_of_listing_service').prop('disabled', true);
  }

  if (profile.listing_fee !== null) {
    $('#listing_fee').val(profile.listing_fee);
    $('#listing_fee_checkbox').prop('checked', true);
  } else {
    $('#listing_fee_checkbox').prop('checked', false);
    $('#listing_fee').prop('disabled', true);
  }

  // $('#buyer_rebate').val(profile.buyer_rebate);


  $('#listing_fee').val(profile.listing_fee);
  // $('#type_of_listing_service').val(profile.type_of_listing_service);

  $('#provide_cma').prop('checked', profile.provide_cma);
  $('#about_me').val(profile.about_me);

  if(profile.picture != '' && profile.picture !== null ) {
    console.log(profile.picture);
    // debugger;
    $('#profile-img').prop('src', profile.picture);
  }else{

    src="img/blank-profile-picture.png"
    $('#profile-img').prop('src', src);
    console.log("src" ,src)
  }

  if (profile.connector != '' && profile.connector !== null) {
    
    var res = profile.connector.agent_name.split(" ");
    $('#first_name').val(res[0]);
    $('#last_name').val(res[1]);
    $("#first_name").prop("disabled", true);
    $("#last_name").prop("disabled", true);




    $('#agent-connector').html(`
      <a target='_blank' href='/page-three.html?agent_id=` + profile.connector.id + `'>` + profile.connector.agent_name + `</a> |
      <a id='connector-remove'
        data-id='` + profile.connector.id +`'  href=''
        onclick='return false;'>Remove</a>
    `);
  } else {
    $('#agent-connector').html(`
      <a href='/connect-profile.html' target='_blank'>Add new connection</a>
    `);
  }

  get_languages(profile.language_fluencies);
  get_reviews();

}


function get_reviews() {
  settings = get_settings('review/' + profile_id + '/', 'GET');

  $.ajax(settings).done(function (response) {
      var response = JSON.parse(response);
      console.log(response);

      $.each(response, function(k, v) {
        console.log(k, v);
        console.log(v.full_name);
        formatted_date = v.date.split('T')[0].split('-')
        formatted_date = formatted_date[1] + '-' + formatted_date[2] + '-' + formatted_date[0];

        d = new Date(v.date);
        $('.owl-carousel').trigger(
          'add.owl.carousel', [`
          <div class="item">
            <div class="item-slide text-center">
                <button><span><i class="fas fa-times"></i></span></button>
                <p>` + v.full_name + ` - ` + formatted_date +`</p>
                <span>
                ` + v.review + `
                </span>
            </div>
          </div>`]
        ).trigger('refresh.owl.carousel');

      });
  }).fail(function(err) {
      // alert('Got err');
      console.log(err);
  });
}

function phonenumber_validate(inputtxt) {
  var phoneno = /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/;

  if(inputtxt.match(phoneno)) {
    return true;
  }
  else {
    return false;
  }
}

function update_profile() {
  var data = {};
  var valid = true;
  var validation_messages = '';

  $.each(data_map, function(k, val) {
    data[val] = $('#'+val).val();
  });

  $.each(combo_boxes, function(k, val) {
    val = val.split('-').join('_')
    checkbox_id = '#' + val + '_checkbox'
    console.log(checkbox_id);
    console.log(val);

    checked_val = $(checkbox_id).prop('checked');
    if (!checked_val) {
      data[val] = '';
    }
  });

  var phone_number_concate =  $('#phone_number_1').val()+$('#phone_number_2').val()+$('#phone_number_3').val();
  if (phonenumber_validate(phone_number_concate) === false) {
    validation_messages += 'Invalid phone number.';
    valid = false;
  }

  if (valid === false) {

    show_message(validation_messages);
    return false
  }

  data['phone_number'] = phone_number_concate;


  // licences
  data['licenses'] = $('.license_number').map(
    function() { return $(this).val() }
  ).get();

  data['licenses'] = data['licenses'].filter(function(v){return v!==''});


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
          $('#validate-message').css('display', 'none');

          var msg = JSON.parse(response);

          show_message('Your profile has been saved.');

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
          $('#validate-message').css('display', 'none');

          var msg = JSON.parse(response);

          show_message('Your profile has been saved.');
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

function get_specilities(specialty_ids) {
  settings = get_settings('specialty/', 'GET')

  $.ajax(settings).done(function (response) {
      var response = JSON.parse(response);
      $.each(response, function(k, v) {
        checked = '';
        if ($.inArray(v.id, specialty_ids) !== -1) {
          checked = ' checked ';
        }

        $('#specialties').append(`
        <div class='col-lg-6 col-6'>
          <div class='year-wrapper-check-one'>
          <input type='checkbox' ` + checked + ` value='`+ v.id +`' class='specialty-checkbox' id='specialty-` + v.id + `'>
          <label for='specialty-`+ v.id + `'>` + v.val + `</label>
        </div>
        </div>
        `);
      });
  }).fail(function(err) {
      // alert('Got err');
      console.log(err);
  });

}

function get_languages(language_ids) {
  console.log(language_ids);
  settings = get_settings('language-fluency', 'GET')
  $.ajax(settings).done(function (language_list) {

    var language_list = JSON.parse(language_list);
    console.log(language_list);
    var ix = 0;

    $.each(language_list, function(k, v) {
      checked = '';
      if ($.inArray( v.id, language_ids) !== -1) {
        checked = ' checked ';
      }

      ix++;
      if (ix < 7) {
        $('#languages').append(`<div class='col-lg-6 col-6'>

          <div class='lar-left'>
          <input class='lng-checkbox' ` + checked + ` value='` + v.id + `' id='lang-` + v.id + `' type='checkbox' >
          <label for='lang-` + v.id + `'>` + v.val + `</label>
          </div>
        </div>

        `);
      } else {
        $('#morelanguages').append(`
        <div class='col-lg-6 col-6'>
          <div class='lar-left'>
          <input class='lng-checkbox' ` + checked + ` value='` + v.id + `' id='lang-` + v.id + `' type='checkbox' >
          <label for='lang-` + v.id + `'>` + v.val + `</label>
          </div>
      </div>
      `);
      }


    });
  }).fail(function(err) {
    // alert('Got err');
    console.log(err);
  });

  // $.ajax(settings).done(function (response) {

  //     var response = JSON.parse(response);
  //     console.log(response);
  //     $.each(response, function(k, v) {
  //       console.log(v.id, v.val);
  //       $('#languages').append(`<div class='col-lg-3 col-6'>
  //         <div class='lar-left'>
  //         <input class='lng-checkbox' value='` + v.id + `' id='lang-` + v.id + `' type='checkbox' >
  //         <label for='lang-` + v.id + `'>` + v.val + `</label>
  //         </div>
  //       </div>
  //       `);
  //     });
  //   }).fail(function(err) {
  //     // alert('Got err');
  //     console.log(err);
  //   });
}

combo_boxes = ['listing-fee', 'buyer-rebate', 'type-of-listing-service'];

$.each(combo_boxes, function(k, val){
  get_combo(function(resp) { load_combo(resp, val) }, val);
});


get_profile(function(resp) { display_profile(resp) });


$(document).on('change click', '.submit_btn', function() {
  update_profile();
});

$(document).on('change click', '#connector-remove', function() {
  settings = get_settings('agent-connector', 'DELETE')

  $.ajax(settings).done(function (response) {
      var msg = JSON.parse(response);
      $('#agent-connector').html('<a href="/connect-profile.html" target="_blank">Add new connection</a>');
  }).fail(function(err) {
      // alert('Got err');
      console.log(err);
      show_error(err);
  });
});


$('.combo-checkboxes:checkbox').change(function () {
  target_id = $(this).attr('target');
  checked_value = $(this).prop('checked');
  console.log(checked_value);

  if(checked_value) {
    $('#' + target_id).prop('disabled', false);
  } else {
    console.log(target_id);
    $('#' + target_id).prop('disabled', 'disabled');
  }

});

$('#screen_name').keyup(function () {
  $('#profile_slug').html($('#screen_name').val());
  $('#verify-spinner').hide();
  $('#verify-ok').hide();
  $('#verify-not').hide();
});

$(document).on('change click', '#review-add-btn', function() {
  var data = {};
  data['full_name'] = $('#review-name').val();
  data['email'] = $('#review-email').val();
  data['review'] = $('#review').val();

  review_date = new Date($('#review-date').val());
  data['date'] = review_date.toJSON();


  settings = get_settings('review/' + profile_id + '/', 'POST', JSON.stringify(data))

  $.ajax(settings).done(function (response) {
    var msg = JSON.parse(response);
    console.log(msg);
    $('#review-msg').html('Review has been added!');

    swal({
      icon: "success",
    });


  }).fail(function(err) {
      console.log(err);
      // show_error(err);
      $('#review-msg').html(err)
  });
});


$(document).on('change click', '.swal-button--confirm', function() {
  window.location.href = "/form.html#reviews";
  location.reload();
});

$(document).on('click', '#verify_slug', function() {

  if ($('#screen_name').val() === '') {
    show_message('Enter Screen Name');
    return false;
  }

  $('#verify-spinner').show();
  $('#verify-ok').hide();
  $('#verify-not').hide();

  var screen_name = $('#screen_name').val();
  settings = get_settings('screen-name-available/' + screen_name, 'GET');

  $.ajax(settings).done(function (response) {
    var response = JSON.parse(response);
    if (response.available) {
      $('#verify-spinner').hide();
      $('#verify-ok').show();
      $('#verify-not').hide();
    } else {
      $('#verify-spinner').hide();
      $('#verify-ok').hide();
      $('#verify-not').show();
    }
  }).fail(function(err) {
      console.log(err);
      $('#verify-spinner').hide();
      $('#verify-ok').hide();
      $('#verify-not').hide();
  });
});


function show_message(message) {
    swal(message, {
      buttons: false,
      timer: 3000,
    });
}

$("#add-license").click(function(){
  if ($('#license_no_1').val() == '' || $('#license_no_2').val() == '' || $('#phone_number_1').val() == '') {
    var validation_messages = 'Invalid license number.';
    show_message(validation_messages);
    return false
  }

  var val = $('#license_no_1').val()+' '+$('#license_no_2').val()+' - '+$('#license_no_3').val(); 
  $("#added-license").append(`
      <div class="fragment" >
        <input value="` + val + `" type="text" name="mytext[]" class="license_number" disabled style="width: 150px;">
        <button type="button" class='remove-license'><i class="fa fa-times"></i></button> 
      </div>`);
});

$('#added-license').on("click", ".remove-license",function(){
  $(this).parent('div').remove();
})
