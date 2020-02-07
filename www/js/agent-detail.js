const urlParams = new URLSearchParams(window.location.search)
var agent_id = urlParams.get('agent_id');

function init() {
    load_agent();
}

function currencyFormat(num) {
    return '$' + num.toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
}

$(document).on('change click', '#claim_action', function() {
  console.log(agent_id);
  claim_api(agent_id);
});


function load_agent(ignore_city = false) {
    var city = null;

    if (ignore_city === false) {
        city = urlParams.get('city');
    }
    console.log(city);

    if (agent_id) {
      if (localStorage.getItem('session_id') !== null && localStorage.getItem('session_id') !== 'null') {
        $(".claim_profile").attr("id", "claim_action");
        $(".claim_profile").attr("href", "#");
        $(".claim_profile").attr("onclick", "javascript: return false");

      } else {
        $(".claim_profile").attr("href", "/signup.html?agent_id=" + agent_id)
      }
    }


    var api_call_url = 'agents/' + agent_id + '/';
    if (city !== null) {
        api_call_url += '?city=' + city;
    }

    settings = get_settings(api_call_url, 'GET');

    settings['headers'] = null;

    $.ajax(settings).done(function (response) {
        data = JSON.parse(response);
        $('.agent_name').val(data['agent_name']);
        $.each($('.agent_name'), function () {
            $(this).html(data['full_name'])
        });
        var name_city = data['full_name'] + ' - ' + data['city'];

        $.each($('.agent_name_city'), function () {
            $(this).html(name_city)
        });
        $(".contact-agent").text("Contact " + data['full_name'].split(" ")[0])


        overall_score = data['scores'][0]['overall_l2s_ratio'] || 100
        overall_avg_dom = data['scores'][0]['overall_avg_dom']
        overall_s2l_price = data['scores'][0]['overall_s2l_price']

        city_score = data['scores'][0]['l2s_ratio'] || 100
        city_avg_dom = data['scores'][0]['avg_dom']
        city_s2l_price = data['scores'][0]['s2l_price']

        $("#overall-score").html(overall_score.toFixed(2) + '%');
        $("#overall-avg-dom").html(overall_avg_dom.toFixed(2));
        $("#overall-s2l-price").html(overall_s2l_price.toFixed(2) + '%');

        $("#city-score").html(city_score.toFixed(2) + '%');
        $("#city-avg-dom").html(city_avg_dom.toFixed(2));
        $("#city-s2l-price").html(city_s2l_price.toFixed(2) + '%');



        $(".alist").remove();
        $.each(data['agent_lists'], function (k, v) {
            if (currencyFormat(v['sold_price_int']) >= currencyFormat(v['list_price_int'])) {
                var arrowStyle = ' <i class="fa fa-long-arrow-up" style="font-size:18px;color:green"></i>';
            } else {
                var arrowStyle = ' <i class="fa fa-long-arrow-down" style="font-size:18px;color:red"></i>';
            }
            if (v['year_built'] < '2') {
                var note = `<a  onclick="passBtnID('add-public-note-` + v['id'] + `')" value="1" title="notes"><i class="fa fa-sticky-note-o" style="font-size:27px; color: green;"></i></a>`;
            } else {
                var note = 'note';
            }

            $(`<tr class='alist' onclick="passBtnID('add-public-note-` + v['id'] + `')">
        <td>` + v['status'] + `</td>
        <td>` + currencyFormat(v['list_price_int']) + `</td>
        <td>` + currencyFormat(v['sold_price_int']) + arrowStyle + `</td>
        <td>` + v['days_on_market'] + arrowStyle + `</td>
        <td>` + v['list_date'] + `</td>
        <td>` + v['address_text'] + `</td>
        <td>` + v['year_built'] + `</td>
        <td>` + v['city'] + `</td>
        <td>` + v['home_type'] + `</td>
        <td>` + note + `</td>
      </tr>
         <tr class="fidout" id="add-public-note-` + v['id'] + `" style="display: none; background: lightgray;">
        <td colspan="10" style="padding: 6px 13px; color:gray">
          <div class="form-group">
            <a href="#" class="closeform" onclick="closeBtnID('add-public-note-` + v['id'] + `')" style="float:right;margin-bottom:5px"><i class="fa fa-close"></i></a>
            <textarea class="public-note-text form-control" id="note-` + v['id'] + `" rows="2" name="public-note" readonly></textarea>
          </div>
          <div class="text-left">
          ` + v['address_text'] + `
          <table style="width:100%">
            <tr>
              <td style="width:35%">
                <table style="width:100%">
                    <tr>
                        <td style='text-align: left;padding: 5px 10px;color: gray;'>
                          <strong>Listed:</strong> <br><br>
                          ` + v['list_date'] + ` <br>
                          ` + currencyFormat(v['list_price_int']) + `
                        </td>
                        <td style='padding: 5px 10px;color: gray;'>
                          <strong>Sold:</strong> <br><br>
                          ` + v['sold_date'] + ` <br>
                          ` + currencyFormat(v['sold_price_int']) + `
                        </td>
                    </tr>
                    <tr>
                      <td colspan=2 style='text-align: left;padding: 5px 10px;color: gray;'>
                      <strong>Days on market:</strong> ` + v['days_on_market'] + ` <br>
                      </td>
                    </tr>
                  </table>
                </td>
            <td style="width:5%;border-left: 2px solid #B1B1B4;"></td>
                <td style="width:60%">
                  <table style="width:100%">
                      <tr>
                        <td style='text-align: left;padding: 5px 10px;color: gray;'">
                          <strong>Type:</strong>   &nbsp;&nbsp;&nbsp;` + v['home_type'] + ` <br>
                          <strong>Beds:</strong>  &nbsp;&nbsp;&nbsp;` + v['beds'] + ` <br>
                          <strong>Baths:</strong>  &nbsp;&nbsp;&nbsp;` + v['baths'] + ` <br>
                          <strong>Year Built:</strong>  &nbsp;&nbsp;&nbsp;` + v['year_built'] + ` <br>
                          <strong>State:</strong>  &nbsp;&nbsp;&nbsp;` + v['state'] + ` <br>
                        </td>
                      </tr>
                  </table>
              </td>
              </tr>
          </table>
          </div>
          </td>
      </tr>`
                    ).insertAfter("#transations");
        })

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
function passBtnID(id) {
    $('.fidout').fadeOut('slow');
    $('#' + id).fadeIn('slow');
}
function closeBtnID(id) {
    $('#' + id).fadeOut('slow');
}

$(document).on('change click', '#city-tab', function () {
    $('#cityTabContent').css('display', 'block');
    $('#overallTabContent').css('display', 'none');
    load_agent();
});

$(document).on('change click', '#overall-tab', function () {
    $('#cityTabContent').css('display', 'none');
    $('#overallTabContent').css('display', 'block');

    load_agent(true);
});

window.addEventListener("DOMContentLoaded", init, false);
