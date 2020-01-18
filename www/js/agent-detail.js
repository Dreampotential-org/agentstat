
function init() {
    load_agent();
}

function currencyFormat(num) {
  return '$' + num.toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
}

function load_agent() {
  const urlParams = new URLSearchParams(window.location.search)
  var agent_id =  urlParams.get('agent_id')

  settings = get_settings('agents/' + agent_id, 'GET');
  settings['headers'] = null;

  $.ajax(settings).done(function (response) {
    data = JSON.parse(response);
    console.log(data);
    $('.agent_name').val(data['agent_name']);
    $.each($('.agent_name'), function() { $(this).html(data['full_name']) });
    var name_city = data['full_name'] + ' - ' + data['city'];

    $.each($('.agent_name_city'), function() { $(this).html( name_city )});

    console.log(data['city']);
    // console.log(data['agent_lists']);
    $.each(data['agent_lists'], function(k, v) {
      $(`<tr>
        <td>` + v['status'] +`</td>
        <td>` + currencyFormat(v['list_price_int']) +`</td>
        <td>` + currencyFormat(v['sold_price_int']) +`</td>
        <td>` + v['days_on_market'] +`</td>
        <td>` + v['list_date'] +`</td>
        <td>` + v['address_text'] +`</td>
        <td>` + v['year_built'] +`</td>
        <td>` + v['city'] +`</td>
        <td>` + v['home_type'] +`</td>
        <td> Note </td>
      </tr>`).insertAfter("#transations");
    })

  }).fail(function(err){
    console.log(err);
  });
}

$(document).on('change click', '.how_soon li>a', function() {
  var leads = {
    'how_soon_sell': $(this).text()
  }
  localStorage.setItem('leads', JSON.stringify(leads));

  $('#leads-step-one').css('display', 'None');
  $('#leads-step-two').css('display', 'block');

});

$(document).on('change click', '.why_interest li>a', function() {
  var data = JSON.parse(localStorage.getItem('leads'));
  data['interest_reason'] = $(this).text();

  localStorage.setItem('leads', JSON.stringify(data));

  $('#leads-step-two').css('display', 'none');
  $('#leads-step-three').css('display', 'block');

  localStorage.setItem('leads', JSON.stringify(data));

  console.log('tests');

});

$(document).on('change click', '#lead-submit', function() {
  const urlParams = new URLSearchParams(window.location.search)
  var agent_id =  urlParams.get('agent_id')
  var data = {};

  data = JSON.parse(localStorage.getItem('leads'));

  data['email'] = $('#lead_email').val();
  data['name'] = $('#lead_name').val();
  data['phone'] = $('#lead_phone').val();
  data['agent'] = agent_id;

  if (data['email'] === '' || data['name'] === '' || data['phone'] === '') {
    console.log('All fields are required.');
    $('.msg').html('All fields are required');
    return false;
  }

  localStorage.setItem('leads', JSON.stringify(data));

  settings = get_settings('lead/', 'POST', JSON.stringify(data));
  settings['headers'] = null;

  $.ajax(settings).done(function (response) {

    var msg = JSON.parse(response);
    $('#leads-step-three').css('display', 'none');
    $('#leads-step-four').css('display', 'block');

  }).fail(function(err) {

    $('.msg').html(err['responseText']);
    console.log(err);

  });
});


window.addEventListener("DOMContentLoaded", init, false);
