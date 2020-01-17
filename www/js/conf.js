// API_URL = 'https://app.agentstat.com/api/';
API_URL = 'http://localhost:8000/api/';


function clean_text(text) {
  text = text.substr(0,1).toUpperCase()+text.substr(1);
  return text.replace('_', ' ');
}

function show_error(err) {
  arr = JSON.parse(err['responseText']);
  error = "<ul>";
  $.each(arr, function(k, v) {
    error += "<li>" + clean_text(k) + ": " + v + "</li>";
  });
  error += "</ul>";

  $('.msg').html(error)
  $('.msg').css("display", "block");
  console.log(err);
}

function get_settings(url, method, data=null) {
  return {
    'async': true,
    'crossDomain': true,
    'headers': {
      'Authorization': 'Token ' + localStorage.getItem('session_id'),
    },
    'url': API_URL + url,
    'method': method,
    'processData': false,
    'data': data,
    'contentType': 'application/json',
    'mimeType': 'multipart/form-data',
  }
}

function call_api(callback, url, settings) {
  settings = get_settings(url, 'GET');

  $.ajax(settings).done(function (response) {
      var msg = JSON.parse(response);
      callback(msg);
  }).fail(function(err) {
      alert('Got err');
  });
}

