SERVER_URL = 'https://app.agentstat.com/';

// UNCOMMENT to connect to local django-zillow api instance
// SERVER_URL = 'http://localhost:8000/';

API_URL = SERVER_URL + 'api/';
REST_AUTH_URL = SERVER_URL + 'rest-auth/';

TRANSACTIONS_URL = 'https://app.agentstat.com/agentportal/transactions/'
CITY_AGENT_SCORES_URL = 'https://app.agentstat.com/agentportal/agent_scores/'

GOOGLE_MAP_KEY = 'AIzaSyB-Q1QzY9-g10FGGf14R6iglCMr1N46MLs';

function clean_text(text) {
    text = text.substr(0, 1).toUpperCase() + text.substr(1);
    return text.replace('_', ' ');
}

function show_error(err) {
    arr = JSON.parse(err['responseText']);
    error = "<ul>";
    $.each(arr, function (k, v) {
        error += "<li>Invalid " + clean_text(k) + ". " + v + "</li>";
    });
    error += "</ul>";

    $('.msg').html(error)
    $('.msg').css("display", "block");
    console.log(err);
}

function get_api_route(route) {
    return API_URL + route
}

function get_settings(url, method, data = null) {
    return {
        'async': true,
        'crossDomain': true,
        'headers': {
            'Authorization': 'Token ' + localStorage.getItem('session_id'),
        },
        'url': API_URL + url,
        'method': method,
        'processData': false,
        'data': data,
        'contentType': 'application/json',
        'mimeType': 'multipart/form-data',
    }
}

function get_settings_auth(url, method, data = null) {
    return {
        'async': true,
        'crossDomain': true,
        'headers': {
            'Authorization': 'Token ' + localStorage.getItem('session_id'),
        },
        'url': REST_AUTH_URL + url,
        'method': method,
        'processData': false,
        'data': data,
        'contentType': 'application/json',
        'mimeType': 'multipart/form-data',
    }
}

function call_api(callback, url, settings) {
    settings = get_settings(url, 'GET');

    $.ajax(settings).done(function (response) {
        var msg = JSON.parse(response);
        callback(msg);
    }).fail(function (err) {
        callback(false);
    });
}


function is_loggon() {
    session_id = localStorage.getItem('session_id');
    email = localStorage.getItem('email');
    if (session_id === null) {
        window.location = '/sign-in/';
    }

    call_api(
        function (res) {
            if (res == false) {
                window.location = '/sign-in/';
            }
            $('#profile-views').text(res['profile_views']);
            $('.agent-name').text(res['first_name'] + ' ' + res['last_name']);
        },
        'agent-profile/'
    );
}

function claim_api(agent_id) {
    data = { 'agent_id': agent_id }
    var settings = get_settings('claim/', 'POST', JSON.stringify(data));

    if (agent_id == "null") {
        localStorage.removeItem("claim_agent_id", null)
    }

    $.ajax(settings).done(function (response) {
        var msg = JSON.parse(response);
        localStorage.removeItem("claim_agent_id", null)
        localStorage.setItem("connect_profile", null);
        window.location = '/profile-settings/';
    }).fail(function (err) {
        // alert('Got err');
        console.log(err);
    });
}

function load_states() {
    settings = get_settings('states/', 'GET');
    settings['headers'] = {};

    $.ajax(settings).done(function (response) {
        var states = JSON.parse(response);
        $.each(states, function (k, v) {
            $('#state').append(`<option value='` + k + `'>` + v + `</option>`);
        });
    }).fail(function (err) {
        show_error(err);
    });
}

function search_log(data) {
    var settings = get_settings('search-log/', 'POST', JSON.stringify(data));

    $.ajax(settings).done(function (response) {
        var msg = JSON.parse(response);
        console.log(msg)
    }).fail(function (err) {
        console.log(err);
    });
}
