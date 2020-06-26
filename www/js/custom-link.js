$('#save-custom-link').on('click', function(){
    var slug = '';
    if($("input[type='radio'].q-address").is(':checked')) {
        var card_type = $("input[type='radio'].q-address:checked").val();
        if (card_type == 'address') {
            if ($('#q-address-street').val() == "" || $('#q-address-city').val() == "" || $('#q-address-zipcode').val() == "") {
                alert('Insert complete address.');
                return false;
            } 
            slug = $('#q-address-street').val()+'-'+$('#q-address-city').val()+'-'+$('#q-address-zipcode').val();

        } else if (card_type == 'city') {
            if ($('#q-city').val() == "") {
                alert('Insert city name.');
                return false;
            }
            slug = $('#q-city').val();
        } else if (card_type == 'zipcode') {
            if ($('#q-zipcode').val() == "") {
                alert('Insert zipcode.');
                return false;
            }
            slug = $('#q-zipcode').val();
        }
    }

    data = {};
    data['slug'] = cleanSlug(slug);
    data['street_address'] = $('#q-address-street').val();
    data['address_city'] = $('#q-address-city').val();
    data['address_zipcode'] = $('#q-address-zipcode').val();
    data['city'] = $('#q-city').val();
    data['zipcode'] = $('#q-zipcode').val();
    data['property_type'] = $('#q-property-type').val();
    data['min_price'] = '';
    data['max_price'] = '';

    addCustomLink(data);
    return false;
});

$('.copy-link').click(function(){
    var $temp = $("<input>");
    $("body").append($temp);
    $temp.val($('#input-custom-link').val()).select();
    document.execCommand("copy");
    $temp.remove();
});

function cleanSlug(str) {
    str = str.replace(/\s+/g,' ').trim();
    return str.replace(/ /g,"-");
}
  
function addCustomLink(data) {  
    settings = get_settings('custom-link/', 'POST', JSON.stringify(data));
    $.ajax(settings).done(function (response) {
        data = JSON.parse(response);
        
        var urlParams = new URLSearchParams(window.location.search);
        if (urlParams.has('agent_id')) {
            var url = window.location.protocol+'//'+window.location.hostname+window.location.pathname+'?agent_id='+urlParams.get('agent_id')+'&q='+data.slug;
        } else {
            var pathname = window.location.pathname;
            var splitPathname = pathname.split('/');
            if (splitPathname[1] == 'profile') {
                var url = window.location.protocol+'//'+window.location.hostname+'/profile/'+splitPathname[2]+'/'+splitPathname[3]+'/'+data.slug;
            }
        }

        $('#input-custom-link').val(url);
        $('body').click();
        $('.success-link').click();
        return false;
    }).fail(function (err) {
        alert('There is an internal server side error, please try later.')
        return false;
    });
    return false;
}
  
function getCustomLink() {
    settings = get_settings('custom-link/', 'GET');
    $.ajax(settings).done(function (response) {
        data = JSON.parse(response);
    }).fail(function (err) {
        console.log(err);
    });
  }
  
  function deleteCustomLink() {
    settings = get_settings('custom-link/4', 'DELETE');
    $.ajax(settings).done(function (response) {
        data = JSON.parse(response);

    }).fail(function (err) {
        console.log(err);
    });
}