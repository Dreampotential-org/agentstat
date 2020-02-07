function init() {

  session_id = localStorage.getItem('session_id');
  email = localStorage.getItem('email');
  if(session_id === null || email === null) {
    window.location = '/login.html';
  }

  load_states()
  init_events_connect()
}

function init_events_connect() {
  $("body").delegate("#select_agent", "click", function(e) {
    $("#set_agent").removeAttr("disabled")
  })

  $("body").delegate("#set_agent", "click", function(e) {
    connector_id = $("input[name='select-agent']:checked").val();
    claim_api(connector_id);
  })

  $("body").delegate("#search", "click", function(e) {
    $("#set_agent").attr("disabled", "disabled")
    var state = $("#state").val()
    var agent_name = $("#full_name").val()
    var api_call_url = 'reports/' + state + '/?agent_name=' + agent_name;
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
  return (
    "<a target='_blank' href='" + profile_link + "'>" +
      "<input type='radio' name='select-agent' value=" +
          agent['agent_id'] + ">" + agent['agent_full_name'] +
      "<br>" +
    "</a>"
  )
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

window.addEventListener("DOMContentLoaded", init, false);
