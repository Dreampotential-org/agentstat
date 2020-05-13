function agentTrack() {
    data = {};
    data['user_agent'] = navigator.userAgent;
    data['url'] = window.location.href;
    data['referrer'] = document.referrer;
    data['agent_profile_id'] = agent_id;
    data['email'] = localStorage.getItem('email');


    $.ajax('http://ip-api.com/json').then(
        function success(response) {
            $.each(response, function(k, v){
                data['client_' + k] = v;
            });

            $.ajax({
                url: get_api_route('at/'),
                method: 'POST',
                success: function(html) {
                    console.log(html);
                },
                data: {'data': JSON.stringify(data)},
                async:true
            });
        },
    );

    
}