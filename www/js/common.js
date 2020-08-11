$("body").delegate(".logout", "click", function(e) {
    localStorage.clear();
    window.location = '/';
});

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

function show_message(message) {
    swal(message, {
      buttons: false,
      timer: 3000,
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
		// if (data.unread_count > 0) {
		// 	var badge = 'Inbox <span class="badge">'+data.unread_count+'</span>';
		// 	$('.inbox-notification').html(badge);
		// }
		inboxNotificationBadge(data.unread_count);
	}).fail(function(err) {
		console.log(err);
	});
}

$(document).ready(function(){
	isTeamMember();
	inboxNotification();
});