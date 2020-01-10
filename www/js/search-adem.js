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
    item = search_item.replace('[[agent_name]]', v['agent_full_name']);
    item = item.replace('[[time_duration]]', v['time_duration']);
    item = item.replace('[[cel_phone]]', v['agent_cell_phone']);
    item = item.replace('[[cel_phone]]', v['agent_cell_phone']);
    item = item.replace('[[score]]', v['score']);
    search_result += item;
  });

  $('#page-section').html(search_result);

}).fail(function(err) {
  // alert('Got err');
  $('.msg').html(err['responseText']);
  $('.msg').css("display", "block");
  console.log(err);
});


