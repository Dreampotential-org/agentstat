const urlParams = new URLSearchParams(window.location.search);
var hash = urlParams.get('hash');

if (hash) {
    data = {}
    data['hash_str'] = hash
    settings = get_settings('login-with-code/', 'POST', JSON.stringify(data))
    settings['headers'] = {};

    $.ajax(settings).done(function (response) {
        var data = JSON.parse(response);
        localStorage.session_id = data['token'];
        localStorage.email = data['email'];
        localStorage.profile_id = data['profile_id'];
        localStorage.agent_id = data['agent_id'];
        localStorage.role = data['role'];
        localStorage.web_agent_id = data['web_agent_id'];
        localStorage.tab_tutorial_json = data['tab_tutorial_json'];
        localStorage.user_data = JSON.stringify({
            'screen_name': data['screen_name'],
            'agent_slug': data['agent_slug'],
            'agent_screen_name': data['agent_screen_name'],
        });

        if (localStorage.getItem('claimed_agent_id') != null && localStorage.getItem('claimed_agent_id') != 'null') {
            window.location = 'page-three.html?agent_id=' + localStorage.getItem('claimed_agent_id');
        } else {
            window.location = '/profile-settings/';
        }
    }).fail(function (err) {
        $('.msg-login').html(err['responseText']);
        $('.msg-login').css("display", "block");
        console.log(err);
    });

}

function create_agent() {
    $('.msg-signup').hide();

    var data = {};
    data['email'] = $('#signup_email').val();
    data['password'] = $('#signup_password').val();

    if (data['email'] == '' || validateEmail(data['email']) == false) {
        $('.msg-signup').html('Enter valid email')
        $('.msg-signup').show();
        return false;
    }

    if (data['password'] == '' || data['password'] != $('#signup_re_password').val()) {
        $('.msg-signup').html('Passwords don\'t match')
        $('.msg-signup').show();
        return false;
    }

    $('#submit-signup-spinner').show();
    $('#submit-signup-check').hide();

    settings = get_settings('signup/', 'POST', JSON.stringify(data))
    settings['headers'] = {};
    $.ajax(settings).done(function (response) {
        var data = JSON.parse(response);
	console.log(data)
	if ('message' in data) {
        	$('.msg-signup').html(data['message']);
        	$('.msg-signup').css("display", "block");
    		$('#submit-signup-spinner').hide();
		return
	}

        localStorage.session_id = data['token'];
        localStorage.email = data['email'];
        localStorage.profile_id = data['profile_id'];
        localStorage.agent_id = data['agent_id'];
        localStorage.role = data['role'];
        localStorage.web_agent_id = data['web_agent_id'];
        localStorage.tab_tutorial_json = data['tab_tutorial_json'];
        localStorage.user_data = JSON.stringify({
            'screen_name': data['screen_name'],
            'agent_slug': data['agent_slug'],
            'agent_screen_name': data['agent_screen_name'],
        });
        	window.location = '/connect-profile/';

    }).fail(function (err) {
        var error = JSON.parse(err['responseText']);
        $('.msg-login').html(error.msg);
        $('.msg-login').css("display", "block");

        if (error.not_verified) {
            $('#resend-verification-email').show();
        } 

        $('#submit-login-spinner').hide();
    });
}

function resendVerificationEmail() {
    $('.msg-login').hide();

    var data = {};
    data['email'] = $('#email').val();

    if (data['email'] == '' || validateEmail(data['email']) == false) {
        $('.msg-login').html('Enter valid email')
        $('.msg-login').show();
        return false;
    }

    settings = get_settings('resend-verification-email/', 'POST', JSON.stringify(data))
    settings['headers'] = {};
    $.ajax(settings).done(function (response) {
        var msg = objToStr(JSON.parse(response));
        $('.msg-login').html(msg);
        $('.msg-login').show();

        $('#resend-verification-email').hide();

    }).fail(function (err) {
        var errMsg = objToStr(JSON.parse(err['responseText']));
        $('.msg-login').html(errMsg);
        $('.msg-login').show();
    });
}

function login() {
    var data = {};
    data['email'] = $('#email').val();
    data['password'] = $('#password').val();

    $('#submit-login-spinner').show();

    settings = get_settings('login/', 'POST', JSON.stringify(data))
    settings['headers'] = {};
    $.ajax(settings).done(function (response) {
        var data = JSON.parse(response);

        localStorage.session_id = data['token'];
        localStorage.email = data['email'];
        localStorage.profile_id = data['profile_id'];
        localStorage.agent_id = data['agent_id'];
        localStorage.role = data['role'];
        localStorage.web_agent_id = data['web_agent_id'];
        localStorage.tab_tutorial_json = data['tab_tutorial_json'];
        localStorage.user_data = JSON.stringify({
            'screen_name': data['screen_name'],
            'agent_slug': data['agent_slug'],
            'agent_screen_name': data['agent_screen_name'],
        });
	if (data['agent_id'] == null) {
           window.location = '/connect-profile/';
	} else {
           window.location = '/profile-settings/';
	}

    }).fail(function (err) {
        var error = JSON.parse(err['responseText']);
        $('.msg-login').html(error.msg);
        $('.msg-login').css("display", "block");

        if (error.not_verified) {
            $('#resend-verification-email').show();
        } 

        $('#submit-login-spinner').hide();
    });
}

$(document).on('change click', 'input:radio', function () {
    if ($(this).val() == 'Industry Professional') {
        $("#category").prop("disabled", false);
    } else {
        $("#category").prop("disabled", true);
    }
})

$(document).on('change click', '#login-btn', function () {
    login();
});

$(document).on('change click', '#signup-btn', function () {
    create_agent();
});

$(document).on('click', '#resend-verification-email', function () {
    resendVerificationEmail();
});

$('#continuebtn1').keydown(function (e) {
    if (e.keyCode == 13) {
        $('#continuebtn1').trigger('click');
    }
});

$('#login-btn').keydown(function (e) {
    if (e.keyCode == 13) {
        login();
        return false;
    }
});

$('#password').keydown(function (e) {
    if (e.keyCode == 13) {
        login();
        return false;
    }
});

$('#continuebtn1').keydown(function (e) {
    if (e.keyCode == 13) {
        return false;
    }
});

$(document).on('change click', '#forgot-password', function () {
    email = $('#email').val();
    console.log(email);

    if (email === '' || email === null) {
        $('.msg').html('Email is required.');
        $('.msg').css("display", "block");
    } else {
        var data = {};
        data['email'] = $('#email').val();
        settings = get_settings('forgot-password/', 'POST', JSON.stringify(data));
        settings['headers'] = {};

        $.ajax(settings).done(function (response) {
            var msg = JSON.parse(response);
            console.log(msg);
            $('.msg').html("Email has been sent.");
            $('.msg').css("display", "block");
        }).fail(function (err) {
            $('.msg').html(err['responseText']);
            $('.msg').css("display", "block");
            console.log(err);
        });
    }
});

function getParamUrlValue(key) {
    var url_string = window.location.href;
    var url = new URL(url_string);
    var agent_id = url.searchParams.get(key);
}

$(document).ready(function () {
    var url_string = window.location.href;
    var url = new URL(url_string);
    agent_id = url.searchParams.get('agent_id');
    if (agent_id) {
        $('[href="#nav-profile"]').tab('show');
        $("#category").val("secondoption");
    }
});
