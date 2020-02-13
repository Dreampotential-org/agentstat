function fillIn() {
    var place = this.getPlace();
    var addr = place.formatted_address

    var results = getSearchParams(place)
    console.log(results)
    redirectResults(results)
}


function set_search_input() {
    const urlParams = new URLSearchParams(window.location.search)
    var agent_name = urlParams.get('agent_name');
    if (agent_name) {
        $(".ser").val(agent_name)
    }
}


function redirectResults(results) {
    path = window.location.pathname;
    search_params = window.location.search.replace('?', '');
    params = search_params.split('&');
    var new_params = [];

    $.each(params, function(k, v) {
      if(v.split("=")[0] !== 'agent_name') {
        new_params.push(v);
      }
    });


    if ('city' in results) {
        new_params.push('state=' + results['state']);
        new_params.push('city=' + results['city']);
        new_params.push('lat=' + results['lat']);
        new_params.push('lng=' + results['lng']);
    }
    else {
        new_agent_name = $('.ser').val();
        new_params.push('agent_name='+new_agent_name);
    }
    // console.log(params);
    // console.log(new_params);
    search = new_params.join('&');
    window.location = '/page-two-test.html?' + search;
}

function getSearchParams(place) {

    // console.log(place)
    var params = {}
    if (!('scope' in place) && 'name' in place) {
        params['agent_name'] = place.name
        return params
    }
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
    var input = document.getElementsByClassName('ser')[0];
    var options = {
        types: ['address'],
    }

    var autocomplete = new google.maps.places.Autocomplete(input, options);
    autocomplete.addListener('place_changed', fillIn);
}

function init() {
    try {
        init_maps();
    } catch(ex) {
        console.log(ex)
    }
    set_search_input()

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


