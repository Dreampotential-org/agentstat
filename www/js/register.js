

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
    localStorage.email = msg['email'];
  }).fail(function(err) {
    show_error(err);
  });
}

$(document).on('change click', '#signup-btn', function() {
  create_agent();
});
