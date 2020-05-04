const urlParams = new URLSearchParams(window.location.search)

var locations = [];
var agent_id = urlParams.get('agent_id');

function init() {
    load_agent();
}

function currencyFormat(num) {
    // return '$' + num.toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
    try {
      return '$' + num.toFixed(0).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
    } catch(err) {
      return ''
    }
}

$(document).on('change click', '#claim_action', function() {
  console.log(agent_id);
  claim_api(agent_id);
});


function load_agent(ignore_city = true) {
    full_path = window.location.pathname;

    var screen_name = null
    if (full_path.split('/')[1] == 'profile') {
      screen_name = full_path.split('/')[3]
    }

    var city = null;
    if (ignore_city === false) {
      city = urlParams.get('city');
    }

    if ((agent_id)) {
      transaction_query = agent_id;
    } else {
      transaction_query = screen_name;
    }

    if (city == null) {
      $('#new_transactions').html(`
        <iframe
          src='https://app.agentstat.com/agentportal/transactions/` + transaction_query + `/'
          style='width: 110%; height: 450px; border: 0'
          ></iframe>
      `);
    } else {
      $('#new_transactions').html(`
        <iframe
          src='https://app.agentstat.com/agentportal/transactions/` + transaction_query + `/?city=`+ city +`'
          style='width: 110%; height: 450px; border: 0'
          ></iframe>
      `);
    }
    console.log(city);


    if (agent_id) {
      if (localStorage.getItem('session_id') !== null && localStorage.getItem('session_id') !== 'null') {
        $(".claim_profile").attr("id", "claim_action");
        $(".claim_profile").attr("href", "#");
        $(".claim_profile").attr("onclick", "javascript: return false");

      } else {
        $(".claim_profile").attr("href", "/login.html?agent_id=" + agent_id)
      }
    }

    var api_call_url = '';

    if (screen_name) {
      api_call_url = 'agents/' + screen_name  + '/'
    } else {
      api_call_url = 'agents/' + agent_id + '/';
    }

    if (city !== null) {
        api_call_url += '?city=' + city;
    }

    settings = get_settings(api_call_url, 'GET');

    settings['headers'] = null;


    agent_list_key = 'agent_lists';

    if (ignore_city == false) {
      agent_list_key = 'city_agent_lists'
    }

    $.ajax(settings).done(function (response) {


        data = JSON.parse(response);

        $('.agent_name').val(data['agent_name']);
        $('.agent-first-name').text(data['full_name'].split(" ")[0]);
        $.each($('.agent_name'), function () {
            $(this).html(data['full_name']);
        });

        brokerage_info = data['brokerage_info'].split(/\r?\n/)[0];

        $('.brokerage_info').html(brokerage_info.toLowerCase());
        $.each($('.agent_namebroker_name'), function () {
            brokerage_info += ' ' + data['city'];

            $(this).html(
              data['full_name'].toLowerCase() +' ' +
              `<span style="font-size: 13px;color: #007bff;"> </span>`
            );
        });
        // $.each($('.agent_name_loc'), function () {
        //     $(this).html(data['full_name']+' '+'is a ?? match for you (enter your location in the search bar to view % match)');
        // });
        $.each($('.answer_agent_name'),function(){
            $(this).html('Answer a few questions to see how well'+' '+ data['full_name']+' '+' strengths match your needs.')
        })

        var name_city = data['full_name'] + ' - ' + data['city'];

        $.each($('.agent_name_city'), function () {
            $(this).html(name_city)
        });
        $(".contact-agent").text("Contact " + data['full_name'].split(" ")[0])

        if (data['picture'] !== null) {
          $('.back-img').attr('src', data['picture']);
        }
        $('#about_us').html(data['about_us']);

        if(data['claimed'] === true) {
            $('#already_claim_wrapper').css('display', 'block');
        } else {
            $('#claim_wrapper').css('display', 'block');
        }

        overall_score = data['scores'][0]['overall_l2s_ratio'] || 100;
        overall_avg_dom = data['scores'][0]['overall_avg_dom'];
        overall_s2l_price = data['scores'][0]['overall_s2l_price'];
        overall_sold_listings = data['scores'][0]['overall_sold_listings'];
        // overall_score = data['scores'][0]['overall_score'];

        city_score = data['scores'][0]['l2s_ratio'] || 100;
        city_avg_dom = data['scores'][0]['avg_dom'];
        city_s2l_price = data['scores'][0]['s2l_price'];
        sold_listings = data['scores'][0]['sold_listings'];
        // score = data['scores'][0]['score'];

        $("#overall-score").html(overall_score.toFixed(2) + '%');
        $("#overall-avg-dom").html(overall_avg_dom.toFixed(2));
        $("#overall-s2l-price").html(overall_s2l_price.toFixed(2) + '%');

        $("#city-score").html(city_score.toFixed(2) + '%');
        $("#city-avg-dom").html(city_avg_dom.toFixed(2));
        $("#city-s2l-price").html(city_s2l_price.toFixed(2) + '%');
        $('.sold_listings').html(sold_listings);
        $('.overall_sold_listings').html(overall_sold_listings);
        $('.overall_score').html(overall_score);
        $('.score').html(city_score);


        $(".alist").remove();
        index = 1;

        if (data['reviews'].length > 0) {
          $.each(data['reviews'], function(k, v) {
            console.log(v);
            $('#reviews').append(`
                <div class="pth-more-right-one pth-more-right-first">
                    <h6>` + v['full_name'] +`</h6>
                    <p>` + v['review'] + `</p>
                </div>
              `);
          });
        }

        $.each(data[agent_list_key], function (k, v) {
            // console.log("HERE",data['agent_lists']['description']);
            new_point = [v['address_text'], v['latitude'], v['longitude'], index++]
            locations.push(new_point);


            if(data['agent_lists']['description'] == undefined){

                if (currencyFormat(v['sold_price_int']) >= currencyFormat(v['list_price_int'])) {
                    var arrowStyle = ' <i class="fa fa-long-arrow-up" style="font-size:18px;color:green"></i>';
                } else {
                    var arrowStyle = ' <i class="fa fa-long-arrow-down" style="font-size:18px;color:red"></i>';
                }
                    var note = ``;

                    if(v['home_type'] != null || v['home_type'] != undefined ){
                        var hometype= v['home_type'].replace('_',' ')
                      }else{
                        var hometype= v['home_type'];
                      }
                      var date = v['list_date'].split('-');
                      var reversedate = date[1] + '-' + date[2] + '-' + date[0];

                $(`<tr class='fidin alist alist`+k+`' passBtnID="add-public-note-` + v['id'] + `)">
                    <td>` + v['status'] + `</td>
                    <td>` + currencyFormat(v['list_price_int']) + `</td>
                    <td>` + currencyFormat(v['sold_price_int']) + arrowStyle + `</td>
                    <td>` + v['days_on_market'] + arrowStyle + `</td>
                    <td>` + reversedate + `</td>
                    <td style="white-space: nowrap;">` + v['address_text'] + `</td>
                    <td>` + v['year_built'] + `</td>
                    <td>` + v['city'] + `</td>
                    <td style="text-transform: lowercase;" id="homeType">` + hometype + `</td>
                    <!--<td>` + note + `</td>-->
                    <td ><button class="btn " style="background: #CFE2F3;color:black;border: 1px solid;" data-rel="add-public-note-`+ v['id'] +`" onclick="passBtnID('add-public-note-`+ v['id']+ `')" value="1" title="notes">Add public note</button> </td>
          </tr>
             <tr class="fidout" id="add-public-note-` + v['id'] + `" style="display: none; background: lightgray;">
            <td id="fadediv" colspan="10" style="padding: 6px 13px; color:gray">
              <div class="text-left title_color">
              ` + v['address_text'] + `
              <table style="width:100%">

                <tr>
                  <td style="width:35%">
                    <table style="width:100%">

                        <tr>
                            <td style='text-align: left;padding: 5px 10px;color: gray; border:none'>
                              <strong style='color:black'>Listed:</strong> <br>
                              ` + v['list_date'] + ` <br>
                              ` + currencyFormat(v['list_price_int']) + `
                            </td>
                            <td style='padding: 5px 10px;color: gray;border:none'>
                              <strong style='color:black'>Sold:</strong> <br>
                              ` + v['sold_date'] + ` <br>
                              ` + currencyFormat(v['sold_price_int']) + `
                            </td>
                        </tr>
                        <tr>
                          <td colspan=2 style='text-align: left;padding: 5px 10px;color: gray;'>
                          <strong style='color:black'>Days on market:</strong> ` + v['days_on_market'] + ` <br>
                          </td>
                        </tr>
                      </table>
                    </td>
                <td style="width:5%;border-left: 2px solid #B1B1B4;"></td>
                    <td style="width:60%">
                      <table style="width:100%">
                          <tr>
                            <!-- <td style='text-align: left;padding: 5px 10px;color: gray;'">
                              <strong style='color:black'>Type</strong>   &nbsp;&nbsp;&nbsp;` + v['home_type'] + ` <br>
                              <strong style='color:black'>Beds</strong>  &nbsp;&nbsp;&nbsp;` + v['beds'] + ` <br>
                              <strong style='color:black'>Baths</strong>  &nbsp;&nbsp;&nbsp;` + v['baths'] + ` <br>
                              <strong style='color:black'>Sqft</strong>  &nbsp;&nbsp;&nbsp;1,550 <br>
                              <strong style='color:black'>Lot</strong>  &nbsp;&nbsp;&nbsp;0.45<br>
                              <strong style='color:black'>Year Built</strong>  &nbsp;&nbsp;&nbsp;` + v['year_built'] + ` <br>
                               <strong style='color:black'>State</strong>  &nbsp;&nbsp;&nbsp;` + v['state'] + ` <br>
                              <strong style='color:black'>Country</strong>  &nbsp;&nbsp;&nbsp;King<br>
                            </td>-->
                            <td  style="padding:0px">
                                <strong style='color:black'>Type</strong>
                            </td>

                            <td  style="padding:0px">
                                ` + v['home_type'] + `
                            </td>
                            <td></td>
                            <td style="padding:0px;font-size: 16px;">
                                <strong style='color:black'>Heating</strong>
                            </td>
                            <td style="padding:0px;">
                                Forced Air
                            </td>

                        </tr>
                        <tr>
                            <td style="padding:0px">
                                <strong style='color:black'>Beds</strong>
                            </td>
                            <td  style="padding:0px">
                                ` + v['beds'] + `
                            </td>
                            <td ></td>
                            <td style="padding:0px ;font-size: 16px;">
                            <strong style='color:black'>Cooling</strong>

                            </td>
                            <td  style="padding:0px">
                                None
                            </td>
                        </tr>
                        <tr>
                            <td  style="padding:0px">
                                <strong style='color:black'>Baths</strong>
                            </td>
                            <td  style="padding:0px">
                                ` + v['baths'] + `
                            </td>
                            <td ></td>
                            <td style="padding:0px ;font-size: 16px;">
                            <strong style='color:black'>Parking</strong>
                            </td>
                            <td style="padding:0px">
                              Attached Garage
                            </td>
                        </tr>
                        <tr>
                            <td  style="padding:0px">
                                <strong style='color:black'>Sqft</strong>
                            </td>
                            <td  style="padding:0px">
                                1,550
                            </td>
                            <td ></td>
                            <td style="padding:0px;font-size: 16px;">
                            <strong style='color:black'>Basement</strong>

                            </td>
                            <td style="padding:0px">
                                None
                            </td>
                        </tr>

                        <tr>
                            <td  style="padding:0px ;font-size: 16px;">
                                <strong style='color:black'>Lot</strong>
                            </td>
                            <td  style="padding:0px">
                                0.45 acres
                            </td>
                            <td></td>
                            <td style="padding:0px;font-size: 16px;">
                                <strong style='color:black'>Flooring</strong>

                            </td>
                            <td  style="padding:0px">
                               Laminate, Hardwood
                            </td>
                        </tr>

                        <tr>
                            <td  style="padding:0px;font-size: 16px;">
                                <strong style='color:black'>Year Built</strong>
                            </td>
                            <td  style="padding:0px">
                            ` + v['year_built'] + `
                            </td>
                            <td></td>
                                <td style="padding:0px">
                                <strong style='color:black'>Roof</strong>
                            </td>
                            <td style="padding:0px">
                                Composition
                            </td>
                        </tr>

                        <tr>
                            <td  style="padding:0px;font-size: 16px;">
                                <strong style='color:black'>Country</strong>
                            </td>
                            <td  style="padding:0px">
                            King
                            </td>
                            <td ></td>

                            <td style="padding:0px;font-size: 16px;">
                                <strong style='color:black'>Foundation</strong>
                            </td>
                            <td  style="padding:0px">
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
          </tr>`
                        ).appendTo("#transations");
                    } else {
                          if (currencyFormat(v['sold_price_int']) >= currencyFormat(v['list_price_int'])) {
                              var arrowStyle = ' <i class="fa fa-long-arrow-up" style="font-size:18px;color:green"></i>';
                          } else {
                              var arrowStyle = ' <i class="fa fa-long-arrow-down" style="font-size:18px;color:red"></i>';
                          }
                          if (v['year_built'] < '2') {
                              var note = `<a  passBtnID="add-public-note-` + v['id'] + `" value="1" title="notes"><i class="fa fa-sticky-note-o" style="font-size:27px; color: green;"></i></a>`;
                          } else {
                              var note = `<i class="fa fa-sticky-note-o" style="font-size:27px; color: green;"></i>`;
                          }
                          if(v['home_type'] != null || v['home_type'] != undefined ){
                              var hometype= v['home_type'].replace('_',' ')
                          }else{
                              var hometype= v['home_type'];
                          }

                          console.log("old date",v['list_date'])
                          var date = v['list_date'].split('-');
                          date.reverse();
                          var reversedate = date.join('-');
                          console.log("new date",reversedate)

                          $(`<tr class='alist alist`+k+`' passBtnID="add-public-note-` + v['id'] + `">
                          <td>` + v['status'] + `</td>
                          <td>` + currencyFormat(v['list_price_int']) + `</td>
                          <td>` + currencyFormat(v['sold_price_int']) + arrowStyle + `</td>
                          <td>` + v['days_on_market'] + arrowStyle + `</td>
                          <td>` + reversedate + `</td>
                          <td style="white-space: nowrap;">` + v['address_text'] + `</td>
                          <td>` + v['year_built'] + `</td>
                          <td>` + v['city'] + `</td>
                          <td style="text-transform: lowercase;" id="homeType">` + hometype + `</td>
                          <!--<td>` + note + `</td>-->
                          <td ><button class="btn " style="background: #CFE2F3;color:black;border: 1px solid;" data-rel="add-public-note-`+ v['id'] +`" onclick="passBtnID('add-public-note-`+ v['id']+ `')" value="1" title="notes">Add public note</button> </td>
                        </tr>
                   <tr class="fidout" id="add-public-note-` + v['id'] + `" style="display: none; background: lightgray;">
                       <td colspan="10" style="padding: 6px 13px; color:gray">
                          <div class="form-group">
                              <div  class="closeform" onclick="closeBtnID('add-public-note-` + v['id'] + `')" style="float:right;margin-bottom:5px"><i class="fa fa-close" style="color: #0896fb;"></i></div>
                              <textarea class="public-note-text form-control" id="note-` + v['id'] + `" rows="2" name="public-note" readonly></textarea>
                          </div>
                          <div class="text-left title_color">
                          ` + v['address_text'] + `
                          <table style="width:100%">

                              <tr>
                              <td style="width:35%">
                                  <table style="width:100%">

                                      <tr>
                                          <td style='text-align: left;padding: 5px 10px;color: gray; border:none'>
                                          <strong style='color:black'>Listed:</strong> <br>
                                          ` + v['list_date'] + ` <br>
                                          ` + currencyFormat(v['list_price_int']) + `
                                          </td>
                                          <td style='padding: 5px 10px;color: gray;border:none'>
                                          <strong style='color:black'>Sold:</strong> <br>
                                          ` + v['sold_date'] + ` <br>
                                          ` + currencyFormat(v['sold_price_int']) + `
                                          </td>
                                      </tr>
                                      <tr>
                                      <td colspan=2 style='text-align: left;padding: 5px 10px;color: gray;'>
                                      <strong style='color:black'>Days on market:</strong> ` + v['days_on_market'] + ` <br>
                                      </td>
                                      </tr>
                                  </table>
                                  </td>
                              <td style="width:5%;border-left: 2px solid #B1B1B4;"></td>
                                  <td style="width:60%">
                                  <table style="width:100%">
                                      <tr>
                                          <!-- <td style='text-align: left;padding: 5px 10px;color: gray;'">
                                          <strong style='color:black'>Type</strong>   &nbsp;&nbsp;&nbsp;` + v['home_type'] + ` <br>
                                          <strong style='color:black'>Beds</strong>  &nbsp;&nbsp;&nbsp;` + v['beds'] + ` <br>
                                          <strong style='color:black'>Baths</strong>  &nbsp;&nbsp;&nbsp;` + v['baths'] + ` <br>
                                          <strong style='color:black'>Sqft</strong>  &nbsp;&nbsp;&nbsp;1,550 <br>
                                          <strong style='color:black'>Lot</strong>  &nbsp;&nbsp;&nbsp;0.45<br>
                                          <strong style='color:black'>Year Built</strong>  &nbsp;&nbsp;&nbsp;` + v['year_built'] + ` <br>
                                          <strong style='color:black'>State</strong>  &nbsp;&nbsp;&nbsp;` + v['state'] + ` <br>
                                          <strong style='color:black'>Country</strong>  &nbsp;&nbsp;&nbsp;King<br>
                                          </td>-->
                                          <td  style="padding:0px">
                                              <strong style='color:black'>Type</strong>
                                          </td>

                                          <td  style="padding:0px">
                                              ` + v['home_type'] + `
                                          </td>
                                          <td></td>
                                          <td style="padding:0px;font-size: 16px;">
                                              <strong style='color:black'>Heating</strong>
                                          </td>
                                          <td style="padding:0px;">
                                              Forced Air
                                          </td>

                                      </tr>
                                      <tr>
                                          <td style="padding:0px">
                                              <strong style='color:black'>Beds</strong>
                                          </td>
                                          <td  style="padding:0px">
                                              ` + v['beds'] + `
                                          </td>
                                          <td ></td>
                                          <td style="padding:0px ;font-size: 16px;">
                                          <strong style='color:black'>Cooling</strong>

                                          </td>
                                          <td  style="padding:0px">
                                              None
                                          </td>
                                      </tr>
                                      <tr>
                                          <td  style="padding:0px">
                                              <strong style='color:black'>Baths</strong>
                                          </td>
                                          <td  style="padding:0px">
                                              ` + v['baths'] + `
                                          </td>
                                          <td ></td>
                                          <td style="padding:0px ;font-size: 16px;">
                                          <strong style='color:black'>Parking</strong>
                                          </td>
                                          <td style="padding:0px">
                                          Attached Garage
                                          </td>
                                      </tr>
                                      <tr>
                                          <td  style="padding:0px">
                                              <strong style='color:black'>Sqft</strong>
                                          </td>
                                          <td  style="padding:0px">
                                              1,550
                                          </td>
                                          <td ></td>
                                          <td style="padding:0px;font-size: 16px;">
                                          <strong style='color:black'>Basement</strong>

                                          </td>
                                          <td style="padding:0px">
                                              None
                                          </td>
                                      </tr>

                                      <tr>
                                          <td  style="padding:0px ;font-size: 16px;">
                                              <strong style='color:black'>Lot</strong>
                                          </td>
                                          <td  style="padding:0px">
                                              0.45 acres
                                          </td>
                                          <td></td>
                                          <td style="padding:0px;font-size: 16px;">
                                              <strong style='color:black'>Flooring</strong>

                                          </td>
                                          <td  style="padding:0px">
                                          Laminate, Hardwood
                                          </td>
                                      </tr>

                                      <tr>
                                          <td  style="padding:0px;font-size: 16px;">
                                              <strong style='color:black'>Year Built</strong>
                                          </td>
                                          <td  style="padding:0px">
                                          ` + v['year_built'] + `
                                          </td>
                                          <td></td>
                                              <td style="padding:0px">
                                              <strong style='color:black'>Roof</strong>
                                          </td>
                                          <td style="padding:0px">
                                              Composition
                                          </td>
                                      </tr>

                                      <tr>
                                          <td  style="padding:0px;font-size: 16px;">
                                              <strong style='color:black'>Country</strong>
                                          </td>
                                          <td  style="padding:0px">
                                          King
                                          </td>
                                          <td ></td>

                                          <td style="padding:0px;font-size: 16px;">
                                              <strong style='color:black'>Foundation</strong>
                                          </td>
                                          <td  style="padding:0px">
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
                      </tr>`
                      ).appendTo("#transations");
    }
    });


        //pagination(data[agent_list_key].length);

        $('#datatable').DataTable();

    }).fail(function (err) {
        console.log(err);
    });
}

$(document).on('change click', '.how_soon li>a', function () {
    var leads = {
        'how_soon_sell': $(this).text()
    }
    var buy_home = $(this).attr('id');
    localStorage.setItem('leads', JSON.stringify(leads));
    if (buy_home == 'buy-home') {
        $('#leads-step-one-new').css('display', 'None');
        $('#leads-step-one-buy').css('display', 'block');
    } else {
        $('#leads-step-one-new').css('display', 'None');
        $('#leads-step-one').css('display', 'block');
    }

});

$(document).on('change click', '.why_interest li>a', function () {
    var data = JSON.parse(localStorage.getItem('leads'));
    data['interest_reason'] = $(this).text();
    var buy_home = $(this).attr('id');
    localStorage.setItem('leads', JSON.stringify(data));
    if (buy_home == 'buy-home') {
        $('#leads-step-one-buy').css('display', 'None');
        $('#leads-step-two-buy').css('display', 'block');
    } else {
        $('#leads-step-one').css('display', 'none');
        $('#leads-step-two').css('display', 'block');
    }
    localStorage.setItem('leads', JSON.stringify(data));

    console.log('tests');

});
$(document).on('change click', '.why_interest_two li>a', function () {
    var data = JSON.parse(localStorage.getItem('leads'));
    data['interest_reason'] = $(this).text();
    localStorage.setItem('leads', JSON.stringify(data));
    var buy_home = $(this).attr('id');
    if (buy_home == 'buy-home') {
        $('#leads-step-two-buy').css('display', 'None');
        $('#leads-step-one').css('display', 'block');
    } else {
        $('#leads-step-two').css('display', 'none');
        $('#leads-step-three').css('display', 'block');
    }
    localStorage.setItem('leads', JSON.stringify(data));

    console.log('tests');

});

$(document).on('change click', '#lead-submit', function () {
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

    }).fail(function (err) {

        $('.msg').html(err['responseText']);
        console.log(err);

    });
});

$(window).on('load', function () {
    const urlParams = new URLSearchParams(window.location.search)
    var city = urlParams.get('city');
    if (city !== null) {
        $('#city-tab').text(city);
        $('#city-tab').click();
    }
});
/*function passBtnID(id) {
    alert($(this).attr('id'));
    if($('.fidout').is(":visible")){
        $('.fidout').fadeOut('slow');
        $('#' + id).fadeIn('slow');

        console.log("Visible")
    }else{
        console.log("not visible")

        $('#' + id).fadeIn('slow');

    }


}*/

$(document).on('click', '.fidin', function () {
   //alert($(this).attr('passBtnID'));
   $('.fidout').each(function(){
	   $('.fidout').fadeOut('slow');
   });

   if($(this).next().is(":visible")){
	   $(this).next().fadeOut('slow');
   }
   else{
	   $(this).next().fadeIn('slow');
   }
});

$('.fidout').click(function(){
    alert()
//     debugger;
//     $('.fidout').fadeOut('slow');
//    if($('#fadediv').is(":visible")){
//        console.log($('#fadediv').is(":visible"))
//    }else{
//       console.log($('#fadediv').is(":visible"))
//    }
})
function closeBtnID(id) {
    $('#' + id).fadeOut('slow');
}

$(document).on('change click', '#city-tab', function () {
    $('#cityTabContent').css('display', 'block');
    $('#overallTabContent').css('display', 'none');
    load_agent(false);
});

$(document).on('change click', '#overall-tab', function () {
    $('#cityTabContent').css('display', 'none');
    $('#overallTabContent').css('display', 'block');

    load_agent();
});

$(document).on('click', '#already_claim_profile', function () {
    $('#want-claim').css('display', 'none');
    $('#submit-proof-form').css('display', 'block');
});

$(document).on('click', '#want-claim-yes', function () {
    $('#want-claim').css('display', 'none');
    $('#submit-proof-form').css('display', 'block');
});

function pagination(page){

    console.log(page);
    total = page%10 == 0 ? (page/10) : (page/10)+1;
    console.log(total);

    if (page > 1) {
      $("#pagination-here").bootpag({
          total: page%10 == 0 ? (page/10) : (page/10)+1,
          page: 2,
          maxVisible: 3,
          leaps: true,
          firstLastUse: true,
          first: '←',
          last: '→',
          wrapClass: 'pagination',
          activeClass: 'active',
          disabledClass: 'disabled',
          nextClass: 'next',
          prevClass: 'prev',
          lastClass: 'last',
          firstClass: 'first'
          //href: "#result-page-{{number}}",
      });
    }

    //page click action
    $('#pagination-here').on("page", function(event, num){
        //show / hide content or pull via ajax etc

        var range = num * 10;

        // if(num == 1){
        //     intial_item = range - 10;
        //     last_item = range - 1;
        // }else{
            intial_item = range - 10;
            last_item = range ;
        //}

        console.log(".alist "+num);
        console.log("Range ",range)
        console.log(".intial_item "+intial_item);
        console.log(".last_item "+last_item);

        $(".alist").hide();
        for(var i = intial_item; i < last_item; i++){
            $(".alist"+i).show();
        }


    });

}

function show_claim_screen() {
    swal({
      title: "Claim Profile!",
      text: "Do you want to dispute the claim and provide proof of identity?",
      icon: "warning",
      buttons: [
        'No, cancel it!',
        'Yes, I am sure!'
      ],
      dangerMode: true,
    }).then(function(isConfirm) {
      if (isConfirm) {

        $('#alreadyClaimedModal').modal('show');

      } else {
        // swal("Cancelled", "Your imaginary file is safe :)", "error");
      }
    });
}

$('#submit_proof_btn').click(function() {
  var form_data = {};
  var picture_data = $('#picture')[0].files[0]

  var reader = new FileReader();
  reader.readAsDataURL(picture_data);
  var picture_base64 = '';

    reader.onload = function () {
      console.log(reader.result);
      picture_base64 = reader.result;
      form_data['id_picture'] = picture_base64;
      form_data['full_name'] = $('#full_name').val();
      form_data['email'] = $('#email').val();
      form_data['brokerage_name'] = $('#brokerage-name').val();

      settings = get_settings('re-claim/', 'POST', JSON.stringify(form_data))

      $.ajax(settings).done(function (response) {

          $('#alreadyClaimedModal').modal('toggle');
          swal({
            title: "Claim Profile!",
            text: "Your request has been saved!",
            icon: "success",
          }).then(function(isConfirm) {
          });
          console.log('aferim');

      }).fail(function(err) {
          // alert('Got err');
          console.log(err);
          show_error(err);
      });
    };
    reader.onerror = function (error) {
     console.log('Error: ', error);
    };
});

window.addEventListener("DOMContentLoaded", init, false);
// window.addEventListener("DOMContentLoaded", $('datatable').dataTable(), false);
