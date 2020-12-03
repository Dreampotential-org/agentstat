function set_referral() {
  var data = {
    'agent_sn': 'joycejuntunen'
  }
  settings = get_settings('set-referral/', 'POST', JSON.stringify(data))
  $.ajax(settings).done(function (response) {
    var msg = JSON.parse(response);
    // console.log(msg);
    //window.location = '/profile-settings/';
  }).fail(function(err) {
    alert(err);
    show_error(err);
    console.log(err);
  });

}
