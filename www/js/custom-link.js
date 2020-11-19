var customlink_agent_screen_name = null;
var customlink_agent_state = null;
var customlink_agent_id = null;

$(document).ready(function(){
    //Render custom-link-form
	$.get('/custom-link-form.html', function(response){
		$('#custom-link-form').html(response)
	});
});

$(document).on('click', '#save-custom-link',function(){
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

$(document).on('click', '.copy-link',function(){
    var $temp = $("<input>");
    $("body").append($temp);
    $temp.val($('#input-custom-link').val()).select();
    document.execCommand("copy");
    $temp.remove();

    $('.copy-link').tooltip('show');
    setTimeout(function(){ 
        $('.copy-link').tooltip('hide'); 
    }, 3000);
});

$(document).on('click', '.delete-custom-link',function(){
    var custom_link_id = $(this).data('id');

    bootbox.confirm({
        message: "Are you sure to delete this custom link?",
        buttons: {
            cancel: {
                label: 'Cancel',
                className: 'btn-default'
            },
            confirm: {
                label: 'Delete',
                className: 'btn-danger'
            }
        },
        callback: function (result) {
            if (result===true) {
                settings = get_settings('custom-link/'+custom_link_id, 'DELETE');
                $.ajax(settings).done(function (response) {
                    show_message('Agent link is deleted successfully.');
                    getCustomLink(true);
                });            
            }
        }
    });
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
        var url = '';
        if (urlParams.has('agent_id')) {
            var url = window.location.protocol+'//'+window.location.hostname+window.location.pathname+'?agent_id='+urlParams.get('agent_id')+'&q='+data.slug;
        } else {
            var pathname = window.location.pathname;
            var splitPathname = pathname.split('/');
            if (splitPathname[1] == 'profile') {
                var url = window.location.protocol+'//'+window.location.hostname+'/profile/'+splitPathname[2]+'/'+data.slug;
            }
        }

        if (url == ''){
            if (customlink_agent_screen_name !== null && customlink_agent_screen_name !='') {
                var url = window.location.protocol+'//'+window.location.hostname+'/profile/'+customlink_agent_screen_name+'/'+data.slug;
            } else if (customlink_agent_id !== null) {
                var url = window.location.protocol+'//'+window.location.hostname+window.location.pathname+'?agent_id='+customlink_agent_id+'&q='+data.slug;   
            }
        }

        $('#input-custom-link').val(url);
        $('body').click();
        $('.success-link').click();
        
        getCustomLink(true);
        return false;
    }).fail(function (err) {
        alert('There is an internal server side error, please try later.')
        return false;
    });
    return false;
}
  
function getCustomLink(destroy=false) {
	settings = get_settings('custom-link/', 'GET');
	$.ajax(settings).done(function (response) {
        data = JSON.parse(response);
        
        customlink_agent_screen_name = data.agent_screen_name;
        customlink_agent_state = data.agent_state;
        customlink_agent_id = data.agent_id;
          
        populate_custom_links(data, destroy);
	}).fail(function (err) {
	  	console.log(err);
	});
}

function getCustomLinkSlug() {
    var urlParams = new URLSearchParams(window.location.search);
    if (urlParams.has('q')) {
        return urlParams.get('q');
    } else {
        var pathname = window.location.pathname;
        var splitPathname = pathname.split('/');
        if (splitPathname[1] == 'profile') {
            return splitPathname[3];
        }
    }
    return '';
}

function cityDropdownPopulate(citiesArr) {
    citiesArr = citiesArr.sort();
    if ($('#q-address-city-div').length != 0) {
        var html = '<span class="fake-select">';
            html += '<select id="q-address-city">';
                html += '<option value="">Select City</option>';
                
                $.each(citiesArr, function(k,v){
                    html += '<option>'+v+'</option>';
                });
            html += '</select>';
        html += '</span>';
        $('#q-address-city-div').html(html);
    }

    if ($('#q-city-div').length != 0) {
        var html = '<span class="fake-select">';
            html += '<select id="q-city">';
                html += '<option value="">Select City</option>';
                
                $.each(citiesArr, function(k,v){
                    html += '<option>'+v+'</option>';
                });
            html += '</select>';
        html += '</span>';
        $('#q-city-div').html(html);
    }

    if ($('#q-property-type-div').length != 0) {
        var html = `
        <span class="fake-select">
            <select id="q-property-type">
                <option value="">Select Type</option>
                <option>Single Family</option>
                <option>Condo</option>
                <option>Townhouse</option>
                <option>Manufactured</option>
                <option>Multi Family</option>
                <option>Land</option>
                <option>Apartment</option>
                <option>Lot</option>
            </select>
        </span>
        `;
        $('#q-property-type-div').html(html);
    }
}