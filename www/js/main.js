var global_results = null;

// Called on google maps autocomplete selection
function fillIn() {
    var place = this.getPlace();
    var addr = place.formatted_address

    var results = getSearchParams(place)
    global_results = results

    console.log(results)
    console.log(results.city)

    // if(results.city == undefined){
    //   $('#city-tab').text(results.state);
    //   load_agent(true);
    // }else
    // $('#city-tab').text(results.city);
    // load_agent(true);
    // redirectResults(results)

    $(".maps_input").focus();

}

function fillIn1() {
  var place = this.getPlace();
  var addr = place.formatted_address

  var results = getSearchParams(place)
  global_results = results
  console.log(results)
  console.log(results.city)
  if(results.city == undefined){
    $('#city-tab').text(results.state);
    load_agent(true);
  }else
  $('#city-tab').text(results.city);
  load_agent(true);
  // redirectResults(results)
}


function set_search_input() {
    const urlParams = new URLSearchParams(window.location.search)
    var agent_name = urlParams.get('agent_name');
    var home_type = urlParams.get('home_type', "SINGLE_FAMILY");
    if (agent_name) {
        $(".ser").val(agent_name)
        $(".ser-map").val(agent_name)
    }
    var type = urlParams.get('type')
    var city = urlParams.get('city')
    $("#city-search-filter").val(city)
    $(".ser").val(agent_name)
    $(".ser-map").val(agent_name)

    $('.seller-filter input[type="radio"]'). each(function() {
      //console.log($(this).is(":checked")+" "+$(this). is(":not(:checked)"));
      if($(this).val()== type){
        $(this). prop("checked", true);
          //alert('df');
          //console.log($("label[for='" + this.id + "']").text());
      }
      if($(this).is(":not(:checked)")){
          //console.log("Removing....",$("label[for='" + this.id + "']").text());
         // removeId($("label[for='" + this.id + "']").text(),true);
      }
  });
}

function get_v_estimate() {
    var min_val = convert_to_int($(".price-amount #one-left-in").val())
    var max_val = convert_to_int($(".price-amount #one-right-in").val())
    var total = 0;

    if (min_val && max_val) {
        return (convert_to_int(min_val) + convert_to_int(max_val))/2
    }
    if (min_val) {
        return convert_to_int(min_val)
    }

    // if none of these return prev-value from url if that is set
    const urlParams = new URLSearchParams(window.location.search);
    const v_estimate = urlParams.get('v_estimate');
    if(v_estimate) {
        set_v_estimate(String(v_estimate))
        return convert_to_int(v_estimate)
    }
}

function convert_to_int(v_estimate) {
    if (!(v_estimate)) {
        return null;
    }
    if(typeof(v_estimate) === 'number') {
        return v_estimate
    }
    console.log(v_estimate)
    console.log(typeof(v_estimate))
    if (v_estimate.includes("$")) {
        v_estimate = v_estimate.split("$")[1].trim()
    }
    // multi by 1000
    console.log(v_estimate)
    if (v_estimate.includes("K")) {
        v_estimate = parseInt(v_estimate)
        v_estimate *= 1000
    } else {
        v_estimate = parseInt(v_estimate)
    }
    return v_estimate
}

function get_home_type() {
    var home_type = $('.po-search input[name="babu"]:checked').val();
    if (home_type == 'Houses') {
        return 'SINGLE_FAMILY'
    } else if (home_type == 'Manufactured') {
        return 'MANUFACTURED'
    } else if (home_type == 'Condos/co-ops') {
        return 'CONDO'
    } else if (home_type == 'Multi-family') {
        return 'MULTI_FAMILY'
    } else if (home_type == 'Lots/Land') {
        return 'LOT'
    } else if (home_type == 'Townhomes') {
        return 'TOWNHOUSE'
    }
    return 'SINGLE_FAMILY'
}

function redirectResults(results) {
    var path = window.location.pathname;
    var search_params = window.location.search.replace('?', '');
    var params = search_params.split('&');
    var new_params = [];

    search_type = $('#y-address').text();
    search_type_map = $('#y-address-map').text();

    search_address = localStorage.getItem('search_address');
    search_zipcode = localStorage.getItem('search_zipcode');
    search_city = localStorage.getItem('search_city');
    search_agent_name = localStorage.getItem('search_agent_name');

    search_state = localStorage.getItem('search_state');
    search_home_type = localStorage.getItem('search_home_type');

    if (search_type != 'Agent Name ' && $('#y-type').text() != 'Type ') {
      search_home_type = $('#y-type').text().trim();
    }

    // search_address = $('.search_address').val();
    // search_zipcode = $('.search_zipcode').val();
    // search_city = $('.search_city').val();
    // search_agent_name = $('.search_agent_name').val();

    lat = localStorage.getItem('search_lat');
    lng = localStorage.getItem('search_lng');

    city_search_val = $('.city_search').val();

    if(!(search_address) && city_search_val) {
      search_city = city_search_val.split(',')[0];
      search_state = city_search_val.split(',')[1];
    }

    if (search_home_type) {
      new_params.push('home_type=' + search_home_type)
    }
    if (search_address) {
      new_params.push('address=' + search_address);
    }

    if (search_zipcode) {
      new_params.push('zipcode=' + search_zipcode);
    }

    if (search_city) {
      city_val = search_city.split(',')
      new_params.push('city=' + city_val[0]);
      if (city_val.length > 1) {
        new_params.push('state=' + city_val[1].trim());
      }
    }

    if (search_agent_name) {
      new_params.push('agent_name=' + search_agent_name);
    }

    if (search_state) {
      new_params.push('state=' + search_state);
    }

    if (lat) {
      new_params.push('lat=' + lat);
    }

    if (lng) {
      new_params.push('lng=' + lng);
    }

    if (new_params.length == 0) {
      initial = get_page_initial_results();
      $.each(initial, function(k, v){
        // data['navigator_' + k] = v;
        if(k == 'search_input') {
          new_params.push('address='+v);
        } else {
          new_params.push(k+'='+v);
        }
      });
    }
    // console.log(map_initial);
    min_price = $('input[name=min-price]').val()
    if (min_price) {
      new_params.push('min_price='+min_price)
    }

    max_price = $('input[name=max-price]').val()
    if (max_price) {
      new_params.push('max_price='+max_price);
    }

    $.each(params, function(k, v) {
      if (v.split('=')[0] == 'agents') {
        new_params.push(v);
      }
    });

    search_params_arr = search_params.split('&')
    $.each(search_params_arr, function(k, v){
      if (v.indexOf('agents=') > 0) {
        new_params.push(v);
      }
    });

    search = new_params.join('&');
    new_url = '/agents/?' + search;

    window.location = new_url;
    
    return false;

}

function getSearchParams(place) {
    console.log(place)
    var params = {}
    if (!('scope' in place) && 'name' in place) {
        params['agent_name'] = place.name
        params['search_input'] = place.name
        return params
    }


    params['search_input'] = place.formatted_address;
    for(var address_comp of place.address_components) {
        console.log(address_comp.types)
        if (address_comp.types[0] == "administrative_area_level_1") {
            console.log("City: " + address_comp.short_name)
            params['state'] = address_comp.short_name
        }
        if (address_comp.types[0] == 'locality') {
            params['city'] = address_comp.short_name
        }
    }

    params['lat'] = place.geometry.location.lat()
    params['lng'] = place.geometry.location.lng()

    localStorage.search_address = params['search_input'];
    localStorage.search_state = params['state'];
    localStorage.search_city = params['city'];
    localStorage.search_lat = params['lat'];
    localStorage.search_lng = params['lng'];

    return params
}

function init_maps() {

    var input = document.getElementsByClassName('maps_input')[0];
    var input_map = document.getElementsByClassName('maps_input_maps')[0];
    var page_input = document.getElementById('search_input');

    console.log("page_input",page_input)
    var options = {
        types: ['address'],
    }

    var autocomplete = new google.maps.places.Autocomplete(input, options);
    autocomplete.addListener('place_changed', fillIn);

    var inputs = document.getElementsByClassName('maps_input')
    if (inputs.length > 1) {
      var input_bottom = inputs[1];
      var input_map_bottom = document.getElementsByClassName(
        'maps_input_maps')[1];


      var autocomplete_bottom = new google.maps.places.Autocomplete(
            input_bottom, options);
      autocomplete_bottom.addListener('place_changed', fillIn);

    }

}

function get_page_initial_results() {

    const urlParams = new URLSearchParams(window.location.search);

    params = {
        'search_input': urlParams.get('address'),
        'city': urlParams.get('city'),
        'lat': urlParams.get('lat'),
        'lng': urlParams.get('lng'),
        'state': urlParams.get('state'),
        'v_estimate': urlParams.get('v_estimate'),
        'type': urlParams.get('type'),
    };

    address = params['search_input'];
    if (!(address)) {
      address = '';
    }

    agent_name = '';
    home_type = '';
    if (urlParams.get('agent_name')) {
      agent_name = urlParams.get('agent_name');
    }

    city = '';
    if (urlParams.get('city')) {
      city = urlParams.get('city');
    }

    zipcode = '';
    if (urlParams.get('zipcode')) {
      zipcode = urlParams.get('zipcode');
    }

    if (urlParams.get('home_type')) {
      home_type = urlParams.get('home_type');
      $('#dropdowntypes>ul>li:contains(' + home_type + ')').click();
    }

    if (!(params['state'])) {
      params['state'] = '';
    }

    if (!(params['city'])) {
      params['city'] = '';
    }


    // XXX store in url not localstore need to be able to send direct link
    if ((address)) {
      localStorage.setItem('search_address', address);
      localStorage.setItem('search_city', '');
      localStorage.setItem('search_agent_name', '');
      localStorage.setItem('search_state', params['state']);
      localStorage.setItem('search_home_type', home_type);
    }

    if (!(address)) {
      if(agent_name) {
        $('.dropdownaddress>ul>li:contains("Agent Name")').click();
        localStorage.setItem('search_address', '');
        localStorage.setItem('search_city', '');
        localStorage.setItem('search_agent_name', agent_name);
        localStorage.setItem('search_state', params['state']);
        localStorage.setItem('search_home_type', '');

      } else {
        if(city) {
          $('.dropdownaddress>ul>li:contains("City")').click();
          localStorage.setItem('search_address', '');
          localStorage.setItem('search_city', city);
          localStorage.setItem('search_agent_name', '');
          localStorage.setItem('search_state', params['state']);
          localStorage.setItem('search_home_type', '');
          console.log('CITYYYY');

        } else {
          if (zipcode) {
            $('.dropdownaddress>ul>li:contains("ZipCode")').click();

            localStorage.setItem('search_address', '');
            localStorage.setItem('search_city', '');
            localStorage.setItem('search_agent_name', '');
            localStorage.setItem('search_state', params['state']);
            localStorage.setItem('search_home_type', home_type);
          }
        }
      }
    }


    return params;
}

function init() {
    global_results = get_page_initial_results()
    console.log(global_results);

    try {
        init_maps();
    } catch(ex) {
        console.log(ex)
    }
    set_search_input()

    $("body").delegate(".serch_btn", "click", function(e) {
        redirectResults(global_results)
    });

    $('.ser').keydown(function(e){
        if (e.keyCode == 13 && global_results != null) {
          console.log(global_results)
          search_key = localStorage.current_search_type.toLowerCase();
          search_key = 'search_' + search_key.split(' ').join('_');
          localStorage.setItem(search_key, $(this).val());
          if (global_results &&
              $("#y-address").text().trim() == 'Address' &&
              'lat' in global_results && global_results['lat'] != null) {
                redirectResults(global_results);
            }
        }
    });

    $("body").delegate("#go", "click", function(e) {
      $("#agent_name_or_id").val($("#search_input_agent").val())
      $('form#filterForm').submit();
    })

    $("body").delegate(".ser", "keyup", function(e) {
      if (e.keyCode == 13) {
        e.preventDefault();
        // $("#agent_name_or_id").val($("#search_input_agent").val());
        // $('form#filterForm').submit();
        if(global_results) {
            redirectResults(global_results)
        }
      }
    });

}

window.addEventListener("DOMContentLoaded", init, false);

$(document).ready(function () {

  const urlParams = new URLSearchParams(window.location.search)

  $('.ser').val(urlParams.get('agent_name'));
  $('.ser-map').val(urlParams.get('agent_name'));
  data = {};
  data['user_agent'] = navigator.userAgent;
  data['url'] = window.location.href;
  data['referrer'] = document.referrer;
  data['local'] = {};
  data['navigator'] = {};
  data['screen'] = {};

  $.each(localStorage, function(k, v) {
    data['local_' + k] = v;
  });

  $.each(navigator, function(k, v){
    data['navigator_' + k] = v;
  });

  $.each(window.screen, function(k, v){
    data['screen_' + k] = v;
  })

  // console.log(urlParams);

  for(var value of urlParams.keys()) {
     data['query_' + value] = urlParams.get(value);
  }

  // console.log(JSON.stringify(data));
  $.ajax({
    // url: 'https://app.agentstat.com/api/px/',
    url: get_api_route('px/'),
    method: 'POST',
    success: function(html) {
      strReturn = html;
    },
    data: {'data': JSON.stringify(data)},
    async:true
  });

});

// on error tell us about it.
window.onerror = function (msg, url, lineNo, columnNo, error) {
    console.log(msg);
    var string = msg.toLowerCase();
    var substring = "script error";
    var url = 'https://hooks.slack.com/services/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'

    if (string.indexOf(substring) > -1){
        console.log(substring);
        // alert('Script Error: See Browser Console for Detail');
    } else {
        var message = [
            'Message: ' + msg,
            'URL: ' + url,
            'Line: ' + lineNo,
            'Column: ' + columnNo,
            'Error object: ' + JSON.stringify(error)
        ].join(' - ');

        $.post(url, JSON.stringify({"text": message}), function() {
            console.log("reported to slack")
        });

    }
    return false;
};

//  Start of Async Drift Code
!function() {
  var t;
  if (t = window.driftt = window.drift = window.driftt || [], !t.init) return t.invoked ? void (window.console && console.error && console.error("Drift snippet included twice.")) : (t.invoked = !0,
  t.methods = [ "identify", "config", "track", "reset", "debug", "show", "ping", "page", "hide", "off", "on" ],
  t.factory = function(e) {
    return function() {
      var n;
      return n = Array.prototype.slice.call(arguments), n.unshift(e), t.push(n), t;
    };
  }, t.methods.forEach(function(e) {
    t[e] = t.factory(e);
  }), t.load = function(t) {
    var e, n, o, i;
    e = 3e5, i = Math.ceil(new Date() / e) * e, o = document.createElement("script"),
    o.type = "text/javascript", o.async = !0, o.crossorigin = "anonymous", o.src = "https://js.driftt.com/include/" + i + "/" + t + ".js",
    n = document.getElementsByTagName("script")[0], n.parentNode.insertBefore(o, n);
  });
}();

drift.SNIPPET_VERSION = '0.3.1';
drift.load('f6y6f4usghc5');

localStorage.current_search_type = 'Address';
localStorage.current_search_type_map = 'Address';

localStorage.setItem('search_address', '');
localStorage.setItem('search_zipcode', '');
localStorage.setItem('search_city', '');
localStorage.setItem('search_agent_name', '');
localStorage.setItem('search_state', '');
localStorage.setItem('search_lat', '');
localStorage.setItem('search_lng', '');


$(document).ready(function () {
    const urlParams = new URLSearchParams(window.location.search)
    address = localStorage.search_address;
    city = urlParams.get('city');

    if (address) {
      $('.search_address').val(address);
      $('.search_address').addClass('maps_input');

      $('.ser-map').val(address);
      $('.ser-map').addClass('maps_input_maps');
    } else if (city) {
      $('.search_city').val(city);
    }

});


$(document).on('click', '.dropdowntypes>ul>li', function() {
  // console.log($(this).text());
  localStorage.setItem('search_home_type', $(this).text().trim());
});


$(document).on('click', '.dropdownaddress>ul>li', function() {
  console.log('dropdown click');
  localStorage.current_search_type = $(this).text();
  search_key = localStorage.current_search_type.toLowerCase();


  localStorage.current_search_type_map = $(this).text();
  search_key_map = localStorage.current_search_type_map.toLowerCase();

  search_key = 'search_' + search_key.split(' ').join('_');
  search_key_map = 'search_' + search_key.split(' ').join('_');

  console.log(search_key);
  console.log(search_key_map);

  if (search_key === 'search_agent_name') {
    if (localStorage.search_state) {
      $('.ser-state-id').html(localStorage.search_state);
    }
    // all state
    search_city = localStorage.getItem('search_city');
    console.log(search_city);

    if (search_city) {
      if (search_city.split(',').length > 1) {
          search_state = search_city.split(',')[1].trim();
          $('.'+ search_state +'-state').click();
      }
    }
  }

  if (search_key_map === 'search_agent_name') {
    $('#ser-state-map-id').html(localStorage.search_state);
  }

  $('.ser').css('display', 'none');
  $('.' + search_key).css('display', 'block');
  $('.' + search_key).attr('autocomplete', 'nop');

  if (search_key === 'search_city') {
    $('.' + search_key + '_bottom').css('display', 'block');
    $('.' + search_key + '_bottom').attr('autocomplete', 'nop');
  }

  $('.ser').val(localStorage.getItem(search_key));
  $('.ser-map').val(localStorage.getItem(search_key));

  localStorage.setItem('search_address', '');
  localStorage.setItem('search_city', '');
  localStorage.setItem('search_agent_name', '');
  localStorage.setItem('search_lat', '');
  localStorage.setItem('search_lng', '');

  $(".address-type-bottom").slideToggle();

});

$(document).on('click', '.allstate>li', function() {
  localStorage.setItem('search_state', $(this).text());
});


$('.ser').change(function() {
  search_key = localStorage.current_search_type.toLowerCase();
  search_key = 'search_' + search_key.split(' ').join('_');

  localStorage.setItem(search_key, $(this).val());
});

$('.ser-map').change(function() {
  search_key_map = localStorage.current_search_type_map.toLowerCase();
  search_key_map = 'search_' + search_key_map.split(' ').join('_');

  localStorage.setItem(search_key_map, $(this).val());
});

$(".search_city, .search_city_bottom").autocomplete({
    source: function (request, response) {

        if ($(this.element).hasClass('search_city_bottom')) {
          var city_keyword = $('.search_city_bottom').val();
        } else {
          var city_keyword = $('.search_city').val();
        }
        console.log(city_keyword);
        var api_call_url = 'city-search/' + city_keyword;
        var settings = get_settings(api_call_url, 'GET');
        var url = settings['url'];
        console.log('url: ' + url);

        jQuery.get(url, {
            query: request.term
        }, function (data) {
            console.log(data);
            new_data = [];
            $.each(data, function(k, v){
              new_data.push(v.city_state);
              console.log(v.city_state);
            });
            response(new_data);
        });
    },
    minLength: 3
});

$(document).ready(function() {
  if (localStorage.getItem('session_id')) {
    $('#login-menu').html(`
      <ul class="float-right">
                                    <li>
                                        <div class="dropdown profile show">
                                            <a class="dropdown-toggle activeLine" href="#" role="button" id="dropdownMenuLink" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                                <span><i class="fas fa-user-circle"></i></span>
                                            </a>

                                            <div class="dropdown-menu drop" aria-labelledby="dropdownMenuLink">
                                                <a class="dropdown-item " href="/inbox/">
                                                    <p>Dashboard</p>
                                                    <span>View your stats and backend</span>
                                                </a>
                                                <a class="dropdown-item" href="/profile-settings/">
                                                    <p>Profile Settings</p>
                                                    <span>Edit your profile info and account settings</span>
                                                </a>
                                                <a class="dropdown-item logout" href="javascript:void(0)">Sign Out</a>
                                            </div>
                                        </div>
                                    </li>
                                </ul>
      `);
  }
});
