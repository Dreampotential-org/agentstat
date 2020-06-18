//
profile_id = localStorage.profile_id
settings = get_settings('referral/'+ profile_id, 'GET')
var form_data = {};

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
    if ($('#step-1').css('display') == 'block') {

      var fields = ['first_name', 'last_name', 'email', 'phone_number', 'street_address',
        'city', 'zipcode', 'price_min', 'price_max', 'referral_fee_percentage',
        'acceptance_deadline', 'notes', 'referral_type'];

      //var data = {};

      $.each(fields, function(k, v) {
        form_data[v] = $('#'+v).val();
      });

      var buyer_required_fields = ['first_name', 'last_name', 'email', 'phone_number', 'price_min', 'price_max', 'referral_fee_percentage', 'acceptance_deadline', 'notes'];

      var error = false;
      referral_type = $('#referral_type').val()

      if(referral_type == 'Seller') {
        // Seller validation
        form_data['referral_type'] = 'Seller';
        $.each(fields, function(k, v){
          if ($('#'+v).val() == '') {
            // console.log(v + ' is required');
            swal({
              title: "Validation Error!",
              text: "All fields are required!",
              icon: "warning",
              dangerMode: true,
            });
            error = true;

          }
        });

      } else if(referral_type == 'Buyer') {
        // Buyyer validation
        form_data['referral_type'] = 'Buyer';
        errors = '';
        $.each(fields, function(k, v){
          if($.inArray(v, buyer_required_fields) && $('#'+v).val() == ''){
            error = true;
            errors += v + ' ';
          }

          if(error == true) {
            swal({
              title: "Validation Error!",
              text: "You must fill in the following field(s)\n\n" + errors,
              icon: "warning",
              dangerMode: true,
            });
          }

        });
      }

      if (error == false) {
        if($('#step-1').css('display') == 'block'){
          $('#step-2').css('display', 'block');
          $('#step-1').css('display', 'none');
        }
      }
    } else if($('#step-2').css('display') == 'block') {
      form_data['agent_ids'] = []
      $('input[name="selected_agents"]:checked').each(function(){
        console.log($(this).val());
        form_data['agent_ids'].push($(this).val());
      });

      if(form_data['agent_ids'].length == 0) {
        swal({
          title: "Validation Error!",
          text: "You should select agent(s)",
          icon: "warning",
          dangerMode: true,
        });
      } else {
        // $('#step-2').css('display', 'none');
        // $('#step-3').css('display', 'block');
        data['acceptance_deadline'] = formatDate(form_data['acceptance_deadline'])
        form_data['owner'] = profile_id;

        $.each(form_data['agent_ids'], function(k, v){

          form_data['agent'] = v;
          console.log(form_data);
          settings = get_settings('referral/', 'POST', JSON.stringify(form_data));
          $.ajax(settings).done(function(response){
            result = JSON.parse(response);
            //console.log(result);
          });

        });

        swal({
          title: "Your referral has been created!",
          icon: "success",
          dangerMode: false,
        });

        $('#referralModal').modal('hide');
      }
    } else if ($('#step-3').css('display') == 'block') {
      if($('input[name=agreement]:checked').val() == 'standart') {
        console.log('post form');
        //formatted_date = nform_data['acceptance_deadline']);
        data['acceptance_deadline'] = formatDate(form_data['acceptance_deadline'])
        form_data['owner'] = profile_id;

        $.each(form_data['agent_ids'], function(k, v){

          form_data['agent'] = v;
          console.log(form_data);
          settings = get_settings('referral/', 'POST', JSON.stringify(form_data));
          $.ajax(settings).done(function(response){
            result = JSON.parse(response);
            //console.log(result);
          });

        });

        swal({
          title: "Your referral has been created!",
          icon: "success",
          dangerMode: false,
        });

        $('#referralModal').modal('hide');

      }

    }

  });

  function formatDate(date) {
    var d = new Date(date),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

    if (month.length < 2)
        month = '0' + month;
    if (day.length < 2)
        day = '0' + day;

    return [year, month, day].join('-');
}

  $('#agent-search').on('keyup', function(){
    var search_term = $(this).val();
    if (search_term.length > 2) {
      // console.log('search');
      settings = get_settings('search_agent/' + 'WA/' + search_term, 'GET');
      settings['headers'] = null;

      $.ajax(settings).done(function (response) {
        // console.log(response);
        data = JSON.parse(response);
        $('#agents').empty();
        $.each(data, function(k, v){
          $('#agents').append(`
          <div class="row">
            <div class="col-lg-1"> <input name='selected_agents' value="` + v['id'] + `" type="checkbox" id="agent-` + v['id'] + `"></div>
            <div class="col-lg-7">
              <label for="agent-` + v['id'] + `">` +
                v['full_name'] + ` (` + v['state'] + `)
              </label>
            </div>
            <div class="col-log-4"><a target='_blank' href="/profile/` + v['state'] + `/` + v['screen_name'] + `">View Profile</a></div>
          </div>`);
        });
      });
    }

  });

  $('#radioBtn a').on('click', function(){
    console.log('xxx');
      var sel = $(this).data('title');
      var tog = $(this).data('toggle');
      $('#'+tog).prop('value', sel);

      $('a[data-toggle="'+tog+'"]').not('[data-title="'+sel+'"]').removeClass('active').addClass('notActive');
      $('a[data-toggle="'+tog+'"][data-title="'+sel+'"]').removeClass('notActive').addClass('active');
  });

  const $valueSpan = $('.valueSpan2');
  const $value = $('#referral_fee_percentage');
  $valueSpan.html($value.val());
  $value.on('input change', () => {

    $valueSpan.html($value.val()+'%');
  });

});


