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

    $('.minimize-description').on('click', function(){
        displayDescription(false);
    });

    $('.maximize-description').on('click', function(){
        displayDescription();
    });
});