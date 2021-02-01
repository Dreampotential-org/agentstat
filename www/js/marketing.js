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

function load_profile() {
    settings = get_settings('agent-profile/', 'GET');
    $.ajax(settings).done(function (res) {
        var res = JSON.parse(res);
        $('#fb_email').val(res.fb_email);
        $('#fb_pw').val(res.fb_password);
        
        // ambassador tab
        if (res.screen_name === null && res.connector != '' && res.connector !== null) {
            var screen_name = res.connector.screen_name;
        } else {
            var screen_name = res.screen_name;
        }
        var url = WEBSITE_URL+'/?ambassador='+screen_name;
        $('#ambasar-url').val(url);

        $('#data-counter-val').html(res.onboarded_agents.length);

        $.each(res.onboarded_agents, function(k,v){
            if (v.screen_name) {
                var screen_name = v.screen_name;
            } else {
                var screen_name = v.zillow_agent_id;
            }
            var hyperLink = '<a href="/profile/'+screen_name+'" target="_blank" >'+v.first_name+' '+v.last_name+'</a>'


            var rowHtml = `
            <tr>
                <td class="table-column">`+hyperLink+ ` </td>
                <td class="table-column">` + niceDate(v.created_at, false) +`</td>
            </tr>
            `;

            $('#ambasadar-table-body').append(rowHtml);
        });

        $('#ambasadar-table').dataTable({
            "bSort" : false,
            "dom": 'lrtip',
            "bLengthChange": false,
            "pageLength": 10,
            "columnDefs": [
                { orderable: false, targets: -1 }
            ],
            "fnInfoCallback": function( oSettings, iStart, iEnd, iMax, iTotal, sPre ) {
                console.log(iStart);
                console.log(iEnd);
                var info = 'Showing '+iStart+' to '+iEnd+' of '+iTotal+' entries';
                return info;
            },
            "language": {
                paginate: {
                    next: '»',
                    previous: '«'
                }
              }
        });
    });
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

    $('#save-fb-cred-btn').on('click', function(){
        $('#fb-spinner').show();
        $('#fb-check').hide();

        var data = {};
        data['fb_email'] = $('#fb_email').val();
        data['fb_password'] = $('#fb_pw').val();

        settings = get_settings('agent-profile/', 'PUT', JSON.stringify(data));
        $.ajax(settings).done(function (res) {
            $('#fb-spinner').hide();
            $('#fb-check').show();
        }).fail(function (err) {
            alert(err['responseText']);
            $('#fb-spinner').hide();
            $('#fb-check').hide();
        });
        
    });

    load_profile()

    $(".fa-info-circle").tooltip();

    $(document).on('click', '#ambasy-filter',function(){
        var $temp = $("<input>");
        $("body").append($temp);
        $temp.val($('#ambasar-url').val()).select();
        document.execCommand("copy");
        $temp.remove();
    
        $('#ambasy-filter').tooltip('show');
        setTimeout(function(){ 
            $('#ambasy-filter').tooltip('hide'); 
        }, 3000);
    });
});