settings = get_settings('reports/WA/Seattle/', 'GET');

// Example requests
// reports/WA/Seattle/?duration=12&home_type=SINGLE_FAMILY
var data;
var search_result = '';


$.ajax(settings).done(function (response) {
  data = JSON.parse(response);
  $.each(data, function(k, v) {
    console.log(k);
    console.log(v['agent_full_name']);

    item = search_item.split('[[agent_name]]').join(v['agent_full_name']);
    item = item.split('[[time_duration]]').join(v['time_duration']);
    item = item.split('[[cell_phone]]').join(v['agent_cell_phone']);
    item = item.split('[[cel_phone]]').join(v['agent_cell_phone']);
    item = item.split('[[score]]').join(v['score']);
    item = item.split('[[agent_id]]').join(v['agent_id']);
    item = item.split('[[agent_full_name]]').join(v['agent_full_name']);

    search_result += item;
  });

  $('#page-section').html(search_result);

}).fail(function(err) {
  // alert('Got err');
  $('.msg').html(err['responseText']);
  $('.msg').css("display", "block");
  console.log(err);
});

$(document).on('change click', '.lead-submit', function() {
  var selected_agent_id = $(this).attr('data-id');
  var data = {}
  data['name'] = $('#name-' + selected_agent_id).val();
  data['phone'] = $('#phone-' + selected_agent_id).val();
  data['email'] = $('#email-' + selected_agent_id).val();
  data['agent'] = selected_agent_id;
  data['message'] = $('#message-' + selected_agent_id).val();

  settings = get_settings('lead/', 'POST', JSON.stringify(data));


  $.ajax(settings).done(function (response) {
    var msg = JSON.parse(response);
    console.log(msg);
    $('#msg-'+ selected_agent_id).html('Your message has been sent.');
    // window.location = '/form.html';
  }).fail(function(err) {
    // alert('Got err');
    $('#msg-'+ selected_agent_id).html(err['responseText']);
    $('#msg-' + selected_agent_id).css("display", "block");
    console.log(err);
  });

});


