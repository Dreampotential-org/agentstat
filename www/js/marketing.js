function getAgent() {
    settings = get_settings('agents/'+localStorage.getItem('agent_id'), 'GET');
    settings['headers'] = null;
    $.ajax(settings).done(function (response) {
        var data = JSON.parse(response);
        setTimeout(function(){
            cityDropdownPopulate(data['cities']);
        },2000);
    }); 
}

function getMarketingPartner() {
    settings = get_settings('marketing-partner/', 'GET');
    $.ajax(settings).done(function (response) {
        var data = JSON.parse(response);
        
        $('#lead_ppc_gold_buyer').val(data['lead_ppc_gold_buyer']);
        $('#lead_ppl_gold_seller').val(data['lead_ppl_gold_seller']);
        $('#lead_ppl_gold_buyer').val(data['lead_ppl_gold_buyer']);
        $('#lead_ppc_gold_seller').val(data['lead_ppc_gold_seller']);

        $('#lead_ppc_silver_buyer').val(data['lead_ppc_silver_buyer']);
        $('#lead_ppl_silver_seller').val(data['lead_ppl_silver_seller']);
        $('#lead_ppl_silver_buyer').val(data['lead_ppl_silver_buyer']);
        $('#lead_ppc_silver_seller').val(data['lead_ppc_silver_seller']);

        $('#lead_ppc_bronze_buyer').val(data['lead_ppc_bronze_buyer']);
        $('#lead_ppl_bronze_seller').val(data['lead_ppl_bronze_seller']);
        $('#lead_ppl_bronze_buyer').val(data['lead_ppl_bronze_buyer']);
        $('#lead_ppc_bronze_seller').val(data['lead_ppc_bronze_seller']);

        $('#referral_ppc_buyer').val(data['referral_ppc_buyer']);
        $('#referral_ppc_seller').val(data['referral_ppc_seller']);
    }); 
}

function initDescription(){
    tab_tutorial_json = JSON.parse(localStorage.getItem('tab_tutorial_json'));
    if (tab_tutorial_json['custom_link_des_hide']) {
        $('.description-div').hide();
        $('.minimize-description').hide();
        $('.maximize-description').show();
    } else {
        $('.description-div').show();
        $('.minimize-description').show();
        $('.maximize-description').hide();
    }
}

function displayDescription(show=true) {
    if (show) {
        $('.description-div').show();
        $('.minimize-description').show();
        $('.maximize-description').hide();
        var custom_link_des_hide = false;
    } else {
        $('.description-div').hide();
        $('.minimize-description').hide();
        $('.maximize-description').show();
        var custom_link_des_hide = true;
    }

    tab_tutorial_json['custom_link_des_hide'] = custom_link_des_hide;
    localStorage.tab_tutorial_json = JSON.stringify(tab_tutorial_json);

    var data = {}
    data['tab_tutorial_json'] = localStorage.getItem('tab_tutorial_json');
    settings = get_settings('agent-profile/', 'PUT', JSON.stringify(data))
    $.ajax(settings).done();
}

$(document).ready(function(){	
    getCustomLink();
    getAgent();
    initDescription();

    getMarketingPartner();

    $('.minimize-description').on('click', function(){
        displayDescription(false);
    });

    $('.maximize-description').on('click', function(){
        displayDescription();
    });

    $('#make-it-rain-btn').on('click', function(){
        var data = {};
        data['lead_ppc_gold_buyer'] = parseInt($('#lead_ppc_gold_buyer').val());
        data['lead_ppl_gold_seller'] = parseInt($('#lead_ppl_gold_seller').val());
        data['lead_ppl_gold_buyer'] = parseInt($('#lead_ppl_gold_buyer').val());
        data['lead_ppc_gold_seller'] = parseInt($('#lead_ppc_gold_seller').val());

        data['lead_ppc_silver_buyer'] = parseInt($('#lead_ppc_silver_buyer').val());
        data['lead_ppl_silver_seller'] = parseInt($('#lead_ppl_silver_seller').val());
        data['lead_ppl_silver_buyer'] = parseInt($('#lead_ppl_silver_buyer').val());
        data['lead_ppc_silver_seller'] = parseInt($('#lead_ppc_silver_seller').val());

        data['lead_ppc_bronze_buyer'] = parseInt($('#lead_ppc_bronze_buyer').val());
        data['lead_ppl_bronze_seller'] = parseInt($('#lead_ppl_bronze_seller').val());
        data['lead_ppl_bronze_buyer'] = parseInt($('#lead_ppl_bronze_buyer').val());
        data['lead_ppc_bronze_seller'] = parseInt($('#lead_ppc_bronze_seller').val());

        data['referral_ppc_buyer'] = parseInt($('#referral_ppc_buyer').val());
        data['referral_ppc_seller'] = parseInt($('#referral_ppc_seller').val());

        $('#partner-spinner').show();
        $('#partner-check').hide();

        settings = get_settings('marketing-partner/', 'POST', JSON.stringify(data));
        $.ajax(settings).done(function (res) {
            $('#partner-spinner').hide();
            $('#partner-check').show();

        }).fail(function (err) {
            $('.msg').html(err['responseText']);
            console.log(err);
            alert(err);

            $('#partner-spinner').hide();
            $('#partner-check').hide();
        });
        
    });
});