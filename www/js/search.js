var agent_ids_order = []
function init() {
    load_search_results();
    init_search_events();
}


function get_search_filters() {
    const urlParams = new URLSearchParams(window.location.search);

    const city = encodeURIComponent(urlParams.get('city', ''));
    const state = urlParams.get('state');
    const agent_name = urlParams.get('agent_name');

    var url = new URL(window.location.href)
    var agent_ids = url.searchParams.get('agents')

    var filters = [];

    if (city == "null" || city == null) {
        console.log("CITY IS!!!" + typeof(city))
    }
    else {
        filters.push('city=' + city);
    }

    if (agent_name != null) {
        filters.push('agent_name=' + agent_name);
    }

    var selected = 'selected_agent_ids=';
    if (agent_ids != null) {
        var new_agent_ids = []
        for(var agent_id of agent_ids.split(",")) {
            if(agent_id) {
                // selected += agent_id + ",";
                new_agent_ids.push(agent_id);
                console.log(agent_id);
            }
        }
        new_agent_ids = [...new Set(new_agent_ids)];
        selected += new_agent_ids.join(',');
        filters.push(selected);
    }
    return filters
}

function get_profile_link(agent_id) {
    var filters = '?agent_id=' + agent_id;
    const urlParams = new URLSearchParams(window.location.search);

    const city = encodeURIComponent(urlParams.get('city', ''));
    const state = urlParams.get('state');

    if (city == "null" || city == null) {
        console.log("CITY IS!!!" + typeof(city))
    }
    else {
        filters += '&city=' + city;
    }

    console.log(filters);
    return "/page-three.html" + filters;
}

function load_search_results() {
    const urlParams = new URLSearchParams(window.location.search);
    var filters = get_search_filters();
    var state = urlParams.get('state');

    if (!(state)) state = "WA"

    filters.push('page=1');
    filters = '?' + filters.join('&');

    api_call_url = 'reports/' + state + '/' + filters;
    console.log(api_call_url);
    settings = get_settings(api_call_url, 'GET');

    settings['headers'] = null;

    // Example requests
    // reports/WA/Seattle/?duration=12&home_type=SINGLE_FAMILY
    var data;
    var search_result = '';

    $.ajax(settings).done(function (response) {

      data = JSON.parse(response);
      results = data['results'];

      $.each(results, function(k, v) {
        agent_ids_order.push(v['agent_id'])
        item = search_item.split('[[agent_name]]').join(v['agent_full_name']);
        item = item.split('[[agent_profile_link]]').join(
            get_profile_link(v['agent_id']));

        item = item.split('[[time_duration]]').join(v['time_duration']);
        item = item.split('[[city]]').join(v['city']);
        item = item.split('[[score]]').join(v['score'].toFixed(1));
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
      set_pined_load()
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


function set_pined_load() {
    var url = new URL(window.location.href)
    var agent_ids = url.searchParams.get('agents')
    for(var agent_id of agent_ids.split(",")) {
        if(agent_id) {
            // click to set the button pined
            $(".toc-two[agent_id='" + agent_id + "']").find(
                ".toc-two-left-two-heading-right").click()
        }
    }
}

function set_pined_agent_ids() {
    var pined_agents  = $(".toc-two .toc-two-left-two-heading-right")
    // console.log(pined_agents)
    var selected_agent_ids = ''
    for(var pined_agent of pined_agents) {
        if ($(pined_agent).hasClass("toc-two-left-two-heading-right-next")) {
            continue
        }
        selected_agent_ids += $(pined_agent).closest(
            ".toc-two").attr("agent_id") + ","
    }
    var url = new URL(window.location.href);
    selected_agent_ids_arr = selected_agent_ids.split(',')
    // new_agent_ids = [...new Set(new_agent_ids)];
    selected_agent_ids = [...new Set(selected_agent_ids_arr)]

    url.searchParams.set("agents", selected_agent_ids.join(','));
    $("#agents").val(url.searchParams.get("agents"))
    window.history.pushState("", "", url)
}

function init_search_events() {
    $(document).on('click', '.toc-two-left-two-heading-right', function() {
        $(this).addClass("toc-two-left-two-heading-right-next");
        $(this).find("p").text("Pin to top")
        set_pined_agent_ids()

        $(this).closest(".toc-two").detach().appendTo("#page-section")

    })

    $(document).on('click', '.toc-two-left-two-heading-right-next', function() {
        $(this).removeClass("toc-two-left-two-heading-right-next");
        $(this).find("p").text("Unpin")
        set_pined_agent_ids()

        $(this).closest(".toc-two").detach().prependTo("#page-section")
        //alert($(this).closest(".toc-two").attr("agent_id"))

    })

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
}


window.addEventListener("DOMContentLoaded", init, false);
