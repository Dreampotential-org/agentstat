function set_agent_tabs_default(data) {
    if (data['scores'][0] != undefined)  {
        $("#overall-avg-dom").html(data['overall_avg_dom'].toFixed(2));
        $("#overall-s2l-price").html(
            data['overall_s2l_price'].toFixed(2) + '%');
        $('.overall_sold_listings').html(data['overall_sold_listings']);

        $('.overall_score').html('-');
    }
}
