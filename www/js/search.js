function init() {
    load_search_results()
}

function get_search_filters() {
    const urlParams = new URLSearchParams(window.location.search);
    const city = urlParams.get('city')
    const state = urlParams.get('state')

    var filters = ''
    if (city != null) {
        filters = 'city=' + city
    }
    if (state != null) {
        filters = 'city=' + city
    }

    return filters
}

function load_search_results() {
    var filters = get_search_filters()
    const urlParams = new URLSearchParams(window.location.search);
    var state = urlParams.get('state')
    if (!(state)) state = "WA"
    var url = ('reports/' + state + '/?' + filters + '&page=1')
    console.log(url)
    settings = get_settings(
        'reports/' + state + '/?' + filters + '&page=1', 'GET');
    settings['headers'] = null;
    // Example requests
    // reports/WA/Seattle/?duration=12&home_type=SINGLE_FAMILY
    var data;
    var search_result = '';

    $.ajax(settings).done(function (response) {

      data = JSON.parse(response);
      results = data['results'];

      $.each(results, function(k, v) {
        item = search_item.split('[[agent_name]]').join(v['agent_full_name']);
        item = item.split('[[time_duration]]').join(v['time_duration']);
        item = item.split('[[city]]').join(v['city']);
        item = item.split('[[score]]').join(v['score']);
        item = item.split('[[agent_id]]').join(v['agent_id']);
        item = item.split('[[agent_full_name]]').join(v['agent_full_name']);

        item = item.split('[[overall_failed_listings]]').join(
            v['overall_failed_listings']);
        item = item.split('[[failed_listings]]').join(v['failed_listings']);

        item = item.split('[[overall_sold_listings]]').join(
            v['overall_sold_listings']);
        item = item.split('[[sold_listings]]').join(v['sold_listings']);

        item = item.split('[[overall_avg_dom]]').join(
            v['overall_avg_dom'].toFixed(1));
        item = item.split('[[avg_dom]]').join(v['avg_dom'].toFixed(1));

        item = item.split('[[overall_s2l_price]]').join(
            v['overall_s2l_price'].toFixed(1));
        item = item.split('[[s2l_price]]').join(v['s2l_price'].toFixed(1));

        item = item.split('[[overall_listings_breakdown_json]]').join(
            array_to_text(v['overall_listings_breakdown_json']))

        item = item.split('[[listings_breakdown_json]]').join(
            array_to_text(v['listings_breakdown_json']));

        search_result += item;
      });

      $('#result-count').html(data['total']);
      $('#page-section').html(search_result);

    }).fail(function(err) {
      // alert('Got err');
      $('.msg').html(err['responseText']);
      $('.msg').css("display", "block");
      console.log(err);
    });
}

function array_to_text(items) {
    var result = ''
    items = JSON.parse(items)
    for(var item of items) {
        result += item
        result += "<br>"

    }
    return result
}

$(document).on('change click', '.lead-submit', function() {
  var selected_agent_id = $(this).attr('data-id');
  var data = {}
  data['name'] = $('#name-' + selected_agent_id).val();
  data['phone'] = $('#phone-' + selected_agent_id).val();
  data['email'] = $('#email-' + selected_agent_id).val();
  data['agent'] = selected_agent_id;
  data['message'] = $('#message-' + selected_agent_id).val();

  settings = get_settings('lead/', 'POST', JSON.stringify(data));
  settings['headers'] = null;

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


window.addEventListener("DOMContentLoaded", init, false);
