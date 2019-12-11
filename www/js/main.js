function fillIn() {
    var place = this.getPlace();
    var addr = place.formatted_address

    var results = getSearchParams(place)
    console.log(results)
    redirectResults(results)
}

function redirectResults(results) {
    if ('city' in results) {
        window.location = (
            'https://agentstat.com/reports_v2/' + results['state'] +
            '/?city=' + results['city']
        )
    } else {
        // XXX hard coded in WA for agents state
        window.location = (
            'https://agentstat.com/reports_v2/WA' +
            '/?agent_name_or_id=' + results['agent_name']
        )
    }

}

function getSearchParams(place) {

    console.log(place)
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
    console.log(params)
    return params
}

function init() {
    var input = document.getElementById('search_input');
    var options = {
        types: ['address'],
    }

    var autocomplete = new google.maps.places.Autocomplete(input, options);
    autocomplete.addListener('place_changed', fillIn);

  $("body").delegate("#go", "click", function(e) {
    $("#agent_name_or_id").val($("#search_input_agent").val())
    $('form#filterForm').submit();
  })


  $("body").delegate("#search_input_agent", "keyup", function(e) {
    if (e.keyCode == 13) {
      e.preventDefault()
      $("#agent_name_or_id").val($("#search_input_agent").val())
      $('form#filterForm').submit();
    }
  })

  $("body").delegate("#search_input", "keyup", function(e) {

    if (e.which == 13 && $('.pac-container:visible').length) return false;

    if (e.keyCode == 13) {
    }
  })
}
window.addEventListener("DOMContentLoaded", init, false);
