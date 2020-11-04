var signupType = window.location.pathname.split('/')[2];

var urlParams = new URLSearchParams(window.location.search);
var status = urlParams.get('status');
if (status=='noagent') {
    $('#noagent-error').show();
}

function init() {

  // session_id = localStorage.getItem('session_id');
  // email = localStorage.getItem('email');
  // if(session_id === null || email === null) {
  //   window.location = '/login.html';
  // }

  load_states()
  init_events_connect()
}

function show_claim_screen() {
    swal({
      title: "Profile already claimed!",
      text: "Do you want to dispute the claim and provide proof of identity?",
      icon: "warning",
      buttons: [
        'No, cancel it!',
        'Yes, I am sure!'
      ],
      dangerMode: true,
    }).then(function(isConfirm) {
      if (isConfirm) {

        $('#alreadyClaimedModal').modal('show');

      } else {
        // swal("Cancelled", "Your imaginary file is safe :)", "error");
      }
    });

}


$('#submit_proof_btn').click(function() {
  var form_data = {};
  var picture_data = $('#picture')[0].files[0]
  var real_estate_license = $('#real-estate-license')[0].files[0]

  var reader = new FileReader();
  reader.readAsDataURL(picture_data);

  var reader2 = new FileReader();
  reader2.readAsDataURL(real_estate_license);
  var picture_base64 = '';



    reader.onload = function () {

      reader2.onload = function() {
        real_estate_license_base64 = reader2.result;
      }

      picture_base64 = reader.result;
      form_data['id_picture'] = picture_base64;
      form_data['real_estate_license'] = picture_base64;
      form_data['full_name'] = $('#full_name').val();
      form_data['email'] = $('#email').val();
      form_data['brokerage_name'] = $('#brokerage-name').val();
      form_data['agent_profile_connector'] = connector_id;
      form_data['dispute_web_agent'] = localStorage.getItem("web_agent_id");

      settings = get_settings('re-claim/', 'POST', JSON.stringify(form_data))
      settings['headers'] = null;

      $.ajax(settings).done(function (response) {

          $('#alreadyClaimedModal').modal('toggle');
          swal({
            title: "Claim Profile!",
            text: "We will review your dispute and get back to you within 48 hours",
            icon: "success",
          }).then(function(isConfirm) {
          });
      }).fail(function(err) {
          // alert('Got err');
          console.log(err);
          show_error(err);
      });
    };
    reader.onerror = function (error) {
     console.log('Error: ', error);
    };
});


function init_events_connect() {
  $("body").delegate("#select_agent", "click", function(e) {
    $("#set_agent").removeAttr("disabled")
  })

  $("body").delegate("#set_agent", "click", function(e) {
    connector_id = $("input[name='select-agent']:checked").val();
    if(typeof connector_id != 'undefined') {
      if (localStorage.getItem('session_id')) {
        claim_api(connector_id);
      } else if (signupType == 'facebook') {
        window.location = API_URL+'social-login/facebook/'+connector_id+'/';
      } else {
        window.location = API_URL+'social-login/google/'+connector_id+'/';
      }
      
    } else {
      connector_id = $("input[name='claim-agent']:checked").val();
      // dispute_profile(connector_id)
      show_claim_screen();
    }

    console.log(connector_id);
    return false;
  })

  $("body").delegate("#search", "click", function(e) {
    $("#set_agent").attr("disabled", "disabled")
    var state = $("#state").val()
    var agent_name = $("#agent_name").val()
    var api_call_url = 'reports/' + state + '/?agent_name=' + agent_name + '&check_claimed=True';
    var settings = get_settings(api_call_url, 'GET');
    settings['headers'] = null;

    var data;
    var results;
    var search_result = '';

    $.ajax(settings).done(function (response) {
      $("#select_agent").empty()
      data = JSON.parse(response);
      results = data['results'];

      $.each(results, function(k, v) {
        $("#select_agent").append(get_agent_html(v))
      });
    });
  })
}

function get_agent_html(agent) {
  console.log(agent)
  var profile_link = '/page-three.html?agent_id=' + agent['agent_id']
  var link = ''

  var brokerage_name = agent['agent_brokerage_info'].split(/\r?\n/)[0];
  if ((agent['claimed'])) {
    link = (
      "<a target='_blank' href='" + profile_link + "'>" +
        "<input type='radio' name='claim-agent' value='"+agent['agent_id']+"'>" + agent['agent_full_name']+ ' - ' + brokerage_name + ' (Claimed)' +
        "<br>" +
      "</a>"
    );
  } else {
    link = (
      "<a target='_blank' href='" + profile_link + "'>" +
        "<input type='radio' name='select-agent' value=" +
            agent['agent_id'] + ">" + agent['agent_full_name'] + ' - ' + brokerage_name +
        "<br>" +
      "</a>"
    );
  }

  return link
}


function load_states() {
  settings = get_settings('states/', 'GET');
  settings['headers'] = {};

  $.ajax(settings).done(function (response) {
    var states = JSON.parse(response);
    $.each(states, function(k, v) {
      $('#state').append(`<option value='`+ k +`'>`+ v +`</option>`);
    });
  }).fail(function(err) {
    show_error(err);
  });
}

$(document).on('click', '#request-btn', function () {
    $('#request-error').hide();
    $('#request-msg').hide();
    $('#request-spinner').hide();
    $('#request-check').hide();

    var fields = ['request_name', 'request_email', 'request_phone', 'request_brokerage_name',
        'request_license', 'request_street_address', 'request_city', 'request_zipcode'];

    var check = true;
    $.each(fields, function(k, v){
        if ($('#'+v).val() == '') {
            $('#request-error').show();
            $('#request-error').html('All field are required');
            check = false;
        }
    });

    if (check) {
        $('#request-spinner').show();

        var data = {};
        data['name'] = $('#request_name').val();
        data['email'] = $('#request_email').val();
        data['phone'] = $('#request_phone').val();
        data['brokerage_name'] = $('#request_brokerage_name').val();
        data['license'] = $('#request_license').val();
        data['street_address'] = $('#request_street_address').val();
        data['city'] = $('#request_city').val();
        data['state'] = $('#request_state').val();
        data['zip_code'] = $('#request_zipcode').val();

        settings = get_settings('agent-request/', 'POST', JSON.stringify(data));
        settings['headers'] = null;
        $.ajax(settings).done(function (response) {
            $('#request-spinner').hide();
            $('#request-check').show();
            $('#request-msg').show();

            $.each(fields, function(k, v){
                $('#'+v).val('');
            });
            $('#request_state').val('WA');
        }).fail(function (err) {
            $('#request-error').html(err['responseText']);
            $('#request-error').show();

            $('#request-spinner').hide();
            $('#request-check').hide(); 
        });
    }
    
});

$(document).on('click', '#already_claim_profile', function () {
    $('#want-claim').css('display', 'none');
    $('#submit-proof-form').css('display', 'block');
});

$(document).on('click', '#want-claim-yes', function () {
    if (localStorage.getItem('session_id')) {
        $('#want-claim').css('display', 'none');
        $('#submit-proof-form').css('display', 'block');
        localStorage.claimed_agent_id = null;
    } else {
        localStorage.claimed_agent_id = connector_id;
        window.location = API_URL+'social-login/'+signupType+'/'+connector_id+'/dispute/';
    }
    
});

$("#request_phone").inputmask({ "mask": "(999) 999-9999" });

window.addEventListener("DOMContentLoaded", init, false);
