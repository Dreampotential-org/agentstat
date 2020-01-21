$(document).ready(function(){
  session_id = localStorage.getItem('session_id');
  email = localStorage.getItem('email');
  if(session_id === null || email === null) {
    window.location = '/login.html';
  }

  call_api(
    function(res) {
      $('#profile-views').text(res['profile_views']);
      $('.agent-name').text(res['first_name'] + ' '  + res['last_name']);
    }, 'agent-profile/');
});
