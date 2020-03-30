var global_results = null;
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
    }
    var type = urlParams.get('type')
    var city = urlParams.get('city')
    $("#city-search-filter").val(city)
    $(".ser").val(agent_name)

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

    search_address = localStorage.getItem('search_address');
    search_zipcode = localStorage.getItem('search_zipcode');
    search_city = localStorage.getItem('search_city');
    search_agent_name = localStorage.getItem('search_agent_name');
    search_state = localStorage.getItem('search_state');

    if (search_address) {
      new_params.push('address=' + search_address);
    }

    if (search_zipcode) {
      new_params.push('zipcode=' + search_zipcode);
    }

    if (search_city) {
      new_params.push('city=' + search_city);
    }

    if (search_agent_name) {
      new_params.push('agent_name=' + search_agent_name);
    }

    if (search_state) {
      new_params.push('state=' + search_state);
    }

    search = new_params.join('&');
    window.location = '/page-two-test.html?' + search
    // val = '/page-two-test.html?' + search;
    // console.log(val);

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

    // console.log(params)
    return params
}

function init_maps() {
    var input = document.getElementsByClassName('maps_input')[0];
    var page_input = document.getElementById('search_input');

    console.log("page_input",page_input)
    var options = {
        types: ['address'],
    }

    var autocomplete = new google.maps.places.Autocomplete(input, options);

    autocomplete.addListener('place_changed', fillIn);
    if(page_input != null){
      var autocomplete1 = new google.maps.places.Autocomplete(page_input, options);
      autocomplete1.addListener('place_changed', fillIn1);
    }

}

function get_page_initial_results() {

    const urlParams = new URLSearchParams(window.location.search);

    return {
        'search_input': urlParams.get('search_input'),
        'city': urlParams.get('city'),
        'lat': urlParams.get('lat'),
        'lng': urlParams.get('lng'),
        'state': urlParams.get('state'),
        'v_estimate': urlParams.get('v_estimate'),
        'type': urlParams.get('type'),
    }
}

function init() {
    global_results = get_page_initial_results()
    console.log(global_results)

    try {
        // init_maps();
    } catch(ex) {
        console.log(ex)
    }
    set_search_input()

    $("body").delegate(".serch_btn", "click", function(e) {
        redirectResults(global_results)
    })

    $("body").delegate("#go", "click", function(e) {
      $("#agent_name_or_id").val($("#search_input_agent").val())
      $('form#filterForm').submit();
    })

    $("body").delegate(".logout", "click", function(e) {
      localStorage.clear()
      window.location = '/'
    })
    $("body").delegate(".ser", "keyup", function(e) {
      if (e.keyCode == 13) {
        e.preventDefault();
        $("#agent_name_or_id").val($("#search_input_agent").val());
        $('form#filterForm').submit();
      }
    })

    $("body").delegate(".ser", "keyup", function(e) {
      $(".pac-container").css('z-index', 99999)
      if (e.which == 13 && $('.pac-container:visible').length) return false;
      if (e.keyCode == 13) {
      }
  })
}

window.addEventListener("DOMContentLoaded", init, false);

$(document).ready(function () {

  const urlParams = new URLSearchParams(window.location.search)

  $('.ser').val(urlParams.get('agent_name'));

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
    url: 'https://app.agentstat.com/api/px/',
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
    var string = msg.toLowerCase();
    var substring = "script error";
    var url = 'https://hooks.slack.com/services/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'
    if (string.indexOf(substring) > -1){
        alert('Script Error: See Browser Console for Detail');
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

$(document).ready(function () {
    address = localStorage.search_address;
    if (address) {
      $('.ser').val(address);
      $('.ser').addClass('maps_input');
    }
});

$(document).on('click', '.custom_radio', function() {
  localStorage.current_search_type = $(this).text();
  search_key = localStorage.current_search_type.toLowerCase();
  search_key = 'search_' + search_key.split(' ').join('_');

  if (search_key === 'search_agent_name') {
    $('#ser-state-id').html(localStorage.search_state);
  }

  if (search_key === 'search_address') {
    $('.ser').addClass('maps_input');
  } else {
    $('.ser').removeClass('maps_input');
  }

  $('.ser').val(localStorage.getItem(search_key));
});

$(document).on('click', '#allstate>li', function() {
  localStorage.setItem('search_state', $(this).text());
});

$('.ser').change(function() {
  search_key = localStorage.current_search_type.toLowerCase();
  search_key = 'search_' + search_key.split(' ').join('_');

  localStorage.setItem(search_key, $(this).val());
});
