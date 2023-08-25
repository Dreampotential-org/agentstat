function populateStates() {
    $('.state-list').html('');
    var states = getStateList();
    $.each(states, function(k,v){
        var url = '/sitemap/'+k;
        var link = '<li><a href="'+url+'" >'+v+'</a></li>';
        $('.state-list').append(link);
    });
}

function populateCities(state) {
    $('.city-list').html('');
    var cities = getCityListByState(state);
    $.each(cities, function(k,v){
        var url = '/sitemap/'+state+'/'+v;
        var link = '<li><a href="'+url+'">'+v+'</a></li>';
        $('.city-list').append(link);
    });
}

function populateAgents(state, city) {
    $('.agent-citylist').html('');
    var page = 1
    var agents = getAgentListByStateAndCity(state, city, page);
    $.each(agents, function(k,v){
	    console.log(v)
        var url = '/profile/'+v.agent_slug;
        var link = '<li><a href="'+url+'">'+v.agent_full_name+'</a></li>';
        $('.agent-citylist').append(link);
    });
}

$(document).ready(function(){
    
    var url = window.location.pathname.split("/");;
    if (url[3]) {
        $('#agent-cityindex').show();
        populateAgents(url[2], url[3]);
    } else if (url[2]) {
        $('#cityindex').show();
        populateCities(url[2]);
    } else {
        $('#state-index').show();
        populateStates();
    }
});
