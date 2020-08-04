const urlParams = new URLSearchParams(window.location.search)

leads = {};

var locations = [];
var agent_id = urlParams.get('agent_id');

var matchedScoreObj = {}
var cityScoreAllData = {};
var agentOverallScoreObj = {}
var cityFilter = '';
var propertyTypeFilter = '';
var cityOverallCount = 1;
var activePaginationPageNo = 1;

function init() {
  load_agent();
  $("#lead_phone").inputmask({ "mask": "(999) 999-9999" });
}

function currencyFormat(num) {
  // return '$' + num.toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
  try {
    return '$' + num.toFixed(0).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
  } catch (err) {
    return ''
  }
}

$(document).on('change click', '#claim_action', function () {
  console.log(agent_id);
  claim_api(agent_id);
});

function load_agent_score(duration = '36') {

  var url = 'agent_scores/' + transaction_query + '/?time_duration=' + duration;

  settings = get_settings(url, 'GET');
  settings['headers'] = null;
  $.ajax(settings).done(function (response) {
    data = JSON.parse(response);
    cityScoreAllData = data.agent_scores;
    var filterObj = getFilters();
    returnFilters(filterObj);

    $.each(data.overall_scores, function (k, v) {
      if (v.time_duration == duration) {
        agentOverallScoreObj = v;
      }
    });
    if (Object.keys(agentOverallScoreObj).length === 0) {
      agentOverallScoreObj = data.overall_scores[0];
    }
    setOverallAgentScore();

    populate_cities(data.agent_scores);
  }).fail(function (err) {
    console.log(err);
  });
}

function load_agent(ignore_city = true) {

  full_path = window.location.pathname;

  var screen_name = null
  if (full_path.split('/')[1] == 'profile') {
    screen_name = full_path.split('/')[3]
  }

  var city = null;
  if (ignore_city === false) {
    city = urlParams.get('city');
  }

  if ((agent_id)) {
    transaction_query = agent_id;
  } else {
    transaction_query = screen_name;
  }

  // if (city == null) {
  //   $('#new_transactions').html(`
  //     <iframe
  //       src='` + TRANSACTIONS_URL + transaction_query + `/'
  //       scrolling="no" style='width: 100%; height:700px; border: 0'
  //       ></iframe>
  //   `);
  // } else {
  //   $('#new_transactions').html(`
  //     <iframe
  //       src='` + TRANSACTIONS_URL + transaction_query + `/?city=`+ city +`'
  //       scrolling="no" style='width: 100%; height:500px; border: 0'
  //       ></iframe>
  //   `);
  // }

  // $('#city_agent_scores').html(`
  //   <iframe
  //     src='` + CITY_AGENT_SCORES_URL + transaction_query + `/'
  //     scrolling="no" style='width: 100%; height:500px; border: 0'
  //     ></iframe>
  // `);

  load_agent_score();

  if (agent_id) {
    if (localStorage.getItem('session_id') !== null && localStorage.getItem('session_id') !== 'null') {
      $(".claim_profile").attr("id", "claim_action");
      $(".claim_profile").attr("href", "#");
      $(".claim_profile").attr("onclick", "javascript: return false");

    } else {
      $(".claim_profile").attr("href", "/login.html?agent_id=" + agent_id)
    }
  }

  var api_call_url = '';

  if (screen_name) {
    api_call_url = 'agents/' + screen_name + '/'
  } else {
    api_call_url = 'agents/' + agent_id + '/';
  }

  if (city !== null) {
    api_call_url += '?city=' + city;
  }

  settings = get_settings(api_call_url, 'GET');

  settings['headers'] = null;


  agent_list_key = 'agent_lists';

  if (ignore_city == false) {
    agent_list_key = 'city_agent_lists'
  }
  show_loading_screen();

  // show loading
  $.ajax(settings).done(function (response) {
    swal.close()
    // remove loading
    data = JSON.parse(response);
    agent_id = data['id'];

    get_reviews()

    if (agent_id == localStorage.getItem('agent_id')) {
      $('.add-custom-link-btn').show();
    }

    $('.agent_name').val(data['agent_name']);
    
    $('.agent-first-name').text(data['full_name'].split(" ")[0]);
    
    $.each($('.agent_name'), function () {
      $(this).html(data['full_name']);
    });

    // Render Years In Business
    if (data['years_in_bussiness']){
      $('.agent-in-business').css('display', 'block')
      $('.agent-in-business-text').text(data['years_in_bussiness'])
    }
    // Add Languages
    if (data['language_fluencies'].length > 0) {
      var lang = ''
      data['language_fluencies'].forEach(function (val) {
        lang += val['val'] + ', '
      })

      lang = lang.substring(0, lang.length - 2)
      $('.agent-languages-text').text(lang)
      $('.agent-languages').show();
    }

    brokerage_info = data['brokerage_info'].split(/\r?\n/)[0];

    social_medias = ['website', 'blog', 'facebook', 'twitter', 'linkedin']
    $.each(social_medias, function (k, v) {
      if (!(data[v])) {
        $('#' + v).css('display', 'none');
      } else {
        $('#' + v).attr('href', data[v]);
      }
    });

    $('.brokerage_info').html(brokerage_info.toLowerCase());
    $.each($('.agent_namebroker_name'), function () {
      brokerage_info += ' ' + data['city'];

      $(this).html(
        data['full_name'].toLowerCase() + ' ' +
        `<span style="font-size: 13px;color: #007bff;"> </span>`
      );
    });
    // $.each($('.agent_name_loc'), function () {
    //     $(this).html(data['full_name']+' '+'is a ?? match for you (enter your location in the search bar to view % match)');
    // });
    $.each($('.answer_agent_name'), function () {
      $(this).html('Contact' + ' ' + data['full_name']);
    })

    var name_city = data['full_name'] + ' - ' + data['city'];

    $.each($('.agent_name_city'), function () {
      $(this).html(name_city)
    });
    $(".contact-agent").text("Contact " + data['full_name'].split(" ")[0])

    if (data['picture'] !== null) {
      $('.back-img').attr('src', data['picture']);
    }
    $('#about_us').html(data['about_us']);

    // if (data['claimed'] === true) {
    //   <a href="javascript:show_claim_screen();" id="already_claim_profile">Claimed</a>
    // } else {
    //   if (isLogin) {
    //     <a href="/profile-connect.html" id="">Claim Profile</a>
    //   } else {
    //     <a href="/login.html" id="">Claim Profile</a>
    //   }
    // }
    if (localStorage.agent_id == agent_id) {
      $('#edit_profile_wrapper').css('display', 'inline-block');
    }
    else if (data['claimed'] === true) {
      $('#already_claim_wrapper').css('display', 'inline-block');
    }
    else {
      $('#claim_wrapper').css('display', 'inline-block');
      if (localStorage.getItem('session_id')) {
        $('#claim_wrapper a').attr('href', '/connect-profile.html')
      }
    }

    if (data["specialties"] !== undefined) {
      var specialtiesText = '';
      
      //Sort wrt sorting
      data["specialties"] = data["specialties"].sort((a, b) => (a.sorting > b.sorting) ? 1 : -1)

      $.each(data['specialties'], function (k, v) {
        if (v.id != 6) {
          specialtiesText += v.val + ', ';
        }
        $('.agent-specialties').show();
      });

      $.each(data['specialties'], function (k, v) {
        if (v.id == 6) {
          specialtiesText += 'Other: ' + data['other_speciality_note'] + ', ' 
        }
        $('.agent-specialties').show();
      });

      $('.agent-specialties-text').html(specialtiesText.substring(0, specialtiesText.length - 2));
    }
    if ((data['listing_fee'] != "") && (data['listing_fee'] != null)) {
      $('.agent-listing-fee').css('display', 'block')
      $('.agent-listing-fee-text').html(data['listing_fee'])
    }
    if ((data['buyer_rebate'] != "") && (data['buyer_rebate'] != null)) {
      $('.agent-buyer-rebate').css('display', 'block')
      $('.agent-buyer-rebate-text').html(data['buyer_rebate'])
    }
    if ((data['type_of_listing_service'] != "") && (data['type_of_listing_service'] != null)) {
      $('.agent-listing-service').css('display', 'block')
      $('.agent-listing-service-text').html(data['type_of_listing_service'])
    }
    if ((data['provide_cma'] != "") && (data['provide_cma'] != null)) {
      $('.agent-provide-cmas').css('display', 'block')
    }

    // Render Licenses T Bottom
    if(data['licenses'] !== undefined && data['licenses'] !== null && data['licenses'].length >0){
      var lic = data['licenses'][0]
      $('#license_about').text(' - '+lic.split(' ')[0]+' - '+lic.split(' ')[1])
    }

    if (data['real_estate_licence'] !== null && data['real_estate_licence'] != '') {
      $('#license_about').text(' - '+data['real_estate_licence']);
    }

    $(".alist").remove();
    index = 1;

    populate_transaction(data[agent_list_key], false);

    var coordinates = [];
    $.each(data[agent_list_key], function (k, v) {
      var obj = {
        lat: v.latitude,
        lng: v.longitude,
        address: v.address_text,
        status: v.status
      }
      coordinates.push(obj);
    });
    initTransactionMap(coordinates);

    agentProfileViewTrack()
  }).fail(function (err) {
    console.log(err);
  });
}



$(document).on('change click', '#leads-start div>ul>li>a', function () {
  leads = {};
  leads['looking_for'] = $(this).text();
  var looking_for = $(this).attr('id');
  $('#leads-start').css('display', 'None');
  if (looking_for == 'buy-home') {
    $('#leads-buy-step-one').css('display', 'block');
  } else if (looking_for == 'sell-home') {
    $('#leads-sell-step-one').css('display', 'block');
  } else {
    leads['selling'] = {};
    leads['buying'] = {};
    $('#leads-both-step-one').css('display', 'block');
  }
});

$(document).on('change click', '#leads-both-step-one div>ul>li>a', function () {
  leads['selling']['home_type'] = $(this).text();

  $('#leads-both-step-one').css('display', 'None');
  $('#leads-both-step-two').css('display', 'block');
});

$(document).on('change click', '#leads-both-step-two div>ul>li>a', function () {
  leads['selling']['how_much'] = $(this).text();

  $('#leads-both-step-two').css('display', 'None');
  $('#leads-both-step-three').css('display', 'block');
});

$(document).on('change click', '#leads-both-step-three div>ul>li>a', function () {
  leads['selling']['how_soon'] = $(this).text();

  $('#leads-both-step-three').css('display', 'None');
  $('#leads-both-step-four').css('display', 'block');
});

$(document).on('change click', '#leads-both-step-four div>ul>li>a', function () {
  leads['buying']['home_type'] = $(this).text();

  $('#leads-both-step-four').css('display', 'None');
  $('#leads-both-step-five').css('display', 'block');
});


$(document).on('change click', '#leads-both-step-five div>ul>li>a', function () {
  leads['buying']['how_much'] = $(this).text();

  $('#leads-both-step-five').css('display', 'None');
  $('#leads-both-step-six').css('display', 'block');
});

$(document).on('change click', '#leads-both-step-six div>ul>li>a', function () {
  leads['buying']['how_soon'] = $(this).text();

  $('#leads-both-step-six').css('display', 'None');
  $('#leads-both-step-seven').css('display', 'block');
});

$(document).on('change click', '#leads-both-step-seven div>ul>li>a', function () {
  leads['interest_reason'] = $(this).text();

  $('#leads-both-step-seven').css('display', 'None');
  $('#leads-form').css('display', 'block');
});

$(document).on('change click', '#leads-buy-step-one div>ul>li>a', function () {
  leads['home_type'] = $(this).text();

  $('#leads-buy-step-one').css('display', 'None');
  $('#leads-buy-step-two').css('display', 'block');
});

$(document).on('change click', '#leads-buy-step-two div>ul>li>a', function () {
  leads['how_much'] = $(this).text();

  $('#leads-buy-step-two').css('display', 'None');
  $('#leads-buy-step-three').css('display', 'block');
});


$(document).on('change click', '#leads-buy-step-three div>ul>li>a', function () {
  leads['how_soon'] = $(this).text();

  $('#leads-buy-step-three').css('display', 'None');
  $('#leads-buy-step-four').css('display', 'block');
});

$(document).on('change click', '#leads-buy-step-four div>ul>li>a', function () {
  leads['interest_reason'] = $(this).text();

  $('#leads-buy-step-four').css('display', 'None');
  $('#leads-form').css('display', 'block');
});

$(document).on('change click', '#leads-sell-step-one div>ul>li>a', function () {
  leads['home_type'] = $(this).text();

  $('#leads-sell-step-one').css('display', 'None');
  $('#leads-sell-step-two').css('display', 'block');
});

$(document).on('change click', '#leads-sell-step-two div>ul>li>a', function () {
  //leads = {};
  leads['how_much'] = $(this).text();

  $('#leads-sell-step-two').css('display', 'None');
  $('#leads-sell-step-three').css('display', 'block');
});

$(document).on('change click', '#leads-sell-step-three div>ul>li>a', function () {
  //leads = {};
  leads['how_soon'] = $(this).text();

  $('#leads-sell-step-three').css('display', 'None');
  $('#leads-sell-step-four').css('display', 'block');
});

$(document).on('change click', '#leads-sell-step-four div>ul>li>a', function () {
  //leads = {};
  leads['interest_reason'] = $(this).text();

  $('#leads-sell-step-four').css('display', 'None');
  $('#leads-form').css('display', 'block');
});

$(document).on('change click', '#lead-submit', function () {
  var data = {};

  if (leads['looking_for'] == 'Both') {
    buying = leads['buying'];
    // data = leads['selling'];
    data = leads;
    // leads['buying'] = null;
    buying['interest_reason'] = data['interest_reason'];
    buying['looking_for'] = data['looking_for'];

    buying['email'] = $('#lead_email').val();
    buying['name'] = $('#lead_name').val();
    buying['phone'] = $('#lead_phone').val();
    buying['message'] = $('#lead_message').val();
    buying['agent'] = agent_id;
    buying['lead_type'] = 'buying';

    data['lead_type'] = 'selling';
    data['home_type'] = data['selling']['home_type'];
    data['how_much'] = data['selling']['how_much'];
    data['how_soon'] = data['selling']['how_soon'];
  } else {
    data = leads;
  }

  data['email'] = $('#lead_email').val();
  data['name'] = $('#lead_name').val();
  data['phone'] = $('#lead_phone').val();
  data['message'] = $('#lead_message').val();
  data['agent'] = agent_id;


  if (data['email'] === '' || data['name'] === '' || data['phone'] === '') {
    console.log('All fields are required.');
    $('.msg').html('All fields are required');
    return false;
  }

  if (data['looking_for'] == 'Sell a Home') {
    data['lead_type'] = 'selling';
  } else if (data['looking_for'] == 'Buy a Home') {
    data['lead_type'] = 'buying';
    data['home_type_buyer'] = data['home_type'];
    data['how_much_buyer'] = data['how_much'];
    data['how_soon_buyer'] = data['how_soon'];
    delete data['home_type'];
    delete data['how_much'];
    delete data['how_soon'];
  } else if (data['looking_for'] == 'Both') {
    data['lead_type'] = 'both';
    data['home_type_buyer'] = buying['home_type'];
    data['how_much_buyer'] = buying['how_much'];
    data['how_soon_buyer'] = buying['how_soon'];
  }

  settings = get_settings('lead/', 'POST', JSON.stringify(data));
  settings['headers'] = null;
  $.ajax(settings).done(function (response) {

    var msg = JSON.parse(response);
    $('#leads-form').css('display', 'none');
    $('#leads-step-four').css('display', 'block');

    if (typeof buying !== 'undefined') {
      saveLeadTracking(data, buying);
    } else {
      saveLeadTracking(data);
    }


  }).fail(function (err) {

    $('.msg').html(err['responseText']);
    console.log(err);

  });
});

$(window).on('load', function () {
  const urlParams = new URLSearchParams(window.location.search)
  var city = urlParams.get('city');
  if (city !== null) {
    $('#city-tab').text(city);
    $('#city-tab').click();
  }
});

$(document).on('click', '.fidin', function () {
  //alert($(this).attr('passBtnID'));
  $('.fidout').each(function () {
    $('.fidout').fadeOut('slow');
  });

  if ($(this).next().is(":visible")) {
    $(this).next().fadeOut('slow');
  }
  else {
    $(this).next().fadeIn('slow');
  }
});

$('.fidout').click(function () {
  alert()
  //     debugger;
  //     $('.fidout').fadeOut('slow');
  //    if($('#fadediv').is(":visible")){
  //        console.log($('#fadediv').is(":visible"))
  //    }else{
  //       console.log($('#fadediv').is(":visible"))
  //    }
})
function closeBtnID(id) {
  $('#' + id).fadeOut('slow');
}

$(document).on('change click', '#city-tab', function () {
  $('#cityTabContent').css('display', 'block');
  $('#overallTabContent').css('display', 'none');
  load_agent(false);
});

$(document).on('change click', '#overall-tab', function () {
  $('#cityTabContent').css('display', 'none');
  $('#overallTabContent').css('display', 'block');

  load_agent();
});

$(document).on('click', '#already_claim_profile', function () {
  $('#want-claim').css('display', 'none');
  $('#submit-proof-form').css('display', 'block');
});

$(document).on('click', '#want-claim-yes', function () {
  $('#want-claim').css('display', 'none');
  $('#submit-proof-form').css('display', 'block');
});

function pagination(page) {

  console.log(page);
  total = page % 10 == 0 ? (page / 10) : (page / 10) + 1;
  console.log(total);

  if (page > 1) {
    $("#pagination-here").bootpag({
      total: page % 10 == 0 ? (page / 10) : (page / 10) + 1,
      page: 2,
      maxVisible: 3,
      leaps: true,
      firstLastUse: true,
      first: '←',
      last: '→',
      wrapClass: 'pagination',
      activeClass: 'active',
      disabledClass: 'disabled',
      nextClass: 'next',
      prevClass: 'prev',
      lastClass: 'last',
      firstClass: 'first'
      //href: "#result-page-{{number}}",
    });
  }

  //page click action
  $('#pagination-here').on("page", function (event, num) {
    //show / hide content or pull via ajax etc

    var range = num * 10;

    // if(num == 1){
    //     intial_item = range - 10;
    //     last_item = range - 1;
    // }else{
    intial_item = range - 10;
    last_item = range;
    //}

    console.log(".alist " + num);
    console.log("Range ", range)
    console.log(".intial_item " + intial_item);
    console.log(".last_item " + last_item);

    $(".alist").hide();
    for (var i = intial_item; i < last_item; i++) {
      $(".alist" + i).show();
    }


  });

}
function show_loading_screen() {
  swal({
    title: "Crunching Numbers!",
    text: "Hang tight while we fetch the records!",
    imageUrl: "/img/pop.png",
    showCancelButton: false,
    showConfirmButton: false,
    allowOutsideClick: false
  });
}

function show_claim_screen() {
  swal({
    title: "Claim Profile!",
    text: "Profile is claimed, would you like to a dispute?",
    icon: "warning",
    buttons: [
      'No, cancel it!',
      'Yes, I am sure!'
    ],
    dangerMode: true,
  }).then(function (isConfirm) {
    if (isConfirm) {

      $('#alreadyClaimedModal').modal('show');

    } else {
      // swal("Cancelled", "Your imaginary file is safe :)", "error");
    }
  });
}

$('#submit_proof_btn').click(function () {
  var form_data = {};
  var picture_data = $('#picture')[0].files[0]
  var real_estate_license = $('#real-estate-license')[0].files[0]

  var reader = new FileReader();
  reader.readAsDataURL(picture_data);

  var reader2 = new FileReader();
  reader2.readAsDataURL(real_estate_license);
  var picture_base64 = '';



  reader.onload = function () {

    reader2.onload = function () {
      real_estate_license_base64 = reader2.result;
    }

    picture_base64 = reader.result;
    form_data['id_picture'] = picture_base64;
    form_data['real_estate_license'] = picture_base64;
    form_data['full_name'] = $('#full_name').val();
    form_data['email'] = $('#email').val();
    form_data['brokerage_name'] = $('#brokerage-name').val();

    settings = get_settings('re-claim/', 'POST', JSON.stringify(form_data))
    settings['headers'] = null;

    $.ajax(settings).done(function (response) {

      $('#alreadyClaimedModal').modal('toggle');
      swal({
        title: "Claim Profile!",
        text: "We will review your dispute and get back to you within 48 hours",
        icon: "success",
      }).then(function (isConfirm) {
      });

    }).fail(function (err) {
      // alert('Got err');
      console.log(err);
      show_error(err);
    });
  };
  reader.onerror = function (error) {
    console.log('Error: ', error);
  };
});

function show_reviews(summary, reviews) {
  if (reviews.length == 0) {
    $('.reviews').append(`
      <div style="width:450px; padding:10px">
      There is no review.
      </div>
    `);
  }

  $.each(summary, function (k, v) {
    extra_info = '<span style="font-size:14px">' + v.extra_info + '</span>';
    if (v.extra_info == null) {
      extra_info = '';
    }

    $('.reviews').append(`
      <div style="padding: 5px 20px; width: 5500px">

          <span>` + v.category + extra_info + `: </span>
          <span style="margin: 3px 0 0 10px;">` + reviewStarHtml(v.summary) + `</span>

      </div>
    `);
  })
}

function get_reviews() {
  settings = get_settings('review/' + agent_id + '/', 'GET');
  settings['headers'] = null;
  $.ajax(settings).done(function (response) {
    var response = JSON.parse(response);
    agent_review(response.reviews, 1);

    if (response.average_review_rate === null) {
      $('.has-review').hide();
      $('.no-review').show();
    } else {
      $('.agent-rating').html(reviewStarHtml(response.average_review_rate));
      $('.reviews-count').html(response.reviews.length+' Reviews');

      show_reviews(response.average_review_categories, response.reviews);
    }
  }).fail(function (err) {
    console.log(err);
  });
}

$('#review-modal').click(function () {
  $('#exampleModal').modal('show');
});

$('.timestamps li a').click(function () {
  $('.timestamps li').removeClass('active');
  $(this).parent('li').addClass('active');
});

window.addEventListener("DOMContentLoaded", init, false);
// window.addEventListener("DOMContentLoaded", $('datatable').dataTable(), false);
