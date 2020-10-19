var agent_ids_order = [];
var all_agents=[];

if (localStorage.getItem("pin_agent_arr") == null) {
    localStorage.setItem("pin_agent_arr", JSON.stringify([]));
}

function updateBrowserUrl() {
    var url_string = window.location.href;
    var url = new URL(url_string);

    var pinAgents = JSON.parse(localStorage.getItem("pin_agent_arr"));
    if (pinAgents.length > 0) {
        url.searchParams.set("agents", pinAgents.join(','));
        window.history.pushState("", "", url);
    }
}

function init_search_results() {
    var url_string = window.location.href;
    var url = new URL(url_string);
    var agents = url.searchParams.get("agents");

    if (agents == null || agents == '') {
        updateBrowserUrl();
    }

    load_search_results();
    init_search_events();
    populate_city_search_menu();
}

function populate_city_search_menu() {
    var settings = get_settings("cities/WA", 'GET');
    settings['headers'] = null;
    $.ajax(settings).done(function (response) {
      data = JSON.parse(response);
      results = data['results'];
      for (var city of data) {
        $("#city-search-filter").append(
            "<option value='" + city + "'>" + city + "</option>")
      }
    });
}


function show_loading_screen() {
    swal({
        title: "Crunching Numbers!",
        text:  "Hang tight while we crunch the numbers!",
        imageUrl: "/img/pop.png",
        showCancelButton: false,
        showConfirmButton: false,
        allowOutsideClick: false
    });
}

function get_search_filters() {
    const urlParams = new URLSearchParams(window.location.search);
    const city = encodeURIComponent(urlParams.get('city', ''));
    const state = urlParams.get('state');
    const agent_name = urlParams.get('agent_name');
    const lat = urlParams.get('lat');
    const lng = urlParams.get('lng');
    const v_estimate = urlParams.get('v_estimate');
    const home_type = urlParams.get('home_type');


    var url = new URL(window.location.href)
    var agent_ids = url.searchParams.get('agents')

    var type = url.searchParams.get('type')

    var filters = [];

    // work around for page load race condition..
    setTimeout(function() {
        if(urlParams.get('search_input')) {
            $(".ser").val(urlParams.get('search_input'))
        }
    }, 1000);

    setTimeout(function() {
        if($('#y-address').text().trim() && urlParams.get('address')) {
            $(".ser").val(urlParams.get('address'))
        }
    }, 1000);

    setTimeout(function() {
        if(urlParams.get('search_input')) {
            $(".ser-map").val(urlParams.get('search_input'))
        }
    }, 1000);

    setTimeout(function() {
        if($('#y-address-map').text().trim() && urlParams.get('address')) {
            $(".ser-map").val(urlParams.get('address'))
        }
    }, 1000);


    if (city == "null" || city == null) {
        console.log("CITY IS!!!" + typeof(city))
    }
    else {
        filters.push('city=' + city);
         $("#city-search-filter").append(
            "<option value='" + city + "'>" + city + "</option>")
          }

    if (agent_name != null) {
        filters.push('agent_name=' + agent_name);
    }

    if (lat == 'null' || lng == 'null') {
    }
    else if (lat && lng) {
        filters.push('lat=' + lat);
        filters.push('lng=' + lng);
    }

    if (v_estimate) {
        if (v_estimate !== 'null') {
          filters.push('v_estimate=' + v_estimate);
          set_v_estimate(String(v_estimate))
        }
    }

    if (home_type) {
        filters.push('home_type=' + home_type);
        set_home_type_radio(type)
    }

    var selected = 'selected_agent_ids=';
    if (agent_ids != null) {
        var new_agent_ids = []
        for(var agent_id of agent_ids.split(",")) {
            if(agent_id) {
                selected += agent_id + ",";
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
    }
    else {
        filters += '&city=' + city;
    }
    return "/page-three.html" + filters;
}

function load_search_results() {
    const urlParams = new URLSearchParams(window.location.search);
    var data;
    var results;
    var search_result = '';

    var filters = get_search_filters();
    var state = urlParams.get('state');
    var city = urlParams.get('city');
    var city_search = urlParams.get('city_search');
    var zipcode = urlParams.get('zipcode');
    var agent_name=urlParams.get('agent_name');
    var page_num = urlParams.get('page_num', '1');

    selected_agents = urlParams.get('agents');
    selected_agent_ids = [];
    if ((selected_agents)) {
      selected_agent_ids = selected_agents.split(',')
    }


    if (!(state)) state = "WA"

    if (page_num == null) {
        page_num = '1'
    }
    filters.push('page=' + page_num);

    if(state === null || state === 'null') {
      state = 'WA';
      filters.push('state=WA');
    }


    if ((zipcode)) {

      api_call_url = 'reports-zipcode/' + zipcode + '/';
      $(".custom_radio")[3].click();

    } else if (city_search) {
      api_call_url = 'reports-city/' + city_search + '/';
      $(".custom_radio")[2].click();

    } else {
      filters = '?' + filters.join('&');

      if ((agent_name)) {
        $(".custom_radio")[1].click();

        $(window).on("load", function () {
          $("li:contains(" + state + ")").click();
        });

      }
      api_call_url = 'reports/' + state + '/' + filters;

    }

    console.log("API Request: " + api_call_url);

    var settings = get_settings(api_call_url, 'GET');
    console.log(settings['url'])
    settings['headers'] = null;

    show_loading_screen();
    $.ajax(settings).done(function (response) {

      data = JSON.parse(response);
      results = data['results'];
      pagination_footer(data['total'])
      var agent_id_on_page = [];

      $.each(results, function(k, v) {
        agent_ids_order.push(v['agent_id']);
        all_agents.push(v);
        brokerage_info = v['agent_brokerage_info'].split(/\r?\n/)[0].toLowerCase();
        // brokerage_info += ' ' + v['agent_state'] + ' ' + v['agent_city'];
        agent_id_on_page.push(v['agent_id']);

        v['agent_full_name'] = v['agent_full_name'].toLowerCase();
        // brokerage_info = brokerage_info.toLowerCase();

        item = search_item_min.split('[[agent_name]]').join(v['agent_full_name']);
        item = item.split('[[brokerage_info]]').join(brokerage_info);
        item = item.split('[[index]]').join(k);

        toggle_on = '';
        if ($.inArray(v['agent_id'].toString(), selected_agent_ids) !== -1) {
          toggle_on = 'on';
        }
        item = item.split('[[toggle_on]]').join(toggle_on);

        if(v['screen_name']) {
          agent_link = '/profile/' + v['state'].toLowerCase() + '/' + v['screen_name'];
        } else {
          // agent_link = get_profile_link(v['agent_id']);
          agent_link = '/profile/' + v['state'].toLowerCase() + '/' + v['agent_slug'];
        }

        // XXX we like this idea though we need to fix parsing profile
        // if(v['screen_name']) {
        //  agent_link = '/profile/' + v['state'].toLowerCase() + '/' + v['screen_name']
        //} else {

        // agent_link = get_profile_link(v['agent_id']);
        //}

        item = item.split('[[agent_profile_link]]').join(agent_link);

            if(v['agent_picture'] == undefined || v['agent_picture'] == '')
            {
                picture_img = (
                    "<div class='toc-two-left-one'>" +
                    "<img class='rounded-circle toc-two-left-one' " +
                        "style='border-radius: 130px;margin-top: 21px;' " +
                        " src='/img/sh.png'></div>");
                item = item.split('[[agent_picture]]').join(picture_img);
            }
        if (v['agent_picture'] !== undefined && v['agent_picture'] !== '') {
            picture_img = (
                "<div class='toc-two-left-one'>" +
                    "<img class='rounded-circle img-thumbnail' " +
                        "style='border-radius: 130px; margin-top: 21px;' " +
                        "src='" + v['agent_picture'] + "'></div>");
            item = item.split('[[agent_picture]]').join(picture_img);
        } else {
            item = item.split('[[agent_picture]]').join('');
        }

        item = item.split('[[time_duration]]').join(v['time_duration']);
        item = item.split('[[city]]').join(v['city']);
        item = item.split('[[score]]').join(v['score'].toFixed(1));
        item = item.split('[[agent_id]]').join(v['agent_id']);
        item = item.split('[[agent_full_name]]').join(v['agent_full_name']);


        item = item.split('[[overall_success_rate]]').join(
            get_success_rate(v, true).toFixed(1));

        item = item.split('[[success_rate]]').join(
            get_success_rate(v, false).toFixed(1));

        item = item.split('[[overall_failed_listings]]').join(
            v['overall_failed_listings']);
        item = item.split('[[failed_listings]]').join(v['failed_listings']);

        item = item.split('[[overall_sold_listings]]').join(
            v['overall_sold_listings']);
        item = item.split('[[sold_listings]]').join(v['sold_listings']);

        if (v['sold_listings'] == 0) {
            return
        }

        item = item.split('[[overall_avg_dom]]').join(
            v['overall_avg_dom'].toFixed(1));
        item = item.split('[[avg_dom]]').join(v['avg_dom'].toFixed(1));

        item = item.split('[[overall_s2l_price]]').join(
            v['overall_s2l_price'].toFixed(1));
        item = item.split('[[s2l_price]]').join(v['s2l_price'].toFixed(1));

        get_val_from_breakdown(v, 'Condos', true)

        item = item.split('[[overall_single_family_sold]]').join(
          get_val_from_breakdown(v, 'Single Family Houses', true))

        item = item.split('[[single_family_sold]]').join(
          get_val_from_breakdown(v, 'Single Family Houses', false))

        item = item.split('[[overall_condo_sold]]').join(
          get_val_from_breakdown(v, 'Condo', true))

        item = item.split('[[condo_sold]]').join(
          get_val_from_breakdown(v, 'Condo', false))


        //item = item.split('[[overall_listings_breakdown_json]]').join(
        //    array_to_text(v['overall_listings_breakdown_json']))

        //item = item.split('[[listings_breakdown_json]]').join(
        //    array_to_text(v['listings_breakdown_json']));
        search_result += item;
      });

      $('#result-count').html(data['total']);
      $('#page-section').html(search_result);


      if (window.matchMedia("(max-width: 360px)").matches)
      {
          // The viewport is less than 768 pixels wide
         // document.write("This is a mobile device.");
            jQuery(".title").attr('colspan','1');
        } else {
            //alert(jQuery('td').attr('test'));
            //jQuery("td").removeAttr('test');
            jQuery(".title").attr('colspan','3');
    }


      // if(city == null) $(".city_results").remove()
      if(city_search == null && city == null) $(".city_results").remove()

      set_pined_load()
      swal.close()

      if(urlParams.get('search_input')) {
        $(".ser").val(urlParams.get('search_input'))
      }

      if(urlParams.get('city_search')) {
        $(".ser").val(urlParams.get('city_search'))
      }
      if(urlParams.get('search_input')) {
        $(".ser-map").val(urlParams.get('search_input'))
      }

      if(urlParams.get('city_search')) {
        $(".ser-map").val(urlParams.get('city_search'))
      }

      agentProfileImpressionTrack(agent_id_on_page);

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
    if (!(agent_ids)) return
    for(var agent_id of agent_ids.split(",")) {
        if(agent_id) {
            // click to set the button pined
            $(".toc-two[agent_id='" + agent_id + "']").find(
                ".toc-two-left-two-heading-right").click()

        }
    }
}

function set_pined_agent_ids() {
    setTimeout(function() {
        var pined_agents  = $(".toc-two .toc-two-left-two-heading-right")
        var selected_agent_ids = ''


        for(var pined_agent of pined_agents) {
            if ($(pined_agent).hasClass("toc-two-left-two-heading-right-next")) {
                continue
            }
            selected_agent_ids += $(pined_agent).closest(".toc-two").attr("agent_id") + ","
        }

        var pined_agents  = $(".toc-two .switch_on");

        $("input[type='checkbox']").change(function() {
            if(this.checked) {
                console.log("checked ")
            }
            else{
                console.log("unchecked ")
            }
        });

        var url = new URL(window.location.href);
        selected_agent_ids_arr = selected_agent_ids.split(',')
        // new_agent_ids = [...new Set(new_agent_ids)];
        selected_agent_ids = [...new Set(selected_agent_ids_arr)]

        url.searchParams.set("agents", selected_agent_ids.join(','));

        $("#agents").val(url.searchParams.get("agents"))

        selected_agent_ids = url.searchParams.get('agents').split(',');
        $.each(selected_agent_ids, function(k, v) {
        $('#toggler-'+v).addClass('toggle on');
        });

        window.history.pushState("", "", url)
    }, 10);
}

function get_val_from_breakdown(v, key, overall) {
    if (overall) {
        var items = JSON.parse(v['overall_listings_breakdown_json'])
    } else {
        var items = JSON.parse(v['listings_breakdown_json'])
    }
    for(var item of items) {
        if (item.includes(key)) {
            return item.split(":")[1].trim()
        }
    }
    return '0'
}

function get_success_rate(v, overall) {
    if (overall) {
        return (100 * (v['overall_sold_listings']) /
                (v['overall_sold_listings'] + v['overall_failed_listings']))
    } else {
        return (100 * (v['sold_listings']) /
                (v['sold_listings'] + v['failed_listings']))
    }
}

function abbreviateNumber(value) {
  let newValue = value;
  const suffixes = ["", "K", "M", "B","T"];
  let suffixNum = 0;
  while (newValue >= 1000) {
    newValue /= 1000;
    suffixNum++;
  }

  newValue = newValue.toPrecision(3);

  newValue += suffixes[suffixNum];
  return newValue;
}

function set_v_estimate(v_estimate) {
  if (v_estimate != 'null') {
    $(".y-price").text("$" + abbreviateNumber(v_estimate))
  }
}


function set_home_type_radio(home_type) {
    if (home_type == 'SINGLE_FAMILY') {
        $('input[name="babu"][value="Houses"]').prop("checked", true);
        $("#y-type").text('Houses')
    } else if (home_type == 'MANUFACTURED') {
        $('input[name="babu"][value="Manufactured"]').prop("checked", true);
        $("#y-type").text('Manufactured')

    } else if (home_type == 'CONDO') {
        $('input[name="babu"][value="Condos/co-ops"]').prop("checked", true);
        $("#y-type").text('Condos/co-ops')

    } else if (home_type == 'MULTI_FAMILY') {
        $('input[name="babu"][value="Multi-family"]').prop("checked", true);
        $("#y-type").text('Multi-family')

    } else if (home_type == 'LOT') {
        $('input[name="babu"][value="Lots/Land"]').prop("checked", true);
        $("#y-type").text('Lots/Land')

    } else if (home_type == 'TOWNHOUSE') {
        $('input[name="babu"][value="Townhomes"]').prop("checked", true);
        $("#y-type").text('Townhomes')
    }
}


function init_search_events() {
    // $(document).on('click', '.collect-lead', function() {
    //     $("body").prepend(lead_collection)
    // })

    $(document).on('click', '.toc-two-left-two-heading-right', function() {
        $(this).addClass("toc-two-left-two-heading-right-next");
        var pinText = $(this).find("p").text(); 
        $(this).find("p").text("Pin to top");

        //$(this).find("input").prop( "checked", false )
        // set_pined_agent_ids();

        sort_val = $(this).closest(".toc-two").attr('data-sort');
        sort_val = sort_val - 1;
        if(sort_val < 0) {
          sort_val = 1;
        }
        if (pinText == 'Unpin') {
            agentid = $(this).closest(".toc-two").attr("agent_id");
            var pinAgentArr = JSON.parse(localStorage.getItem("pin_agent_arr"));
            var index = pinAgentArr.indexOf(agentid);
            pinAgentArr.splice(index, 1);
            pinAgentArr = remove_duplicates(pinAgentArr);
            localStorage.setItem("pin_agent_arr", JSON.stringify(pinAgentArr));

            updateBrowserUrl();

            $(this).closest(".toc-two").detach().insertAfter(
                "div[data-sort="+sort_val+"]");
        }
    })


    $(document).on('click', 'a.toggler' ,function(){
        $(this).toggleClass('on');
    });


    // pin to top
    $(document).on('click', '.toc-two-left-two-heading-right-next', function() {
        $(this).removeClass("toc-two-left-two-heading-right-next");
        //$(this).find('i').toggleClass('fa-toggle-off fa-toggle-on');
        var pinText = $(this).find("p").text();
        $(this).find("p").text("Unpin");
        //$(this).find("input").prop( "checked", true )
        set_pined_agent_ids();
        if (pinText=='Pin to top') {
            agentid = $(this).closest(".toc-two").attr("agent_id");
            var pinAgentArr = JSON.parse(localStorage.getItem("pin_agent_arr"));
            pinAgentArr.push(agentid);
            pinAgentArr = remove_duplicates(pinAgentArr);
            localStorage.setItem("pin_agent_arr", JSON.stringify(pinAgentArr));

            updateBrowserUrl();

            $(this).closest(".toc-two").detach().prependTo("#page-section");
        }
    })

    $(document).on("click", "#filterSellers", function() {
        // do search
        if ($("#city-search-filter").val()) {

            var city = $("#city-search-filter").val()
            var redio= $("form input[type='radio']:checked").val();
            var i= 0;

            var page_params = get_page_initial_results()
            delete page_params['lat']
            delete page_params['lng']
            page_params['search_input'] = city
            page_params['city'] = city
            page_params['type']= redio
            $('.seller-filter input[type="checkbox"]'). each(function(){
                //console.log($(this).is(":checked")+" "+$(this). is(":not(:checked)"));
                if($(this).is(":checked")){
                    //alert('df');
                    //console.log($("label[for='" + this.id + "']").text());
                    i++;
                    var data = "test"+i;
                    page_params[data]= this.id.text();
                    //addId($("label[for='" + this.id + "']").text(),true, 'checkbox');
                }
            });
            redirectResults(page_params)
        }

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
        }).fail(function(err) {
            // alert('Got err');
            $('#msg-'+ selected_agent_id).html(err['responseText']);
            $('#msg-' + selected_agent_id).css("display", "block");
            console.log(err);
        });
    });
}

function insertParam(key, value)
{
    key = encodeURI(key); value = encodeURI(value);
    var kvp = document.location.search.substr(1).split('&');
    var i=kvp.length; var x; while(i--)
    {
        x = kvp[i].split('=');

        if (x[0]==key)
        {
            x[1] = value;
            kvp[i] = x.join('=');
            break;
        }
    }

    if(i<0) {kvp[kvp.length] = [key,value].join('=');}
    //this will reload the page, it's likely better to store this until finished
    document.location.search = kvp.join('&');
}

function pagination_footer(total) {
    // init bootpag
    const urlParams = new URLSearchParams(window.location.search);
    var page_num = urlParams.get('page_num', '1')

    if (page_num == null) {
        page_num = '1'
    }

    $('#page-selection').bootpag({
        total: Math.ceil(total/10),
        page: page_num,
        maxVisible: 8,
    }).on("page", function(event, num){
        insertParam('page_num', num)
    });
}

function getNationwideScore(time_duration=36) {
    var url = 'nationwide-score/' + time_duration;

    settings = get_settings(url, 'GET');
    settings['headers'] = null;
    $.ajax(settings).done(function (response) {
        data = JSON.parse(response);
        $('#nationwide-success-rate').html(data.success_rate_average.toFixed(2) + '%');
        $('#nationwide-sold-listing').html(data.total_sold_listing);
        $('#nationwide-failed-listing').html(data.total_failed_listing);
        $('#nationwide-s2l-price').html(data.s2l_price_average.toFixed(2) + '%');
        $('#nationwide-single-family-sold').html(data.single_family_sold_listing);
        $('#nationwide-condo-family-sold').html(data.condo_family_sold_listing);
    }).fail(function (err) {
        console.log(err);
    });
}
getNationwideScore();

$('#query-submit').on('click', function(){

    var name = $('#query-name').val();
    var phone = $('#query-phone').val();
    var address = $('#query-address').val();

    if (name == '' || phone == '' || address == '') {
        alert('All fields are required.');
        return false;
    }

    var queryParams = {};
    $.each(parseQuerystring(), function(k,v){
        if (v!='' && v!='null') {
            queryParams[k] = decodeURI(v);
        }
    })

    var data = {};
    data['name'] = name;
    data['phone'] = phone;
    data['address'] = address;
    data['queryParams'] = queryParams;

    $('#submit-query-spinner').show();
    $('#submit-query-check').hide();
    settings = get_settings('sent-email/', 'POST', JSON.stringify(data));
    $.ajax(settings).done(function (response) {
        data = JSON.parse(response);
        $('#query-name').val('');
        $('#query-phone').val('');
        $('#query-address').val('');

        $('#submit-query-spinner').hide();
        $('#submit-query-check').show();
        $('#submit-query-text').html('Sent ');
    }).fail(function (err) {
        alert('There is an internal server side error, please try later.')
        return false;
    });
    return false;
});

function remove_duplicates(arr) {
    var obj = {};
    var ret_arr = [];
    for (var i = 0; i < arr.length; i++) {
        obj[arr[i]] = true;
    }
    for (var key in obj) {
        ret_arr.push(key);
    }
    return ret_arr;
}

window.addEventListener("DOMContentLoaded", init_search_results, false);
