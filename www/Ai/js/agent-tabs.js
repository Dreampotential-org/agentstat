function set_agent_tabs_default(data) {
    if (data['scores'][0] != undefined)  {
        $("#overall-avg-dom").html(data['overall_avg_dom'].toFixed(2));
        $("#overall-s2l-price").html(
            '$'+data['overall_s2l_ratio'].toFixed(2) + '%');
        $('.overall_sold_listings').html(data['overall_sold_listings']);

        $('.overall_score').html('-');
    }
    
}

function ifFilterMatched() {
    if (Object.keys(matchedScoreObj).length > 0) {
        var successRate = calculateSuccessRate(matchedScoreObj['failed_listings'], matchedScoreObj['sold_listings']);
        $('#overall-score').html(successRate+'%');
        

        if (matchedScoreObj['avg_dom']) {
            var city_avg_dom = Math.round(matchedScoreObj['avg_dom']);
            $('#overall-avg-dom').html(city_avg_dom);
        }
    
        if (matchedScoreObj['s2l_ratio']) {
            var s2l_ratio = Math.round(matchedScoreObj['s2l_ratio']);
            $('#overall-s2l-price').html(s2l_ratio + "%s");
        }
       
        if (matchedScoreObj['sold_listings']) {
            $('.overall_sold_listings').html(matchedScoreObj['sold_listings']);
        }
    }
}
