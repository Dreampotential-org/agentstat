
function init() {
    is_loggon();
    load_agent();

    load_states();
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

    console.log(data['agent_lists']);
    console.log("HERE",data['agent_lists']['description']);
            if(data['agent_lists']['description'] == undefined){
              $.each(data['agent_lists'], function(k, v) {
              if (currencyFormat(v['sold_price_int']) >= currencyFormat(v['list_price_int'])) {
                var arrowStyle = ' <i class="fa fa-long-arrow-up" style="font-size:18px;color:green"></i>';
            } else {
                var arrowStyle = ' <i class="fa fa-long-arrow-down" style="font-size:18px;color:red"></i>';
            }
            if (v['year_built'] < '2') {
                var note = `<a  onclick="passBtnID('add-public-note-` + v['id'] + `')" value="1" title="notes"><i class="fa fa-sticky-note-o" style="font-size:27px; color: green;"></i></a>`;
            } else {
                var note = `<i class="fa fa-sticky-note-o" style="font-size:27px; color: green;"></i>`;
            }
            $(`<tr>
            <td class='status-`+ v['status'] +`'>` + v['status'] +`</td>
            <td>` + currencyFormat(v['list_price_int']) + `</td>
            <td>` + currencyFormat(v['sold_price_int']) + arrowStyle +`</td>
            <td>` + v['days_on_market'] + arrowStyle +`</td>
            <td>` + v['list_date'] +`</td>
            <td>` + v['address_text'] +`</td>
            <td>` + v['year_built'] +`</td>
            <td>` + v['city'] +`</td>
            <td>` + v['home_type'] +`</td>
            <!--<td> <button class="btn btn-primary" data-rel="add-public-note-`+ v['id'] +`" onclick="passBtnID('add-public-note-`+ v['id']+ `')" value="1" title="notes"><i class="fa fa-plus" aria-hidden="true"></i> Note</button> </td> -->
    
            <td ><button class="btn " style="background: #CFE2F3;color:black;border: 1px solid;" data-rel="add-public-note-`+ v['id'] +`" onclick="passBtnID('add-public-note-`+ v['id']+ `')" value="1" title="notes">Add public note</button> </td>
          </tr>
    
          <tr class="fidout" id="add-public-note-`+ v['id'] +`" style="display: none; background: white;">
            <td colspan="10" style="padding: 6px 13px; color:gray">
              <div class="form-group">
                <!-- <input type="hidden" id="agent-`+ v['id'] +`"value="`+ v['agent_id']+ `">
                <button type="button" class="btn btn-success notebtn" data-id="`+ v['id'] +`" style="float:left;margin-bottom:5px">Save</button>
                <label><strong>Add Public Note</strong></label>
                <a href="#" class="closeform" style="float:right;margin-bottom:5px"><i class="fa fa-close"></i></a>
                <textarea class="public-note-text form-control" id="note-`+ v['id'] +`" rows="5" name="public-note" ></textarea>-->
    
                
                <div  class="closeform" onclick="closeBtnID('add-public-note-` + v['id'] + `')" style="float:right;margin-bottom:5px"><i class="fa fa-close" style="color: #0896fb;"></i></div>
                <textarea placeholder="Add your note/explanation of sale here.This will be visible to the public." class="public-note-text form-control" id="note-` + v['id'] + `" rows="2" name="public-note" style="border:none !important" ></textarea>
                <button type="button" class="btn btn-success notebtn" data-id="`+ v['id'] +`" style="float:right;margin-bottom:5px;margin-top:10px">Save</button>
                </div>
            </td>
          </tr>
    
            `).insertAfter(".table-heading");
        });
        }
            else{

    $.each(data['agent_lists'], function(k, v) {
      if (currencyFormat(v['sold_price_int']) >= currencyFormat(v['list_price_int'])) {
        var arrowStyle = ' <i class="fa fa-long-arrow-up" style="font-size:18px;color:green"></i>';
    } else {
        var arrowStyle = ' <i class="fa fa-long-arrow-down" style="font-size:18px;color:red"></i>';
    }
    if (v['year_built'] < '2') {
        var note = `<a  onclick="passBtnID('add-public-note-` + v['id'] + `')" value="1" title="notes"><i class="fa fa-sticky-note-o" style="font-size:27px; color: green;"></i></a>`;
    } else {
        var note = `<i class="fa fa-sticky-note-o" style="font-size:27px; color: green;"></i>`;
    }

      $(`<tr>
        <td class='status-`+ v['status'] +`'>` + v['status'] +`</td>
        <td>` + currencyFormat(v['list_price_int']) + `</td>
        <td>` + currencyFormat(v['sold_price_int']) + arrowStyle +`</td>
        <td>` + v['days_on_market'] + arrowStyle +`</td>
        <td>` + v['list_date'] +`</td>
        <td>` + v['address_text'] +`</td>
        <td>` + v['year_built'] +`</td>
        <td>` + v['city'] +`</td>
        <td>` + v['home_type'] +`</td>
        <!--<td> <button class="btn btn-primary" data-rel="add-public-note-`+ v['id'] +`" onclick="passBtnID('add-public-note-`+ v['id']+ `')" value="1" title="notes"><i class="fa fa-plus" aria-hidden="true"></i> Note</button> </td> -->

        <td ><button class="btn " style="background: #CFE2F3;color:black;border: 1px solid;" data-rel="add-public-note-`+ v['id'] +`" onclick="passBtnID('add-public-note-`+ v['id']+ `')" value="1" title="notes">Add public note</button> </td>
      </tr>

      <tr class="fidout" id="add-public-note-`+ v['id'] +`" style="display: none; background: lightgray;">
        <td colspan="10" style="padding: 6px 13px; color:gray">
          <div class="form-group">
            <!-- <input type="hidden" id="agent-`+ v['id'] +`"value="`+ v['agent_id']+ `">
            <button type="button" class="btn btn-success notebtn" data-id="`+ v['id'] +`" style="float:left;margin-bottom:5px">Save</button>
            <label><strong>Add Public Note</strong></label>
            <a href="#" class="closeform" style="float:right;margin-bottom:5px"><i class="fa fa-close"></i></a>
            <textarea class="public-note-text form-control" id="note-`+ v['id'] +`" rows="5" name="public-note" ></textarea>-->

            <button type="button" class="btn btn-success notebtn" data-id="`+ v['id'] +`" style="float:left;margin-bottom:5px">Save</button>
            <div  class="closeform" onclick="closeBtnID('add-public-note-` + v['id'] + `')" style="float:right;margin-bottom:5px"><i class="fa fa-close" style="color: #0896fb;"></i></div>
            <textarea class="public-note-text form-control" id="note-` + v['id'] + `" rows="2" name="public-note" readonly></textarea>
          </div>
          <div class="text-left" title_color>
          ` + v['address_text'] +`
          <table style="width:100%">
            <tr>
             <!-- <td width:20%>-->
             <td style="width:35%;border:none !important">
                <table style="width:100%">
                    <tr>
                        <td style='text-align: left;padding: 5px 10px;color: gray; border:none'>
                          <strong style='color:black'>Listed:</strong> <br><br>
                          ` + v['list_date'] +` <br>
                          ` + currencyFormat(v['list_price_int']) +`
                        </td>
                        <td style='padding: 5px 10px;color: gray;border:none'>
                          <strong style='color:black'>Sold:</strong> <br><br>
                          ` + v['sold_date'] +` <br>
                          ` + currencyFormat(v['sold_price_int']) +`
                        </td>
                    </tr>
                    <tr>
                      <td colspan=2 style='text-align: left;padding: 5px 10px;color: gray;'>
                      <strong style='color:black'>Days on market:</strong> ` + v['days_on_market']+ ` <br>
                      </td>
                    </tr>
                  </table>
                </td>
                <td style="width:5%;border-left: 2px solid #B1B1B4 !important;border: none;"></td>
                <td style="width:60%">
                  <table style="width:100%">
                      <tr>
                       <!-- <td style="text-align:left;">
                          <strong>Type:</strong> ` + v['home_type'] + ` <br>
                          <strong>Beds:</strong> ` + v['beds']+ ` <br>
                          <strong>Baths:</strong> ` + v['baths']+ ` <br>
                          <strong>Sqft:</strong> ` + v['sqft']+ ` <br>
                          <strong>Year Built:</strong> ` + v['year_built']+ ` <br>
                          <strong>State:</strong> ` + v['state']+ ` <br>
                        </td>
                        <td style="text-align:left; ">
                          <strong>Heating:</strong> ` + v['heating'] + ` <br>
                          <strong>Cooling:</strong> ` + v['cooling'] + ` <br>
                          <strong>Parking:</strong> ` + v['parking'] + ` <br>
                          <strong>Basement:</strong> ` + v['basement'] + ` <br>
                          <strong>Flooring:</strong> ` + v['flooring'] + ` <br>
                          <strong>Roof:</strong> ` + v['roof'] + ` <br>
                          <strong>Foundation:</strong> ` + v['foundation'] + ` <br>
                        </td> -->
                        <td  style="padding:0px;border:none">
                            <strong style='color:black'>Type</strong>
                        </td>
                    
                        <td  style="padding:0px;border:none">
                            ` + v['home_type'] + `
                        </td>
                        <td style="border:none"></td>
                        <td style="padding:0px;font-size: 16px;border:none">
                            <strong style='color:black'>Heating</strong>
                        </td>
                        <td style="padding:0px;border:none">
                            Forced Air
                        </td>

                    </tr>
                    <tr>
                        <td style="padding:0px;border:none">
                            <strong style='color:black'>Beds</strong>
                        </td>
                        <td  style="padding:0px;border:none">
                            ` + v['beds'] + `
                        </td>
                        <td style="border:none" ></td>
                        <td style="padding:0px ;font-size: 16px;border:none">
                        <strong style='color:black'>Cooling</strong>
                            
                        </td>
                        <td  style="padding:0px;border:none">
                            None
                        </td>
                    </tr>
                    <tr>
                        <td  style="padding:0px;border:none">
                            <strong style='color:black'>Baths</strong>
                        </td>
                        <td  style="padding:0px;border:none">
                            ` + v['baths'] + `
                        </td>
                        <td style="border:none"></td>
                        <td style="padding:0px ;font-size: 16px;border:none">
                        <strong style='color:black'>Parking</strong>
                        </td>
                        <td style="padding:0px;border:none">
                          Attached Garage
                        </td>
                    </tr>
                    <tr>
                        <td  style="padding:0px;border:none">
                            <strong style='color:black'>Sqft</strong>
                        </td>
                        <td  style="padding:0px;border:none">
                            1,550
                        </td>
                        <td style="border:none"></td>
                        <td style="padding:0px;font-size: 16px;border:none">
                        <strong style='color:black'>Basement</strong>
                            
                        </td>
                        <td style="padding:0px;border:none">
                            None
                        </td>
                    </tr>

                    <tr>
                        <td  style="padding:0px ;font-size: 16px;border:none">
                            <strong style='color:black'>Lot</strong>
                        </td>
                        <td  style="padding:0px;border:none"> 
                            0.45 acres
                        </td>
                        <td style="border:none"></td>
                        <td style="padding:0px;font-size: 16px;border:none">
                            <strong style='color:black'>Flooring</strong>
                            
                        </td>
                        <td  style="padding:0px;border:none">
                           Laminate, Hardwood
                        </td>
                    </tr>

                    <tr>
                        <td  style="padding:0px;font-size: 16px;border:none">
                            <strong style='color:black'>Year Built</strong>
                        </td>
                        <td  style="padding:0px;border:none"> 
                        ` + v['year_built'] + `
                        </td>
                        <td style="border:none"></td>
                            <td style="padding:0px;border:none">
                            <strong style='color:black'>Roof</strong>
                        </td>
                        <td style="padding:0px;border:none">
                            Composition
                        </td>
                    </tr>

                    <tr>
                        <td  style="padding:0px;font-size: 16px;border:none">
                            <strong style='color:black'>Country</strong>
                        </td>
                        <td  style="padding:0px;border:none"> 
                        King
                        </td>
                        <td style="border:none"></td>

                        <td style="padding:0px;font-size: 16px;border:none">
                            <strong style='color:black'>Foundation</strong>
                        </td>
                        <td  style="padding:0px;border:none">
                           Crawl Raised
                        </td>
                    </tr>
                  </tr>
                  </table>
              </td>
              </tr>
          </table>
          </div>
          </td>
      </tr>

        `).insertAfter(".table-heading");
    });
  }

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

$(document).on('change click', '#save-transaction', function(){
  console.log('TEST');
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


  data['beds'] = $('#beds').val()
  data['baths'] = $('#baths').val()

  console.log(data);

  api_call_url = 'create-transaction/';

  settings = get_settings(api_call_url, 'POST', JSON.stringify(data));

  $.ajax(settings).done(function (response) {

    var msg = JSON.parse(response);
    console.log(msg);
    $("#transaction-msg").css('display', 'block');
    setInterval(location.reload(true), 3000);

  }).fail(function(err) {

    console.log(err);

  });
});

window.addEventListener("DOMContentLoaded", init, false);
