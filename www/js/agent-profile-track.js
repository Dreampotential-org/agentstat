function agentTrack() {
    data = {};
    data['user_agent'] = navigator.userAgent;
    data['url'] = window.location.href;
    data['referrer'] = document.referrer;
    data['agent'] = agent_id;
    data['email'] = localStorage.getItem('email');


    $.ajax('http://ip-api.com/json').then(
        function success(response) {
            $.each(response, function(k, v){
                data['client_' + k] = v;
            });
            data['client_ip'] = data['client_query'];

            var url = new URL(data['referrer']);
            var c = url.searchParams.get("c");
            
            settings = get_settings('at/', 'POST', JSON.stringify(data));
            settings['headers'] = null;
            $.ajax(settings).done(function (response) {
                console.log(response);
            });
        },
    );

    
}