function set_referral() {
  var data = {
    'by_agent': '5714'
  }
  settings = get_settings('set-referral/', 'POST', JSON.stringify(data))
  $.ajax(settings).done(function (response) {
    var msg = JSON.parse(response);
    // console.log(msg);
    console.log(msg['token']);
    localStorage.session_id = msg['token'];
    //window.location = '/profile-settings/';
  }).fail(function(err) {
    alert(err);
    show_error(err);
    console.log(err);
  });

}
