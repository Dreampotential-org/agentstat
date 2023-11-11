var transactionId = null;
var record_status = 'new';
var transactionObj = null;

function init() {
    is_loggon();
    load_agent();

    load_states();

    load_active_list();
}

function currencyFormat(num) {
    var num = parseInt(num);
    return '$' + num.toFixed(0).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
}


function load_agent() {
    const urlParams = new URLSearchParams(window.location.search)
    var agent_id =  urlParams.get('agent_id');
    var city =  urlParams.get('city');

    if (agent_id) {
        $(".claim_profile").attr("href", "/signup.html?agent_id=" + agent_id)
    }


    var api_call_url = 'transactions/';
    if(city !== null) {
        api_call_url += '?city=' + city;
    }
    settings = get_settings(api_call_url, 'GET');

    $.ajax(settings).done(function (response) {
        data = JSON.parse(response);
        $('.agent_name').val(data['agent_name']);
        $.each($('.agent_name'), function() { $(this).html(data['full_name']) });
        var name_city = data['full_name'] + ' - ' + data['city'];

        if(city !== null) {
        $('#city-tab').text(city);
        }

        populate_transaction(data['agent_lists']);
        
    }).fail(function(err){
        console.log(err);
    });
}

function load_active_list() {
    
    var agent_id = localStorage.getItem('agent_id');

    settings = get_settings('agent-active-list/'+agent_id, 'GET');

    $.ajax(settings).done(function (response) {
        data = JSON.parse(response);
        populate_active_transaction(data);
    }).fail(function(err){
        console.log(err);
    });
}



$(document).on('change click', '.closeform', function() {
    $(this).closest('tr').fadeOut('slow');
});

$(document).on('change click', '.notebtn', function(){
    data_id = $(this).attr('data-id');

    data = {}
    data['agent_list'] = data_id;
    data['note'] = $('#note-'+data_id).val();
    data['agent_profile_id'] = localStorage.getItem('profile_id');

    $('#note-spinner-'+data_id).show();
    $('#note-check-'+data_id).hide();

    api_call_url = 'agent-list-note/' + agent_list_id + '/';
    settings = get_settings(api_call_url, 'POST', JSON.stringify(data));
    settings['headers'] = null;
    $.ajax(settings).done(function (response) {
        $('#note-spinner-'+data_id).hide();
        $('#note-check-'+data_id).show();
    }).fail(function(err) {
        $('#note-spinner-'+data_id).hide();
        $('#note-check-'+data_id).hide();
        console.log(err);
    });
});

$(document).on('click', '.del-trans-btn', function(){
    var data_id = $(this).data('id');
    bootbox.confirm({
        centerVertical: true,
        title: 'Delete Transaction?',
        message: "You cannot undo deleted transaction. Are you sure to continue.",
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
                $('#del-trans-spinner-'+data_id).show();

                api_call_url = 'delete-list/' + data_id + '/';
                settings = get_settings(api_call_url, 'DELETE');
                settings['headers'] = null;
                $.ajax(settings).done(function (response) {
                    show_message('Success! Transacion has been deleted', 3000);
                    setInterval(function(){
                        location.reload();
                    }, 3000);
                }).fail(function(err) {
                    $('#del-trans-spinner-'+data_id).hide();
                    console.log(err);
                });
            } 
        }
    });
});

$(document).on('click', '.editTransaction', function(){
    transactionId = $(this).data('id');
    record_status = 'edit';
    $('#edit-transaction-spinner-'+transactionId).show();
    
    api_call_url = 'agent-list-update/' + transactionId + '/';
    settings = get_settings(api_call_url, 'GET');
    settings['headers'] = null;
    $.ajax(settings).done(function (response) {
        $('#edit-transaction-spinner-'+transactionId).hide();
        transactionObj = response;
        var data = JSON.parse(response);
        
        $('#address_text').val(data['address_text']);
        $('#city').val(data['city']);
        $('#state').val(data['state']);
        $('#zipcode').val(data['zipcode']);
        $('#home_type').val(data['home_type']);
        $('#list_date').val(dateFormat(data['list_date']));
        $('#sold_date').val(dateFormat(data['sold_date']));
        $('#list_price_int').val(data['list_price_int']);
        $('#sold_price_int').val(data['sold_price_int']);
        $('#inputState').val(data['represented']);
        $('#beds').val(data['beds']);
        $('#baths').val(data['baths']);

        $('#addTransaction').modal('show');
        
    }).fail(function(err) {
        $('#edit-transaction-spinner-'+transactionId).hide();
        console.log(err);
    });
});

$(document).on('change click', '#save-transaction', function(){
    $('#save-transaction-spinner').show();
    $('#save-transaction-check').hide();
    
    data = {}
    data['id'] = transactionId;
    data['address_text'] = $('#address_text').val();
    data['city'] = $('#city').val();
    data['state'] = $('#state').val();
    data['zipcode'] = $('#zipcode').val();
    data['home_type'] = $('#home_type').val();
    data['list_date'] = $('#list_date').val();
    data['sold_date'] = $('#sold_date').val();
    data['list_price_int'] = parseInt($('#list_price_int').val());
    data['sold_price_int'] = parseInt($('#sold_price_int').val());
    data['represented'] = $('#inputState').val();
    data['beds'] = $('#beds').val();
    data['baths'] = $('#baths').val();
    data['record_status'] = record_status;
    data['old_list_data'] = transactionObj;

    if (data['address_text'] == '' || data['city'] == '' || data['state'] == '' || data['zipcode'] == '' 
        || data['list_date'] == '' || data['sold_date'] == '' || data['list_price_int'] == '' 
        || data['sold_price_int'] == '') {

        show_message('Error! Enter transaction valid data', 3000);

        $('#save-transaction-spinner').hide();
        return false;
    }

    if (Number.isInteger(data['list_price_int']) == false || 
        Number.isInteger(data['sold_price_int']) == false) {
        
        show_message('Error! Price should be numeric value', 3000);

        $('#save-transaction-spinner').hide();
        return false;
    }

    var completeAddr = data['address_text']+', '+data['city']+', '+data['state']+', '+data['zipcode'];
    var coordinates = getCoordinates(completeAddr);
    
    data['latitude'] = coordinates.lat;
    data['longitude'] = coordinates.lng;

    api_call_url = 'create-transaction/';
    settings = get_settings(api_call_url, 'POST', JSON.stringify(data));
    $.ajax(settings).done(function (response) {
        var msg = JSON.parse(response);
        $("#transaction-msg").css('display', 'block');
        setInterval(function(){
            location.reload();
        }, 3000);
    }).fail(function(err) {
        // $('#save-transaction-spinner').hide();
        // $('#save-transaction-check').hide();
        console.log(err);
        setInterval(function(){
            location.reload();
        }, 3000);
    });
});

$('.add-transaction-btn').click(function(){
    transactionId = null;
    record_status = 'new';
    $('input[type=text], #beds, #baths').val('');
});

$(document).ready(function() {
    $('#list_date').datepicker({
        format: 'mm/dd/yy',
        autoclose: true,
        endDate: new Date()
    });
    $('#sold_date').datepicker({
        format: 'mm/dd/yy',
        autoclose: true,
        endDate: new Date()
    });
});

window.addEventListener("DOMContentLoaded", init, false);
