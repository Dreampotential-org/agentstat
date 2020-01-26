
function init() {
    load_agent();
}

function currencyFormat(num) {
  return '$' + num.toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
}

function passBtnID(id) {

  id_arr = id.split('-')
  agent_list_id = id_arr[id_arr.length - 1];

  api_call_url = 'agent-list-note/' + agent_list_id + '/';

  settings = get_settings(api_call_url, 'GET');
  $.ajax(settings).done(function (response) {
    var response_data = JSON.parse(response);
    // console.log(msg);
    $('#note-' + agent_list_id).val(response_data['note']);
    $('#agent-' + agent_list_id).val(response_data['agent']);

  }).fail(function(err) {
    console.log(err);
  });

  $('form').each(function () {
    this.reset()
  });

  $('.fidout').fadeOut('slow');
  $('#' + id).fadeIn('slow');

}

function load_agent() {
  const urlParams = new URLSearchParams(window.location.search)
  var agent_id =  urlParams.get('agent_id');
  var city =  urlParams.get('city');

  if (agent_id) {
    $(".claim_profile").attr("href", "/signup.html?agent_id=" + agent_id)
  }


  var api_call_url = 'agents/' + agent_id + '/';
  if(city !== null) {
    api_call_url += '?city=' + city;
  }

  settings = get_settings(api_call_url, 'GET');

  settings['headers'] = null;

  $.ajax(settings).done(function (response) {
    data = JSON.parse(response);
    $('.agent_name').val(data['agent_name']);
    $.each($('.agent_name'), function() { $(this).html(data['full_name']) });
    var name_city = data['full_name'] + ' - ' + data['city'];

    if(city !== null) {
      $('#city-tab').text(city);
    }

    $.each(data['agent_lists'], function(k, v) {
      $(`<tr>
        <td class='status-`+ v['status'] +`'>` + v['status'] +`</td>
        <td>` + currencyFormat(v['list_price_int']) +`</td>
        <td>` + currencyFormat(v['sold_price_int']) +`</td>
        <td>` + v['days_on_market'] +`</td>
        <td>` + v['list_date'] +`</td>
        <td>` + v['address_text'] +`</td>
        <td>` + v['year_built'] +`</td>
        <td>` + v['city'] +`</td>
        <td>` + v['home_type'] +`</td>
        <td> <button class="btn btn-primary" data-rel="add-public-note-`+ v['id'] +`" onclick="passBtnID('add-public-note-`+ v['id']+ `')" value="1" title="notes"><i class="fa fa-plus" aria-hidden="true"></i> Note</button> </td>
      </tr>

      <tr class="fidout" id="add-public-note-`+ v['id'] +`" style="display: none">
        <td colspan="10">
          <div class="form-group">
            <input type="hidden" id="agent-`+ v['id'] +`"value="`+ v['agent_id']+ `">
            <button type="button" class="btn btn-success notebtn" data-id="`+ v['id'] +`" style="float:left;margin-bottom:5px">Save</button>
            <label><strong>Add Public Note</strong></label>
            <a href="#" class="closeform" style="float:right;margin-bottom:5px"><i class="fa fa-close"></i></a>
            <textarea class="public-note-text form-control" id="note-`+ v['id'] +`" rows="5" name="public-note" ></textarea>
          </div>
          </td>
      </tr>`).insertAfter(".table-heading");
    });

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

window.addEventListener("DOMContentLoaded", init, false);
