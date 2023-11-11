function verifyEmail (key) {
    var data = {};
    data['key'] = key;

    settings = get_settings_auth('registration/verify-email/', 'POST', JSON.stringify(data))
    settings['headers'] = {};
    $.ajax(settings).done(function (response) {
        var msg = 'You email account has been verified you may login now.';
        $('#msg').html(msg);

    }).fail(function (err) {
        var msg = 'Unable to verify you email. It cause expire link or some other reason. Get new link by login.';
        $('#msg').html(msg);
    });
}

$(document).ready(function(){
    var pathname = window.location.pathname;
    var splitPathname = pathname.split('/');
    verifyEmail(splitPathname[2]);
});