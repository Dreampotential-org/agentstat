//
profile_id = localStorage.profile_id
settings = get_settings('referral/'+ profile_id, 'GET')

// console.log(settings);

$.ajax(settings).done(function (response) {

    data = JSON.parse(response);
    console.log(data['results']);
    $.each(data['results'], function(k, v) {
      // console.log(v);
      item = referral_item
      item = item.split('[[date]]').join(v['created_at']);
      item = item.split('[[referral_type]]').join(v['referral_type']);
      item = item.split('[[referral_name]]').join(v['first_name'] + ' ' + v['last_name']);
      item = item.split('[[agent_name]]').join(v['agent_name']);
      item = item.split('[[referral_fee]]').join(v['referral_fee_percentage'] + '%');
      item = item.split('[[price]]').join(v['price_min'] + '-' + v['price_max'] + 'K');
      item = item.split('[[email]]').join(v['email']);
      item = item.split('[[phone]]').join(v['phone']);

      $(item).insertAfter('.titleHead');

    });

}).fail(function(err) {
    // alert('Got err');
    console.log(err);
    show_error(err);
});

$(document).ready(function(){
  $('#next').click(function() {
    console.log('TESTSSS');

    if ($('#step-1').css('display') == 'block') {

      var fields = ['first_name', 'last_name', 'email', 'phone_number', 'street_address',
        'city', 'zipcode', 'price_min', 'price_max', 'referral_fee', 'deadline', 'note'];

      var data = {};

      $.each(fields, function(k, v) {
        data[v] = $('#'+v).val();
      });

      console.log(data);

      var seller_unrequired_fields = []
      var buyer_unrequired_fields = []

      if($('#seller-type').is(':checked')) {
        // Seller validation

      } else if ($('#buyer-type').is(':checked')) {
        // Buyyer validation
      }

      $('#step-2').css('display', 'block');
      $('#step-1').css('display', 'none');
    }

  });

  $('#agent-search').on('keyup', function(){
    var search_term = $(this).val();
    if (search_term.length > 2) {
      // console.log('search');
      settings = get_settings('search_agent/' + search_term, 'GET');
      settings['headers'] = null;

      $.ajax(settings).done(function (response) {
        // console.log(response);
        data = JSON.parse(response);
        $('#agents').empty();
        $.each(data, function(k, v){
          $('#agents').append(`<div class="row">
            <div class="col-lg-1"> <input type="checkbox" id="agent-` + v['id'] + `"></div>
            <div class="col-lg-11"><label for="agent-` + v['id'] + `">` + v['full_name'] + `</label></div></div>`);
        });
      });
    }

  });

});
