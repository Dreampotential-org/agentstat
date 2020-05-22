function saveVisit(data, url, queryParamsUrl) {
    data['user_agent'] = navigator.userAgent;
    data['url'] = window.location.href;
    data['referrer'] = document.referrer;
    data['email'] = localStorage.getItem('email');
    
    var pageUrl = new URL(queryParamsUrl);
    var min_price = pageUrl.searchParams.get("min_price");
    var max_price = pageUrl.searchParams.get("max_price");
    if (data['q_price_range'] == undefined && min_price != null && max_price != null) {
        var average = (parseInt(min_price.substr(1)) + parseInt(max_price.substr(1)))/2;
        data['q_price_range'] =  mapPriceRange(average);
    } 

    var state = pageUrl.searchParams.get("state");
    if (state != null && state != 'null') {
        data['q_state'] = state;
    }

    var city = pageUrl.searchParams.get("city");
    if (city != null && city != 'null') {
        data['q_city'] = city;
    }

    var zipcode = pageUrl.searchParams.get("zipcode");
    if (zipcode != null && zipcode != 'null') {
        data['q_zip'] = zipcode;
    } else {
        data['q_zip'] = 'N/A';
    }
    
    var type = pageUrl.searchParams.get("type");
    if (data['q_type'] == undefined && type != null && type != 'null') {
        data['q_type'] = type;
    }
    
    settings = get_settings(url, 'POST', JSON.stringify(data));
    settings['headers'] = null;

    $.ajax(settings).done(function (response) {
        console.log(response);
    });
}

function agentProfileViewTrack() {
    data = {};
    data['agent'] = agent_id;
    data['page'] = 'profile';
    
    saveVisit(data, 'at/', document.referrer);
}

function agentProfileImpressionTrack(agent_ids) {
    data = {};
    data['agent_ids'] = agent_ids;
    data['page'] = 'search';

    saveVisit(data, 'at/', window.location.href);
}

function saveLeadTracking(res, ifBoth) {
    data = {};
    data['agent'] = res['agent'];
    data['q_price_range'] = res['how_much'];
    data['q_type'] = res['home_type'];

    if (res['looking_for'] == 'Sell a Home') {
        data['page'] = 'seller-lead';
        saveVisit(data, 'at/', document.referrer);
    } else if (res['looking_for'] == 'Buy a Home') {
        data['page'] = 'buyer-lead';
        saveVisit(data, 'at/', document.referrer);
    } else if (res['looking_for'] == 'Both') {
        data['page'] = 'seller-lead';
        saveVisit(data, 'at/', document.referrer);

        if (typeof ifBoth !== 'undefined') {
            data['q_price_range'] = ifBoth['how_much'];
            data['q_type'] = ifBoth['home_type'];
            data['page'] = 'buyer-lead';
            saveVisit(data, 'at/', document.referrer);
        }
    }
}

function mapPriceRange(val) {
    if (val <= 200) {
        return '$0 - 200K';
    } else if (val > 201 && val <= 400) {
        return '$200 - 400K';
    } else if (val > 401 && val <= 600) {
        return '$400 - 600K';
    } else if (val > 601 && val <= 800) {
        return '$600 - 800K';
    } else if (val > 801 && val <= 1000) {
        return '$800K - 1M';
    } else if (val > 1001) {
        return '$1M+';
    }
}