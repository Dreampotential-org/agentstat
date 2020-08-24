//
profile_id = localStorage.profile_id;
const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
received = urlParams.get('received');
var acceptance_deadline_hour = 1;

if (received == 'true') {
  settings = get_settings('referral-received/'+ profile_id, 'GET')
} else {
  settings = get_settings('referral/'+ profile_id, 'GET')
}
var form_data = {};

// console.log(settings);

$.ajax(settings).done(function (response) {

    data = JSON.parse(response);
    console.log(data['results']);
    $.each(data['results'], function(k, v) {
      // console.log(v);
      item = referral_item
      item = item.split('[[id]]').join(v['id']);
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

      var fields = ['first_name', 'last_name', 'email', 'phone_number',
        'city', 'price_min', 'price_max', 'referral_fee_percentage',
        'acceptance_deadline', 'referral_type'];

      //var data = {};

      $.each(fields, function(k, v) {
        form_data[v] = $('#'+v).val();
      });
      
      form_data['acceptance_deadline'] = acceptance_deadline_hour;
      form_data['price_min'] = form_data['price_min'].replace(/\D/g,'');
      form_data['price_max'] = form_data['price_max'].replace(/\D/g,'');

      var buyer_required_fields = ['first_name', 'last_name', 'email', 'phone_number', 'price_min', 'price_max', 'referral_fee_percentage', 'acceptance_deadline'];

      var error = false;
      referral_type = $('#referral_type').val()

      if(referral_type == 'Seller') {
        // Seller validation
        form_data['referral_type'] = 'Seller';
        $.each(fields, function(k, v){
          if ($('#'+v).val() == '' && v !== 'notes') {
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
          console.log(buyer_required_fields);
          if($.inArray(v, buyer_required_fields) !== -1 && $('#'+v).val() == ''){
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


          settings = get_settings('reports/WA/?page=1', 'GET');
          settings['headers'] = null;

          $.ajax(settings).done(function (response) {
            // console.log(response);
            data = JSON.parse(response);
            $('#agents').empty();
            $.each(data['results'], function(k, v){
              var brokerage_name = v['agent_brokerage_info'].split(/\r?\n/)[0];
              $('#agents').append(`
              <div class="row">
                <div class="col-lg-1 col-md-1 col-sm-1 col-xs-1"> <label id="checkbox-holder">
                <input name='selected_agents' value="` + v['agent_id'] + `" type="checkbox" id="agent-` + v['id'] + `">
                <span class="checkmark"></span>
              </label></div>
                <div class="col-lg-5 col-md-5 col-sm-5 col-xs-5">
                  <span class="agen-name">`+v['agent_full_name']+`<span/><br>
                  <label for="agent-` + v['agent_id'] + `">` +
                  brokerage_name + ` (` + v['agent_state'] + `)
                  </label>
                </div>
                
                <div class="col-lg-2 col-md-2 col-sm-2 col-xs-2">
                  <span>100%</span>
                </div>
                <div class="col-lg-2 col-md-2 col-sm-2 col-xs-2">
                  <span>100%</span>
                </div>
                <div class="col-lg-2 col-md-2 col-sm-2 col-xs-2" style="padding:0;"><a target='_blank' href="/profile/` + v['agent_state'] + `/` + v['agent_slug'] + `">View Profile</a></div>
              </div>`);
            });
          });

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
        data['acceptance_deadline'] = acceptance_deadline_hour;
        form_data['owner'] = profile_id;

        $.each(form_data['agent_ids'], function(k, v){

          form_data['agent'] = v;
          console.log(form_data);
          settings = get_settings('referral/', 'POST', JSON.stringify(form_data));
          $.ajax(settings).done(function(response){
            result = JSON.parse(response);
            console.log(result);
            window.location = result['sign_url'] + '?redirect_uri=https://agentstat.com/referrals/?';
          });

        });

        $('#referralModal').modal('hide');
      }
    } else if ($('#step-3').css('display') == 'block') {
      if($('input[name=agreement]:checked').val() == 'standart') {
        console.log('post form');
        //formatted_date = nform_data['acceptance_deadline']);
        data['acceptance_deadline'] = acceptance_deadline_hour;
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

    settings = get_settings('reports/WA/?page=1', 'GET');
    settings['headers'] = null;

    if (search_term.length > 2) {
      // console.log('search');

      settings = get_settings('reports/WA/?agent_name=' + search_term +'&page=1', 'GET');
      settings['headers'] = null;
    }


    $.ajax(settings).done(function (response) {
      // console.log(response);
      data = JSON.parse(response);
      $('#agents').empty();
      $.each(data['results'], function(k, v){
        var brokerage_name = v['agent_brokerage_info'].split(/\r?\n/)[0];
        $('#agents').append(`
        <div class="row">
          <div class="col-lg-1 col-md-1 col-sm-1 col-xs-1"> <label id="checkbox-holder">
          <input name='selected_agents' value="` + v['agent_id'] + `" type="checkbox" id="agent-` + v['id'] + `">
          <span class="checkmark"></span>
        </label></div>
          <div class="col-lg-5 col-md-5 col-sm-5 col-xs-5">
            <span class="agen-name">`+v['agent_full_name']+`<span/><br>
            <label for="agent-` + v['agent_id'] + `">` +
            brokerage_name + ` (` + v['agent_state'] + `)
            </label>
          </div>
          
          <div class="col-lg-2 col-md-2 col-sm-2 col-xs-2">
            <span>100%</span>
          </div>
          <div class="col-lg-2 col-md-2 col-sm-2 col-xs-2">
            <span>100%</span>
          </div>
          <div class="col-lg-2 col-md-2 col-sm-2 col-xs-2" style="padding:0;"><a target='_blank' href="/profile/` + v['agent_state'] + `/` + v['agent_slug'] + `">View Profile</a></div>
        </div>`);
      });
    });
  });

  $('#radioBtn a').on('click', function(){
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

  const $valueSpan3 = $('.valueSpan3');
  const $value3 = $('#acceptance_deadline');

  $valueSpan3.html($value3.val());
  $value3.on('input change', () =>
   {
    var val = $value3.val();
    switch(val) {
      case '1':
        text = "1 hour";
        acceptance_deadline_hour = 1;
        $( ".borcolor" ).removeClass( "bg-border" );
        break;
      case '2':
        text = "3 hours";
        acceptance_deadline_hour = 3;
        $( ".borcolor" ).addClass( "bg-border" );
        $( ".borcolor" ).removeClass( "bg-border1" );
        break;
      case '3':
        text = "6 hours";
        acceptance_deadline_hour = 6;
        $( ".borcolor" ).addClass( "bg-border1" );
        $( ".borcolor" ).removeClass( "bg-border2" );
        break;
      case '4':
        text = "12 hours";
        acceptance_deadline_hour = 12;
        $( ".borcolor" ).addClass( "bg-border2" );
        $( ".borcolor" ).removeClass( "bg-border3" );
        break;
        
      case "5":
        text = "24 hours";
        acceptance_deadline_hour = 24;
        $( ".borcolor" ).addClass( "bg-border3" );
        $( ".borcolor" ).removeClass( "bg-border4" );
        break;
      case '6':
        text = "48 hours";
        acceptance_deadline_hour = 48;
        $( ".borcolor" ).addClass( "bg-border4" );
        $( ".borcolor" ).removeClass( "bg-border5" );
        break;
      case '7':
        text = "3 days";
        acceptance_deadline_hour = 72;
        $( ".borcolor" ).addClass( "bg-border5" );
        $( ".borcolor" ).removeClass( "bg-border6" );
        break;
      case '8':
        text = "7 days";
        acceptance_deadline_hour = 168;
        $( ".borcolor" ).addClass( "bg-border6" );
        break;

      default:
        text = "1 hour";
    }
    $valueSpan3.html(text);
  });


  $("#phone_number").inputmask({"mask": "(999) 999-9999"});

  $("input.number").inputmask('decimal', {
    'groupSeparator': ',',
    'autoGroup': true,
    'digits': 2,
    'prefix': '$ ',
    'placeholder': '',
    'rightAlign':false,

  });

  $('textarea').keyup(function() {
  
    var characterCount = $(this).val().length,
        current = $('#current'),
        maximum = $('#maximum'),
        theCount = $('#the-count');
    current.text(characterCount);
        
  });

  $(document).on('click', '.show-detail', function(){
    var id = $(this).data('id');
    $('#row-'+id).slideToggle( );
  });

});

$(document).on('click', 'input[name="selected_agents"]', function() {
    $('input[type="checkbox"]').not(this).prop('checked', false);
});

