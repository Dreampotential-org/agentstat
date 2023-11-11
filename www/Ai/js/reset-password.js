var pathname = window.location.pathname;
var splitPathname = pathname.split('/');
var uid = splitPathname[2];
var token = splitPathname[3];

var url = '/reset-password/'+uid;
window.history.pushState("", "", url);

$(document).on('click', '#password-btn', function () {
    $('.msg-password').hide();

    var data = {};
    data['new_password1'] = $('#new-password').val();
    data['new_password2'] = $('#new-password-confirm').val();
    data['uid'] = uid;
    data['token'] = token;

    if (data['new_password1'] == '' || data['new_password1'] != data['new_password2']) {
        $('.msg-password').html('Passwords don\'t match')
        $('.msg-password').show();
        return false;
    }

    $('#submit-password-spinner').show();
    $('#submit-password-check').hide();

    settings = get_settings_auth('password/reset/confirm/', 'POST', JSON.stringify(data))
    settings['headers'] = {};
    $.ajax(settings).done(function (response) {
        $('#new-password').val('');
        $('#new-password-confirm').val('');

        var msg = objToStr(JSON.parse(response));
        $('.msg-password').html(msg);
        $('.msg-password').show();

        $('#submit-password-spinner').hide();
        $('#submit-password-check').show();
    }).fail(function (err) {
        var errMsg = objArrToStr(JSON.parse(err['responseText']));
        $('.msg-password').html(errMsg);
        $('.msg-password').show();

        $('#submit-password-spinner').hide();
        $('#submit-password-check').hide();
    });
});