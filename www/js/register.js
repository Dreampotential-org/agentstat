
function clean_text(text) {
  text = text.substr(0,1).toUpperCase()+text.substr(1);
  return text.replace('_', ' ');
}

function create_agent() {
  var data = {};
  data['email'] = $('#email').val()
  data['password'] = $('#password').val()
  data['phone_number'] = $('#phone_number').val()
  data['full_name'] = $('#full_name').val()
  console.log(data);

  settings = get_settings('create-agent/', 'POST', JSON.stringify(data))
  settings['headers'] = {};
  console.log(settings);

  if(data['password'] == '' || data['password'] != $('#re-password').val()) {
    $('.msg').html('Passwords don\'t match')
    $('.msg').css("display", "block");

    return false;
  }

  $.ajax(settings).done(function (response) {
    var msg = JSON.parse(response);
    console.log(msg);
    console.log(msg['token']);
    localStorage.session_id = msg['token'];
    window.location = '/form.html';
  }).fail(function(err) {
    arr = JSON.parse(err['responseText']);
    error = "<ul>";
    $.each(arr, function(k, v) {
      error += "<li>" + clean_text(k) + ": " + v + "</li>";
    });
    error += "</ul>";

    $('.msg').html(error)
    $('.msg').css("display", "block");
  });
}

$(document).on('change click', '#signup-btn', function() {
  create_agent();
});
