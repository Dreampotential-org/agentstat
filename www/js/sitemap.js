function populateStates() {
    $('.state-list').html('');
    var states = getStateList();
    $.each(states, function(k,v){
        var link = '<li><a class="state-link" href="javascript:void(0)" data-state="'+k+'" >'+v+' • Homes for sale</a></li>';
        $('.state-list').append(link);
    });
}

function populateCities(state) {
    $('.city-list').html('');
    var cities = getCityListByState(state);
    $.each(cities, function(k,v){
        var link = '<li><a class="city-link" href="javascript:void(0)" data-state="'+state+'" data-city="'+v+'" >'+v+' Real Estate</a></li>';
        $('.city-list').append(link);
    });
}

function populateAgents(state, city) {
    $('.agent-citylist').html('');
    var agents = getAgentListByStateAndCity(state, city);
    $.each(agents, function(k,v){
        var url = '/profile/'+v.screen_name;
        var link = '<li><a href="'+url+'">'+v.full_name+' Real Estate Agent</a></li>';
        $('.agent-citylist').append(link);
    });
}

$(document).ready(function(){

    populateStates();
    populateCities('AK');
    populateAgents('AK', 'Anchorage');

    // city index function
    $(".show-more").click(function () {
        if($(".text").hasClass("show-more-height")) {
            $(this).text("Show Less ˄");
        } else {
            $(this).text("Show More ˅");
        }
        $(".text").toggleClass("show-more-height");
    });
        
    // state index function
    $(".show-more1").click(function () {
        if($(".text1").hasClass("show-more-height1")) {
            $(this).text("Show Less ˄");
        } else {
            $(this).text("Show More ˅");
        }
        $(".text1").toggleClass("show-more-height1");
    });

    // ageny city index function
    $(".show-more2").click(function () {
        if($(".text2").hasClass("show-more-height2")) {
            $(this).text("Show Less ˄");
        } else {
            $(this).text("Show More ˅");
        }

        $(".text2").toggleClass("show-more-height2");
    });

    $(document).on('click', '.state-link',function(){
        var state = $(this).data('state');
        populateCities(state);
    });

    $(document).on('click', '.city-link',function(){
        var state = $(this).data('state');
        var city = $(this).data('city');
        populateAgents(state, city);
    });

});