var agent_id = null
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
  $('#first_name').val(profile.first_name);
  $('#last_name').val(profile.last_name);
  $('#email').val(profile.email);
  $('#screen_name').val(profile.screen_name);
  $('#profile_slug').text(profile.state + '/' + profile.screen_name);
  $('#brokerage_name').val(profile.brokerage_name);
  $('#brokerage_address').val(profile.brokerage_address);
  $('#city').val(profile.city);
  $('#state').val(profile.state);
  $('#zipcode').val(profile.zipcode);
  $('#years_in_bussiness').val(profile.years_in_bussiness);

  $('#website').val(profile.website);
  $('#blog').val(profile.blog);
  $('#facebook').val(profile.facebook);
  $('#twitter').val(profile.twitter);
  $('#linkedid').val(profile.linkedin);
  $('#other-speciality-text').val(profile.other_speciality_note);

  agent_id = null;
  try {
    if (profile.connector.id !== undefined) {
      agent_id = profile.connector.id;
    }
  } catch(err) { }

  if (profile.phone_number !== null) {
    $('#phone_number_1').val(profile.phone_number.substring(0, 3));
    $('#phone_number_2').val(profile.phone_number.substring(3, 6));
    $('#phone_number_3').val(profile.phone_number.substring(6, 10));
  }

  if (profile.screen_name === null && profile.connector != '' && profile.connector !== null) {
    var screen_name = profile.connector.agent_name.replace(/\s/g, '').toLowerCase();
    $('#screen_name').val(screen_name);
    $('#profile_slug').html(profile.state.toLowerCase() + '/' + screen_name)
  } else {
    $('#screen_name').val(profile.screen_name);
  }

  get_specilities(profile.specialties);

  if (profile.connector.real_estate_licence !== null && profile.connector.real_estate_licence != '') {
    $("#added-license").append(`
    <div class="fragment" >
      <input value="` + profile.connector.real_estate_licence + `" type="text" name="mytext[]" data-type="zillow" class="license_number" disabled style="width: 150px;">
    </div>`);
  }

  $.each(profile.licenses, function (k, val) {
    add_license(val);
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

  if (profile.picture != '' && profile.picture !== null) {
    // debugger;
    $('.my-image').attr('src', profile.picture)
    $('#remove-profile-image').css('display', 'block')
    // $('.my-image').prop('src', profile.picture);
    // $upload_crop = $('.my-image').croppie(
    //   {
    //     enableExif: true,
    //     viewport: {
    //       width: 200,
    //       height: 200,
    //       type: 'circle'
    //     },
    //     boundary: { width: 300, height: 300 },
    //   }
    // )
    // $upload_crop.croppie('result', {
    //   type: 'canvas',
    //   size: 'viewport'
    // }).then(function (resp) {
    //   $('.cropped-image').val(resp)
    //   console.log($('.cropped-image').val())
    // })
    // $('.up-photo').append('<button id="remove-profile-image" class="inline-btn">remove profile image</button>');
  } else {
    src = "/img/blank-profile-picture.png"
    $('.my-image').prop('src', src);

  }

  if (profile.connector != '' && profile.connector !== null) {

    var res = profile.connector.agent_name.split(" ");
    $('#first_name').val(res[0]);
    $('#last_name').val(res[1]);
    $("#first_name").prop("disabled", true);
    $("#last_name").prop("disabled", true);



    if (profile.screen_name && profile.state) {
      profile_url = '/profile/' + profile.state.toLowerCase() + '/' + profile.screen_name;
    } else {
      profile_url = '/page-three.html?agent_id=' + profile.connector.id;
    }

    // $('#agent-connector').html(`
    //   <a target='_blank' href='` + profile_url + `'>` + profile.connector.agent_name + `</a> |
    //   <a id='connector-remove'
    //     data-id='` + profile.connector.id + `'  href=''
    //     onclick='return false;'>Remove</a>
    // `);

    $('#agent-connector').html(`
      <a target='_blank' href='` + profile_url + `'>` + profile.connector.agent_name + `</a>
    `);
  } else {
    $('#agent-connector').html(`
      <a href='/connect-profile.html' target='_blank'>Add new connection</a>
    `);
  }

  get_languages(profile.language_fluencies);
  get_reviews();
}

function importZillowReviews() {
  settings = get_settings('sync-zillow-review/', 'GET');

  $.ajax(settings).done(function (response) {
    var response = JSON.parse(response);
    show_message('Success! Please allow 24 hours for your leads to imports.', 10000);
    $('#import-review').attr("disabled", "disabled");
  }).fail(function (err) {
    console.log(err);
  });
}

$(document).ready(function(){
  $('#import-review').on('click',function(){
      bootbox.confirm({
          message: "I authorize agentstat.com to screenshot and sync my reviews from my public zillow profile to be displayed on my agentstat.com profile.",
          buttons: {
              cancel: {
                  label: 'Cancel',
                  className: 'btn-default'
              },
              confirm: {
                  label: 'Import',
                  className: 'btn-success'
              }
          },
          callback: function (result) {
              if (result===true) {
                  importZillowReviews();         
              }
          }
      });
  });
});

function get_reviews() {
  settings = get_settings('review/' + agent_id + '/', 'GET');
  $.ajax(settings).done(function (response) {
    var response = JSON.parse(response);
    if (response.allow_sync == true) {
        $('#import-review').show();
    } else if (response.allow_sync == false) {
        agent_review(response['reviews'], 3);
    }
  }).fail(function (err) {
    console.log(err);
  });
}

function get_allStates() {
  var states = null
  $.ajax({
    url: 'https://app.agentstat.com/api/states/',
    async: false,
    success: function (response) {
      states = response
    }
  })
  return states
}
function phonenumber_validate(inputtxt) {
  var phoneno = /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/;

  if (inputtxt.match(phoneno)) {
    return true;
  }
  else {
    return false;
  }
}


$(document).on('click', '#image_save', function () {
  // Save Image Only 
  $('#save_image_loading').css('display', 'inline-block')
  $('#image_save_btn').attr('disabled', 'true')
  var picture_data = $('#upload')[0].files[0]
  if (picture_data != null) {
    $upload_crop.croppie('result', {
      type: 'base64',
      size: {width:'500', height:'500'},
      quality: 1
    }).then(function (resp) {
      var data = {}
      data['picture'] = resp;
      settings = get_settings('agent-profile/', 'PUT', JSON.stringify(data))
      $.ajax(settings).done(function (response) {
        show_message('Your profile Image has been saved.');
        $('.croppie-container').remove()
        $upload_crop = null
        $('#image_upload_div').append('<img class="my-image" style="width:100%" src="" />')
        $('.my-image').attr('src', data['picture']);
        $('#upload').val('')
        $('#remove-profile-image').css('display', 'block')
        $('#image_save').css('display', 'none')
        $('.fileinput-name').html('')

        $('#save_image_loading').css('display', 'none')
        $('.image_save_btn').removeAttr('disabled')
      })
    })
  }


})
function update_profile() {
  //Show Loading Icon and Disable Submit Button
  $('#submit_loading').css('display', 'inline-block')
  $('.submit_btn').attr('disabled', 'true')

  var data = {};
  var valid = true;
  var validation_messages = '';

  $.each(data_map, function (k, val) {
    data[val] = $('#' + val).val();
  });

  $.each(combo_boxes, function (k, val) {
    val = val.split('-').join('_')
    checkbox_id = '#' + val + '_checkbox'

    checked_val = $(checkbox_id).prop('checked');
    if (!checked_val) {
      data[val] = '';
    }
  });

  var phone_number_concate = $('#phone_number_1').val() + $('#phone_number_2').val() + $('#phone_number_3').val();
  if (phonenumber_validate(phone_number_concate) === false) {
    validation_messages += 'Invalid phone number. \n Allow Format: 123-456-7890';
    valid = false;
  }

  if (valid === false) {

    show_message(validation_messages);
    return false
  }

  data['phone_number'] = phone_number_concate;


  // licences
  data['licenses'] = $('.license_number').map(
    function () { 
      if ($(this).data('type') != 'zillow') {
        return $(this).val();
      }
    }
  ).get();
  data['licenses'] = data['licenses'].filter(function (v) { return v !== '' });

  // fluent languages
  data['language_fluencies'] = $('.lng-checkbox:checked').map(
    function () { return $(this).val() }
  ).get();

  data['specialties'] = $('.specialty-checkbox:checked').map(
    function () { return $(this).val() }
  ).get();
  data['other_speciality_note'] = $('#other-speciality-text').val()
  data['years_in_bussiness'] = $('#years_in_bussiness').val();

  data['website'] = formatURL($('#website').val());
  data['blog'] = formatURL($('#blog').val());

  data['facebook'] = formatURL($('#facebook').val());
  data['twitter'] = formatURL($('#twitter').val());
  data['Linkedin'] = formatURL($('#Linkedin').val());

  var picture_data = $('#upload')[0].files[0]
  var reader = new FileReader();
  var picture_base64 = '';
  if (picture_data != null) {
    reader.readAsDataURL(picture_data);
    reader.onload = function () {
      picture_base64 = reader.result;
      $upload_crop.croppie('result', {
        type: 'base64',
        size: "original",
        quality: 1
      }).then(function (resp) {

        data['picture'] = resp;

        settings = get_settings('agent-profile/', 'PUT', JSON.stringify(data))

        $.ajax(settings).done(function (response) {
          $('#validate-message').css('display', 'none');

          var msg = JSON.parse(response);

          //Hide Loading Icon and Enable Submit Button
          $('#submit_loading').css('display', 'none')
          $('.submit_btn').removeAttr('disabled', 'false')


          show_message('Your profile has been saved.');

          $('.croppie-container').remove()
          $upload_crop = null
          $('#image_upload_div').append('<img class="my-image" style="width:100%" src="" />')
          $('.my-image').attr('src', data['picture']);
          $('#upload').val('')
          $('#remove-profile-image').css('display', 'block')
          $('#image_save').css('display', 'none')
          $('.fileinput-name').html('')
        }).fail(function (err) {
          // alert('Got err');

          //Hide Loading Icon and Enable Submit Button
          $('#submit_loading').css('display', 'none')
          $('.submit_btn').removeAttr('disabled', 'false')
          $('#image_save').css('display', 'none')
          console.log(err)
          show_error(err);

        });
      })

    };
    reader.onerror = function (error) {
      console.log('Error: ', error);
    };
  } else {
    settings = get_settings('agent-profile/', 'PUT', JSON.stringify(data))

    $.ajax(settings).done(function (response) {
      //Hide Loading Icon and Enable Submit Button
      $('#submit_loading').css('display', 'none')
      $('.submit_btn').removeAttr('disabled', 'none')

      $('#validate-message').css('display', 'none');

      var msg = JSON.parse(response);

      show_message('Your profile has been saved.');
    }).fail(function (err) {
      //Hide Loading Icon and Enable Submit Button
      $('#submit_loading').css('display', 'none')
      $('.submit_btn').removeAttr('disabled', 'false')

      // alert('Got err');
      show_error(err);
    });
  }


}

function load_combo(data, combo) {
  $.each(data, function (key, val) {
    combo = combo.split('-').join('_')
    $('#' + combo).append(new Option(val['val'], val['id']));
  });
}

function get_specilities(specialty_ids) {
  settings = get_settings('specialty/', 'GET')

  $.ajax(settings).done(function (response) {
    var response = JSON.parse(response);
    $.each(response, function (k, v) {
      checked = '';
      if ($.inArray(v.id, specialty_ids) !== -1) {
        checked = ' checked ';
      }
      if ((v.id == '6') && (checked == ' checked ')) {
        $('#other-speciality-text').css('display', 'block')
      }
      $('#specialties').append(`
        <div class='col-lg-6 col-6'>
          <div class='year-wrapper-check-one'>
          <input type='checkbox' ` + checked + ` value='` + v.id + `' class='specialty-checkbox' id='specialty-` + v.id + `'>
          <label for='specialty-`+ v.id + `'>` + v.val + `</label>
        </div>
        </div>
        `);

    });
  }).fail(function (err) {
    // alert('Got err');
    console.log(err);
  });

}

// ONLY Four Specialities Can be Checked
$(document).on('change', '.specialty-checkbox', function () {
  var current = $(this)
  if (current.is(':checked') == true) {
    var nchecked = 0
    $('.specialty-checkbox').each(function () {
      if ($(this).is(':checked') == true) {
        nchecked += 1
      }
    })
    if (nchecked > 4) {
      alert('atmost four specialities can be checked at a time.')
      current.prop("checked", false)
    }
  }
})
$(document).on('change', '.specialty-checkbox', function () {
  if ($(this).attr('id') == 'specialty-6') {
    if ($(this).is(':checked')) {
      $('#other-speciality-text').css('display', 'block')
    }
    else {
      $('#other-speciality-text').css('display', 'none')
      $('#other-speciality-text').val('')
    }
  }
})
function get_languages(language_ids) {
  settings = get_settings('language-fluency', 'GET')
  $.ajax(settings).done(function (language_list) {

    var language_list = JSON.parse(language_list);
    var ix = 0;

    $.each(language_list, function (k, v) {
      checked = '';
      if ($.inArray(v.id, language_ids) !== -1) {
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
  }).fail(function (err) {
    // alert('Got err');
    console.log(err);
  });

}

combo_boxes = ['listing-fee', 'buyer-rebate', 'type-of-listing-service'];

$.each(combo_boxes, function (k, val) {
  get_combo(function (resp) { load_combo(resp, val) }, val);
});

if (localStorage.getItem('session_id')) {
  get_profile(function (resp) { display_profile(resp) });
} else {
  window.location = '/login.html';
}


$(document).on('change click', '.submit_btn', function () {
  update_profile();
});

$(document).on('change click', '#connector-remove', function () {
  settings = get_settings('agent-connector', 'DELETE')

  $.ajax(settings).done(function (response) {
    var msg = JSON.parse(response);
    $('#agent-connector').html('<a href="/connect-profile.html" target="_blank">Add new connection</a>');
  }).fail(function (err) {
    // alert('Got err');
    console.log(err);
    show_error(err);
  });
});


$('.combo-checkboxes:checkbox').change(function () {
  target_id = $(this).attr('target');
  checked_value = $(this).prop('checked');

  if (checked_value) {
    $('#' + target_id).prop('disabled', false);
  } else {
    $('#' + target_id).prop('disabled', 'disabled');
  }

});

$('#screen_name').keyup(function () {
  $('#profile_slug').html($('#screen_name').val());
  $('#verify-spinner').hide();
  $('#verify-ok').hide();
  $('#verify-not').hide();
});

$(document).ready(function () {
  var options = {
    max_value: 5,
    step_size: 0.5,
  }
  $('#license_no_3').datepicker({ format: 'mm-dd-yyyy' })

  // SET ALL STATES
  var states = get_allStates()
  Object.keys(states).forEach(function (key) {
    $('#license_no_2').append('<option value = ' + key + '>' + key + '</option>')
    $('#state').append('<option value = ' + key + '>' + key + '</option>')
  });



  settings = get_settings('review-category', '');

  $.ajax(settings).done(function (response) {
    var msg = JSON.parse(response);
    $.each(msg['results'], function (k, v) {
      if (v.extra_info == null) {
        extra_info = '';
      } else {
        extra_info = v.extra_info;
      }

      // $("#rating-category-" + v.id).rate(options);
      $('#category-' + v.id).append(
        v.category + ` ` + extra_info
      );
    });

  }).fail(function (err) {
    console.log(err);
    // show_error(err);
    $('#review-msg').html(err)
  });


});

$(document).on('change click', '#review-add-btn', function () {
  var data = {};
  data['full_name'] = $('#review-name').val();
  data['email'] = $('#review-email').val();
  data['review'] = $('#review').val();
  data['categories'] = [];

  var count = 0;
  var rateTotal = 0;
  $('.rating').each(function () {
    category_id = $(this).attr('id').split('-')[2]
    rate = $(this).rate('getValue');
    data['categories'].push({ 'id': category_id, 'rate': rate });

    rateTotal = rateTotal + parseFloat(rate);
    count++;
  });

  var avgRate = rateTotal / count;
  data['rating'] = avgRate.toFixed(1);
  // data['rate'] = $(".rating").rate("getValue");

  review_date = new Date($('#review-date').val());
  data['date'] = review_date.toJSON();

  settings = get_settings('review/' + agent_id + '/', 'POST', JSON.stringify(data))

  $.ajax(settings).done(function (response) {
    var msg = JSON.parse(response);
    console.log(msg);
    $('#review-msg').html('Review has been added!');

    swal({
      icon: "success",
    });


  }).fail(function (err) {
    console.log(err);
    // show_error(err);
    $('#review-msg').html(err)
  });
});


$(document).on('change click', '.swal-button--confirm', function () {
  window.location.href = "/profile-settings/#reviews";
  location.reload();
});

$(document).on('click', '#verify_slug', function () {

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
  }).fail(function (err) {
    console.log(err);
    $('#verify-spinner').hide();
    $('#verify-ok').hide();
    $('#verify-not').hide();
  });
});


function show_message(message, duration=3000) {
  swal(message, {
    buttons: false,
    timer: duration,
  });
}

function check_license(license) {
  data = {}
  data['license'] = license
  error = false;

  settings = get_settings('check-license/', 'POST', JSON.stringify(data));

  $.ajax(settings).done(function (response) {
    var response = JSON.parse(response);
    if (response['status'] == true) {
      show_message('License number already claimed')
      // return false;
      error = true;
    } else {
      add_license(license);
      $('#license_no_1').val('');
      $('#license_no_2').val('');
      $('#license_no_3').val('');
    }
    console.log(response);
    // error = false;
  }).fail(function (err) {
    console.log(err);
  });

  return error;

}

function add_license(val) {
  $("#added-license").append(`
      <div class="fragment" >
        <input value="` + val + `" type="text" name="mytext[]" class="license_number" disabled style="width: 150px;">
        <button type="button" class='remove-license'><i class="fa fa-times"></i></button>
      </div>`);
}

$("#add-license").click(function () {
  if ($('#license_no_1').val() == '' || $('#license_no_2').val() == '' || $('#license_no_3').val() == '') {
    var validation_messages = 'Invalid license number.';
    show_message(validation_messages);
    return false
  }
  var date = new Date($('#license_no_3').val())

  date = date.getMonth() + 1 + '-' + date.getDate() + '-' + date.getFullYear()
  var val = $('#license_no_1').val() + ' ' + $('#license_no_2').val() + ' - ' + date;

  check_license(val);

});

$('#added-license').on("click", ".remove-license", function () {
  $(this).parent('div').remove();
});

$(document).on('click', '.fileinput-clear', function (e) {
  $('#profile-img').attr('src', '');
});

function readURL(input) {
  if (input.files && input.files[0]) {
    var reader = new FileReader();

    reader.onload = function (e) {
      $('#profile-img').attr('src', e.target.result);
    };

    reader.readAsDataURL(input.files[0]);
  }
}


var $upload_crop;


function readImage(input) {
  var reader = new FileReader()
  reader.onload = function (e) {
    $('.my-image').attr('src', e.target.result)
    $upload_crop = $('.my-image').croppie(
      {
        enableExif: true,
        viewport: {
          width: 200,
          height: 200,
          type: 'circle'
        },
        boundary: { width: 300, height: 300 },
      }
    )
  }
  reader.readAsDataURL(input.files[0]);

}
function uploadTrigger(input) {
  if (input.files && input.files[0]) {
    if ($upload_crop != null) {
      $('.croppie-container').remove()
      $upload_crop = null
      $('#image_upload_div').append('<img class="my-image" style="width:100%" src="" />')
    }
    readImage(input)
    $('#remove-profile-image').css('display', 'none')
    $('#image_save').css('display', 'block')
  }
  else {

    $('.croppie-container').remove()
    $upload_crop = null
    $('#image_upload_div').append('<img class="my-image" style="width:100%" src="" />')
    $('.my-image').attr('src', '/img/blank-profile-picture.png');
    console.log("UPLOAD TRIGGER ELSE")
    $('#image_save').css('display', 'none')
  }
}

function readURLtemp(input) {

  if (input.files && input.files[0]) {
    var reader = new FileReader();

    reader.onload = function (e) {
      $('.my-image').attr('src', e.target.result);
      $upload_crop = $('.my-image').croppie(
        {
          enableExif: true,
          viewport: {
            width: 200,
            height: 200,
            type: 'circle'
          },
          boundary: { width: 300, height: 300 },
        }
      )
      $upload_crop.croppie('result', {
        type: 'canvas',
        size: "original",
        quality: 1
      }).then(function (resp) {
        $('.cropped-image').val(resp)
        console.log($('.cropped-image').val())
      })
    };

    reader.readAsDataURL(input.files[0]);
  }
  else {
    $('.croppie-container').remove()
    $upload_crop = null
    $('#image_upload_div').append('<img class="my-image" style="width:100%" src="" />')
    $('.my-image').attr('src', '/img/blank-profile-picture.png');
    $('.cropped-image').val('')
  }
}

$(document).on('click', '#remove-profile-image', function (e) {
  settings = get_settings('remove-profile-image/', 'GET');

  $.ajax(settings).done(function (response) {
    show_message('Profile picture has been removed!');

    src = "/img/blank-profile-picture.png"
    $('.my-image').prop('src', src);
    $('#remove-profile-image').css('display', 'none')
    $('#save_image').css('display', 'none')
  });
});

function formatURL(string) {
  if ((string == null) || (string == '')) return ''
  if (!~string.indexOf("http")) {
    string = "http://" + string;
  }
  console.log(string)
  return string
}


