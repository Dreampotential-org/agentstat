var signupType = window.location.pathname.split('/')[2];



function init_redirect() {
    var claim_agent_id = localStorage.getItem("claim_agent_id")
    if (claim_agent_id) {
        claim_api(claim_agent_id)
    }
}


function init_connect_agent() {

  init_redirect();

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

function init_events_connect() {
  $("body").delegate("#select_agent", "click", function(e) {
    $("#set_agent").removeAttr("disabled")
  })

$("body").delegate("#set_agent", "click", function(e) {
    if (localStorage.getItem('agent_id') == '' || localStorage.getItem('agent_id', 'null') == 'null') {
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
    } else {
        swal({
            title: "Error!",
            text: "You have already claimed a profile and cannot claim more than one.",
            icon: "error",
        });
    }
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
  if(agent['pg_agent_screen_name']) {
    profile_link = '/profile/' + agent['pg_agent_screen_name'];
  } else {
    profile_link = '/profile/' + agent['agent_slug'];
  }
  var link = ''

  var brokerage_name = agent['agent_brokerage_info'].split(/\r?\n/)[0];
  if ((agent['claimed'])) {
    link = (
      "<a  target='_blank' href='" + profile_link + "'>" +
        "<input style='height: 20px; width: 20px;' type='radio' name='claim-agent' value='"+agent['agent_id']+"'>" + agent['agent_full_name']+ ' - ' + brokerage_name + ' (Claimed)' +
        "<br>" +
      "</a>"
    );
  } else {
    link = (
      "<a target='_blank' href='" + profile_link + "'>" +
        "<input style='height: 20px; width: 20px;' type='radio' name='select-agent' value=" +
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

$(document).ready(function(){
    if (localStorage.getItem("agent_id")) {
	  // so the person their settings page
	///window.location.href = '/profile-settings/'
    }
    //Render dispute-form
    $.get('/_dispute-form.html', function(response){
        $('#dispute-form').html(response);
        $("#dispute_phone").inputmask({ "mask": "(999) 999-9999" });
    });

    $("#request_phone").inputmask({ "mask": "(999) 999-9999" });
    $("#request_license").inputmask("*{0,}");

});



window.addEventListener("DOMContentLoaded", init_connect_agent, false);
