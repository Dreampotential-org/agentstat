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

$(document).ready(function(){	
    getCustomLink();

    getAgent();
});