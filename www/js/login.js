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
    localStorage.email = msg['email'];
    window.location = '/form.html';
  }).fail(function(err) {
    // alert('Got err');
    console.log(err);
    $('.msg-login').html(err['responseText']);
    $('.msg-login').css("display", "block");
    console.log(err);
  });
}

$(document).on('change click', 'input:radio', function() {
  // console.log($(this).val());
  if($(this).val() == 'Industry Professional') {
    $("#category").prop("disabled", false);
  } else {
    $("#category").prop("disabled", true);
  }
})

$(document).on('change click', '#login-btn', function() {
  login();
});

$('#continuebtn1').keydown(function(e) {
  if (e.keyCode == 13) {
    $('#continuebtn1').trigger('click');
  }
});

$('#login-btn').keydown(function(e){
    if (e.keyCode == 13) {
      login();
      return false;
    }
});

$('#continuebtn1').keydown(function(e){
  if (e.keyCode == 13) {
    return false;
  }
})

$(document).on('change click', '#forgot-password', function() {
  email = $('#email').val();
  console.log(email);

  if(email === '' || email === null) {
    $('.msg').html('Email is required.');
    $('.msg').css("display", "block");
  } else {
    var data = {};
    data['email'] = $('#email').val();
    settings = get_settings('forgot-password/', 'POST', JSON.stringify(data));
    settings['headers'] = {};

    $.ajax(settings).done(function (response) {
      var msg = JSON.parse(response);
      console.log(msg);
      $('.msg').html("Email has been sent.");
      $('.msg').css("display", "block");
    }).fail(function(err) {
      $('.msg').html(err['responseText']);
      $('.msg').css("display", "block");
      console.log(err);
    });
  }

});

function getParamUrlValue(key) {
  var url_string = window.location.href;
  var url = new URL(url_string);
  var agent_id = url.searchParams.get(key);
}

$(document).ready(function() {
  var url_string = window.location.href;
  var url = new URL(url_string);
  agent_id = url.searchParams.get('agent_id');
  if(agent_id) {
    $('[href="#nav-profile"]').tab('show');
    $("#category").val("secondoption");
  }
});
