const urlParams = new URLSearchParams(window.location.search)
var agent_id = urlParams.get('agent_id');

function create_agent() {
  var data = {};
  var has_error = false;

  terms_and_condition = $('#terms_and_condition').val();
  tx_checked = $('#terms_and_condition').is(":checked");
  msg = ''

  fields = ['email', 'password', 'first_name', 'last_name', 'license_number', 'state'];

  $.each(fields, function(k, v) {
    console.log(k, v);
    data[v] = $('#'+v).val();
    if(data[v] === '') {
      $('#'+v).css('border', '2px solid #f00');
      has_error = true;
    }
  });

  if(tx_checked == false) {
    msg += 'Please check Terms of use Privacy Policy.<br>';
  }

  if(has_error == true) {
    msg += 'All fields are required.<br>';
  }


  if(msg !== '') {
    $('#form-msg').css('display', 'block');
    $('#form-msg').html(msg);

    return false
  }
  console.log(data);

  data['full_name'] = data['first_name'] + ' ' + data['last_name']
  if (agent_id !== null) {
    data['agent_connector'] = agent_id;
  }

  settings = get_settings('create-agent/', 'POST', JSON.stringify(data))
  settings['headers'] = {};
  console.log(settings);

  $.ajax(settings).done(function (response) {
    var msg = JSON.parse(response);
    // console.log(msg);
    console.log(msg['token']);
    localStorage.session_id = msg['token'];
    window.location = '/form.html';
  }).fail(function(err) {
    show_error(err);
    console.log(err);
  });
}

$(document).on('change click', '#signup-btn', function() {
  create_agent();
});

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

function init() {
  load_states()
  if (agent_id !== null) {
    console.log(agent_id);
  }
}

window.addEventListener("DOMContentLoaded", init, false);
