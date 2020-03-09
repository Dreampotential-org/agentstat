session_id = localStorage.getItem('session_id');
email = localStorage.getItem('email');
if(session_id === null || email === null) {
  window.location = 'file:///C:/xampp/htdocs/agentstat%2005-02-2020/latest_new/agentstat/www/login.html';
}