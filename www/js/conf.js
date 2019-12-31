API_URL = 'https://app.agentstat.com/api/';
// API_URL = 'http://localhost:8000/api/';



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

