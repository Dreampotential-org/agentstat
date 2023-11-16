var search_data = {}
function init() {
    init_maps_search()
    handle_clicks();
}


function init_maps_search() {
    var input = document.getElementById('address');

    var options = {
        types: ['address'],
    }

    var autocomplete = new google.maps.places.Autocomplete(input, options);
    autocomplete.addListener('place_changed', fillIn);
}


function handle_clicks() {
    $("body").delegate("#call_me", "click", function(e) {
        console.log("hello");
        do_search()
    });

    $("body").delegate("#search_now", "click", function(e) {
        do_search()
         console.log("hi");
    });
}

function do_search() {
    new_url = '/agents/?home_type=House'
    new_url += '&city=' + search_data['city']
    new_url += '&address=' + search_data['street_address']
    new_url += '&state=' + search_data['state']
    new_url += '&name=' + $("#name").val()
    new_url += '&phone=' + $("#phone").val()
    new_url += '&address_text=' + $("#address").val()
    // new_url=encodeURIComponent(new_url)
    console.log(new_url)
    window.location = new_url

}

function fillIn() {
    var place = this.getPlace();
    var addr = place.formatted_address
    search_data['street_address'] = place.formatted_address
    for(var address_comp of place.address_components) {
      // console.log(address_comp.types)
      if (address_comp.types[0] == "administrative_area_level_1") {
          search_data['state'] = address_comp.short_name
      }
      if (address_comp.types[0] == 'locality') {
          search_data['city'] = address_comp.short_name
      }
      if (address_comp.types[0] == 'postal_code') {
          search_data['zip_code'] = address_comp.short_name
      }
    }

    return search_data
}





window.addEventListener("DOMContentLoaded", init, false);
