
function init() {
    is_loggon();
    load_agent();

    load_states();
}

function currencyFormat(num) {
  return '$' + num.toFixed(0).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
}


function load_agent() {
  const urlParams = new URLSearchParams(window.location.search)
  var agent_id =  urlParams.get('agent_id');
  var city =  urlParams.get('city');

  if (agent_id) {
    $(".claim_profile").attr("href", "/signup.html?agent_id=" + agent_id)
  }


  var api_call_url = 'transactions/';
  if(city !== null) {
    api_call_url += '?city=' + city;
  }
  settings = get_settings(api_call_url, 'GET');

  $.ajax(settings).done(function (response) {
    data = JSON.parse(response);
    $('.agent_name').val(data['agent_name']);
    $.each($('.agent_name'), function() { $(this).html(data['full_name']) });
    var name_city = data['full_name'] + ' - ' + data['city'];

    if(city !== null) {
      $('#city-tab').text(city);
    }

    populate_transaction(data['agent_lists']);
    
  }).fail(function(err){
    console.log(err);
  });
}



$(document).on('change click', '.closeform', function() {
  $(this).closest('tr').fadeOut('slow');
});

$(document).on('change click', '.notebtn', function(){
  data_id = $(this).attr('data-id');
  // console.log($('#note-' + data_id).val());

  data = {}
  data['agent_list'] = data_id;
  data['note'] = $('#note-'+data_id).val();
  data['agent_profile_id'] = localStorage.getItem('profile_id');
  console.log(data);

  api_call_url = 'agent-list-note/' + agent_list_id + '/';

  settings = get_settings(api_call_url, 'POST', JSON.stringify(data));
  settings['headers'] = null;

  $.ajax(settings).done(function (response) {

    var msg = JSON.parse(response);
    console.log(msg);

  }).fail(function(err) {

    console.log(err);

  });
});

$(document).on('change click', '#save-transaction', function(){
  data = {}
  data['address_text'] = $('#address_text').val()
  data['city'] = $('#city').val()
  data['state'] = $('#state').val()
  data['zipcode'] = $('#zipcode').val()
  data['home_type'] = $('#home_type').val()
  data['list_date'] = $('#list_date').val()
  data['sold_date'] = $('#sold_date').val()
  data['list_price_int'] = $('#list_price_int').val()
  data['sold_price_int'] = $('#sold_price_int').val()
  data['represented'] = $('#inputState').val()
  data['beds'] = $('#beds').val()
  data['baths'] = $('#baths').val()
  data['record_type'] = 'agentstat';
  data['record_status'] = 'pending';

  var completeAddr = data['address_text']+', '+data['city']+', '+data['state']+', '+data['zipcode'];
  var coordinates = getCoordinates(completeAddr);
  
  data['latitude'] = coordinates.lat;
  data['longitude'] = coordinates.lng;

  api_call_url = 'create-transaction/';
  settings = get_settings(api_call_url, 'POST', JSON.stringify(data));
  $.ajax(settings).done(function (response) {
    var msg = JSON.parse(response);
    $("#transaction-msg").css('display', 'block');
    setInterval(location.reload(true), 3000);
  }).fail(function(err) {
    console.log(err);
  });
});

$(document).ready(function() {
  $('#list_date').datepicker({
    format: 'mm/dd/yy',
    autoclose: true,
  });
  $('#sold_date').datepicker({
    format: 'mm/dd/yy',
    autoclose: true,
  });
});

window.addEventListener("DOMContentLoaded", init, false);
