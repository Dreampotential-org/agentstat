$("body").delegate(".logout", "click", function(e) {
    logout_session();
});

function logout_session() {
	localStorage.clear();
    window.location = '/';
}

function formatAMPM(timedate) {
	const date = new Date(timedate);
	var hours = date.getHours();
	var minutes = date.getMinutes();
	var ampm = hours >= 12 ? 'PM' : 'AM';
	hours = hours % 12;
	hours = hours ? hours : 12;
	minutes = minutes < 10 ? '0'+minutes : minutes;
	var strTime = hours + ':' + minutes + ' ' + ampm;
	return strTime;
}

function nth(d) {
	if (d > 3 && d < 21) return 'th';
	switch (d % 10) {
		case 1:  return "st";
		case 2:  return "nd";
		case 3:  return "rd";
		default: return "th";
	}
}

function niceDate(timedate, withyear=true) {
	const fortnightAway = new Date(timedate);
	const date = fortnightAway.getDate();
	const month = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"][fortnightAway.getMonth()];

	if (withyear) {
		var cdate = `${month} ${date}${nth(date)}, ${fortnightAway.getFullYear()}`;
	} else {
		var cdate = `${month} ${date}${nth(date)}`;
	}
	return cdate;
}

function niceDateTime(timedate) {
	var datetime = `${niceDate(timedate)} at ${formatAMPM(timedate)}`;
	return datetime; 
}

function getCoordinates(address) {
	var url = 'https://maps.googleapis.com/maps/api/geocode/json?address='+ address +'&key='+ GOOGLE_MAP_KEY;

	var jqXHR = $.ajax({
        url: url,
        type: 'GET',
        async: false,
	});

	var data = JSON.parse(jqXHR.responseText);
	return {
		lat: data.results[0].geometry.location.lat.toFixed(6),
		lng: data.results[0].geometry.location.lng.toFixed(6),
	}
}

function show_message(message, duration=5000) {
    swal(message, {
      buttons: false,
      timer: duration,
    });
}

function parseQuerystring(){
    var foo = window.location.href.split('?')[1].split('#')[0].split('&');
    var dict = {};
    var elem = [];
    for (var i = foo.length - 1; i >= 0; i--) {
        elem = foo[i].split('=');
        dict[elem[0]] = elem[1];
    };
    return dict;
};

function secondsToHms(d) {
    d = Number(d);
    var h = Math.floor(d / 3600);
    var m = Math.floor(d % 3600 / 60);
    var s = Math.floor(d % 3600 % 60);

    var hDisplay = h > 0 ? h + (h == 1 ? " hour" : " hours") : "";
    var mDisplay = m > 0 ? m + (m == 1 ? " minute" : " minutes") : "";
    var sDisplay = s > 0 ? s + (s == 1 ? " second" : " seconds") : "";
	
	var obj = {
        "h": hDisplay,
        "m": mDisplay,
        "s": sDisplay
    };
    return obj;
}

function isTeamMember() {
	var path = window.location.pathname;

	if (localStorage.getItem("role") == 'team') {
		//header tabs
		$('.referrals-link').show();
		$('.inbox-link').hide();

		//profile page
		if (path == '/profile-settings/') {
			$('#info-tab').show();
			$('#account-information-tab').show();
			$('.not-info-for-team').hide();

			changeTab('info');
		}
	} else {
		//header tabs
		$('.header-link').show();

		//profile page
		if (path == '/profile-settings/') {
			$('#info-tab').show();
			$('#license-tab').show();
			$('#highlight-tab').show();
			$('#comision-tab').show();
			$('#review-tab').show();
			$('#social-tab').show();
			$('#about-tab').show();
			$('#account-information-tab').show();
			$('#noti-setting-tab').show();

			changeTab('info');
		}
		
	}
}

function inboxNotificationBadge(count) {
	if (count == 0) {
		$('.inbox-notification').html('Inbox');
	} else if (count > 0) {
		var badge = 'Inbox <span class="badge">'+count+'</span>';
		$('.inbox-notification').html(badge);
	}
}

function inboxNotification() {
	settings = get_settings('inbox-notification/', 'GET');

	$.ajax(settings).done(function (response) {
		var data = JSON.parse(response);
		inboxNotificationBadge(data.unread_count);
	}).fail(function(err) {
		var responseText = JSON.parse(err.responseText)
		if (responseText.detail=='Invalid token.') {
			logout_session();
		}
	});
}

function headerDisplayImage() {
	var src = localStorage.getItem("profile-image");
	var html = '<img src="'+src+'" onerror="this.src=\'/img/user-icon.png\';">';
	$('.display-picture').html(html);
}

function isAndroid() {
	var ua = navigator.userAgent.toLowerCase();
	var isAndroid = ua.indexOf("android") > -1; //&& ua.indexOf("mobile");
	if(isAndroid) {
		return true;
	} else {
		return false;
	}
}

function loadProfileImage() {
	var reload = true;
    
    var ImageSrc = localStorage.getItem("profile-image");
    if (ImageSrc !== null && ImageSrc != '') {
        var urlParams = new URLSearchParams(ImageSrc);
        var expire = urlParams.get('Expires');
        var current = Math.floor(Date.now() / 1000);
        if (expire > current) {
			headerDisplayImage();
            reload = false;
        }
    }
    
    if (reload) {
        settings = get_settings('agent-profile-image/', 'GET');
        $.ajax(settings).done(function (response) {
            var data = JSON.parse(response);
			localStorage.setItem("profile-image", data.picture);
			headerDisplayImage();
        }).fail(function(err) {
            console.log(err);
        });
    }
}

function camleCasetoString(text){
	var result = text.replace( /([A-Z])/g, " $1" );
	return result.charAt(0).toUpperCase() + result.slice(1);
}

function checkNoagentIsAttached() {
	if (localStorage.getItem("agent_id") === null || localStorage.getItem("agent_id") == 'null' || localStorage.getItem("agent_id") == '') {
		var pageName = window.location.pathname.split("/")[1];
		var listPages = ['profile-settings', 'inbox', 'reports', 'past-sales', 'referrals', 'team'];
		if(listPages.indexOf(pageName) !== -1){
            checkAgentConnect();
		}
	}
}

function checkAgentConnect() {
    settings = get_settings('check-agent-connect/'+localStorage.getItem("web_agent_id")+'/', 'GET');
        $.ajax(settings).done(function (response) {
            var data = JSON.parse(response);
            
            if (data.agent_id !== null ) {
                localStorage.agent_id = data.agent_id;
            } else if (data.sent_dispute == false) {
                window.location = '/connect-profile/';
            } else {
                // window.location = '/pending-dispute/';
            }

        }).fail(function(err) {
            // window.location = '/pending-dispute/';
        });
}

$(document).ready(function(){
	if (localStorage.getItem("email") !== null && localStorage.getItem("email") != '') {
		isTeamMember();
		inboxNotification();
		loadProfileImage();
		checkNoagentIsAttached();
    }	
    
    if ($(window).width() < 550) {
        $("input").focus(function() {
            $('.footer').addClass('mob-device');   
        });  
        $("input").focusout(function() {
            $('.footer').removeClass('mob-device');   
        });      
    }
    else{
        $("input").blur(function() {
            $('.footer').removeClass('mob-device');  
        });      
    }
});