function init() {
  var input = document.getElementById('search_input');
  var autocomplete = new google.maps.places.Autocomplete(input);
  autocomplete.addListener('place_changed', fillIn);

  function getZipcode(place) {
    console.log(place)
    $("#formatted_address").val(place.formatted_address)
    for(var address_comp of place.address_components) {
         console.log(address_comp.types)
      if (address_comp.types[0] == "administrative_area_level_1") {
            console.log("City: " + address_comp.short_name)
      }
      if (address_comp.types[0] == 'locality') {
            console.log("City: " + address_comp.long_name)
        /*if (!(cities.includes(address_comp.long_name))) {
          swal("No data for city found for " + address_comp.long_name,
               "At this time we are only live in washington State",
               "error")
          $("#search_input").val("");
          return
        } */
        $("#city").val(address_comp.long_name);
        break
      }
    }
    $('form#filterForm').submit();
  }
  function fillIn() {
    var place = this.getPlace();
    var addr = place.formatted_address

    getZipcode(place)
  }

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
      e.preventDefault()
      $('form#filterForm').submit();
    }
  })

}
window.addEventListener("DOMContentLoaded", init, false);
