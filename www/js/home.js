is_loggon();



settings = get_settings('profile/', 'GET');
$.ajax(settings).done(function (response) {

  var data = JSON.parse(response);
  $('#profile-views').html(data['profile_view']);
  $('.agent-name').html(data['full_name']);

}).fail(function(err) {

  console.log(err);

});
