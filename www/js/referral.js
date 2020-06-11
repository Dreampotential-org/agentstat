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
      console.log(item);

      $(item).insertAfter('.titleHead');

    });

}).fail(function(err) {
    // alert('Got err');
    console.log(err);
    show_error(err);
});

