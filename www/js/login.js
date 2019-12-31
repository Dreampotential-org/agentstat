function login() {
  var data = {};
  data['email'] = $('#email').val()
  data['password'] = $('#password').val()
  console.log(data);

  settings = get_settings('login/', 'POST', JSON.stringify(data))
  settings['headers'] = {};
  console.log(settings);

  $.ajax(settings).done(function (response) {
    var msg = JSON.parse(response);
    console.log(msg);
    console.log(msg['token']);
    localStorage.session_id = msg['token'];
    window.location = '/form.html';
  }).fail(function(err) {
    // alert('Got err');
    $('.msg').html(err['responseText']);
    $('.msg').css("display", "block");
    console.log(err);
  });
}

$(document).on('change click', '#login-btn', function() {
  login();
});
