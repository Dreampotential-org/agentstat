var agent_ids_order = [];
var all_agents=[];

function init_search_results() {
    load_search_results();
    init_search_events();
    populate_city_search_menu()
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
        text: "Hang tight while we crunch the data to find your exact match",
        icon: "info",
        buttons: false,
        closeOnEsc: false,
        closeOnClickOutside: false,
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
    }, 1000)



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
        filters.push('v_estimate=' + v_estimate);
        set_v_estimate(String(v_estimate))
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
    var data;
    var results;
    var search_result = '';

    var filters = get_search_filters();
    var state = urlParams.get('state');
    var city = urlParams.get('city');
    var agent_name=urlParams.get('agent_name')
    if (!(state)) state = "WA"

    filters.push('page=1');
    filters = '?' + filters.join('&');

    api_call_url = 'reports/' + state + '/' + filters;
    console.log("API Request: " + api_call_url);

    var settings = get_settings(api_call_url, 'GET');
    settings['headers'] = null;

    show_loading_screen();
    $.ajax(settings).done(function (response) {

      data = JSON.parse(response);
      results = data['results'];


      $.each(results, function(k, v) {
        agent_ids_order.push(v['agent_id']);
        all_agents.push(v);
        item = search_item_min.split('[[agent_name]]').join(v['agent_full_name']);
        item = item.split('[[agent_profile_link]]').join(
            get_profile_link(v['agent_id']));

            if(v['agent_picture'] == undefined || v['agent_picture'] == '')
            {
                picture_img = (
                    "<div class='toc-two-left-one'>" +
                    "<img class='rounded-circle toc-two-left-one' " +
                        "style='border-radius: 130px;margin-top: 21px;' " +
                        " src=' img/sh.png'></div>");
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
      if(city == null) $(".city_results").remove()
      set_pined_load()
      swal.close()

      if(urlParams.get('search_input')) {
        $(".ser").val(urlParams.get('search_input'))
      }
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
    //MYCODE
    for(var agent_id of agent_ids.split(",")) {
        if(agent_id) {
            // click to set the button pined
            $(".toc-two[agent_id='" + agent_id + "']").find(
                ".switch_on").click()
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


//MYCODE

    var pined_agents  = $(".toc-two .switch_on")
    // console.log(pined_agents)
    var selected_agent_ids = ''
    for(var pined_agent of pined_agents) {
        if ($(pined_agent).hasClass("switch")) {
            continue
        }
        selected_agent_ids += $(pined_agent).closest(
            ".toc-two").attr("agent_id") + ","
    }

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
    window.history.pushState("", "", url)
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
    $(".y-price").text("$" + abbreviateNumber(v_estimate))
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
        //$(this).find('i').addClass('fa-toggle-off')
        //$(this).find('i').toggleClass('fa-toggle-on fa-toggle-off')
        $(this).find("p").text("Pin to top")
        console.log("pin to top")
        //$(this).find("input").prop( "checked", false )
        set_pined_agent_ids()

        $(this).closest(".toc-two").detach().appendTo("#page-section")

    })


    $(document).on('click', 'a.toggler' ,function(){
        $(this).toggleClass('on');
    });


       //MYCODE

    $(document).on('click', '.switch_on', function() {
        $(this).addClass("switch");
        $(this).find("p").text("Pin to top")
        set_pined_agent_ids()

        $(this).closest(".toc-two").detach().appendTo("#page-section")

    })

    $(document).on('click', '.switch', function() {
        $(this).removeClass("switch");
        $(this).find("p").text("Unpin")
        set_pined_agent_ids()

        $(this).closest(".toc-two").detach().prependTo("#page-section")
    })
    //end my code

    $(document).on('click', '.toc-two-left-two-heading-right-next', function() {
        $(this).removeClass("toc-two-left-two-heading-right-next");
        //$(this).find('i').toggleClass('fa-toggle-off fa-toggle-on');
        $(this).find("p").text("Unpin")
        console.log("Unpin")
        //$(this).find("input").prop( "checked", true )
        set_pined_agent_ids()

        $(this).closest(".toc-two").detach().prependTo("#page-section")
    })

    $(document).on("click", "#filterSellers", function() {
        // do search
        if ($("#city-search-filter").val()) {
            
            var city = $("#city-search-filter").val()
            var redio= $("form input[type='radio']:checked").val();
                var i= 0;
           

            alert(city)
            alert(redio)
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

window.addEventListener("DOMContentLoaded", init_search_results, false);
