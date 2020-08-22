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
          window.location = '/profile-settings/';

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
      claim_api(connector_id);
    } else {
      connector_id = $("input[name='claim-agent']:checked").val();
      // dispute_profile(connector_id)
      show_claim_screen();
    }
  })

  $("body").delegate("#search", "click", function(e) {
    $("#set_agent").attr("disabled", "disabled")
    var state = $("#state").val()
    var agent_name = $("#full_name").val()
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
        "<input type='radio' name='claim-agent'>" + agent['agent_full_name']+ ' - ' + brokerage_name + ' (Claimed)' +
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

$(document).on('click', '#already_claim_profile', function () {
  $('#want-claim').css('display', 'none');
  $('#submit-proof-form').css('display', 'block');
});

$(document).on('click', '#want-claim-yes', function () {
  $('#want-claim').css('display', 'none');
  $('#submit-proof-form').css('display', 'block');
});

window.addEventListener("DOMContentLoaded", init, false);
