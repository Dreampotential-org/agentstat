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
	var url = 'https://maps.googleapis.com/maps/api/geocode/json?address='+ encodeURIComponent(address) +'&key='+ GOOGLE_MAP_KEY;

	var jqXHR = $.ajax({
        url: url,
        type: 'GET',
        async: false,
	});

    var data = JSON.parse(jqXHR.responseText);
    var lat = null;
    var lng = null;
    if (data.results.length > 0) {
        lat = data.results[0].geometry.location.lat.toFixed(6);
        lng = data.results[0].geometry.location.lng.toFixed(6);
    }
	return {
		lat: lat,
		lng: lng,
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

function referralNotificationBadge(count) {
	if (count == 0) {
		$('.referral-notification').html('Referrals');
	} else if (count > 0) {
		var badge = 'Referrals <span class="badge">'+count+'</span>';
		$('.referral-notification').html(badge);
	}
}

function unreadNotification() {
	settings = get_settings('unread-notification/', 'GET');

	$.ajax(settings).done(function (response) {
		var data = JSON.parse(response);
        inboxNotificationBadge(data.inbox);
        referralNotificationBadge(data.referral);
	}).fail(function(err) {
		var responseText = JSON.parse(err.responseText)
		if (responseText.detail=='Invalid token.') {
           // XXX visit why we are making api and causing this error?
			// logout_session();
		}
	});
}

function headerDisplayImage() {
	var src = localStorage.getItem("profile-image");
	var html = '<img src="'+src+'" onerror="this.src=\'/img/blank-profile-picture-973460_1280.webp\';">';
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
		var listPages = ['profile-settings', 'inbox', 'reports', 'marketing','past-sales', 'referrals', 'team'];
		if(listPages.indexOf(pageName) !== -1){
            checkAgentConnect();
		}
	} else {
        tabTutorialModal();
    }
}

function checkAgentConnect() {
    settings = get_settings('check-agent-connect/'+localStorage.getItem("web_agent_id")+'/', 'GET');
        $.ajax(settings).done(function (response) {
            var data = JSON.parse(response);
            
            if (data.agent_id !== null ) {
                localStorage.agent_id = data.agent_id;
                tabTutorialModal();
            } else if (data.sent_dispute == false) {
                window.location = '/connect-profile/';
            } else {
                window.location = '/pending-dispute/';
            }

        }).fail(function(err) {
            window.location = '/pending-dispute/';
        });
}

function tabTutorialModal() {
    var pageName = window.location.pathname.split("/")[1];
    var tab_tutorial_json = JSON.parse(localStorage.getItem('tab_tutorial_json'));
    var pageStatus = tab_tutorial_json[pageName];
    if (pageStatus == false) {
        $.get('/_tab_tutorial_modal.html', function(response){
            $('#tab-tutorial-modal').html(response);

            $('#tabTutorialModal').modal({
                backdrop: 'static',
                keyboard: false,
                show: true,
            });
            
            $('.tutorial-div').hide();
            $('#'+pageName).show();

            var textObj = {
                'profile-settings': 'Profile Settings',
                'inbox': 'Inbox',
                'reports': 'Reporting',
                'marketing': 'Marketing',
                'past-sales': 'Sales',
                'referrals': 'Referrals',
                'team': 'Team',
            }

            $('#tutorial-title').html(textObj[pageName]);

            tab_tutorial_json[pageName] = true;
            localStorage.tab_tutorial_json = JSON.stringify(tab_tutorial_json);

            var data = {}
            data['tab_tutorial_json'] = localStorage.getItem('tab_tutorial_json');
            settings = get_settings('agent-profile/', 'PUT', JSON.stringify(data))
            $.ajax(settings).done();
        });
    }
}

function getUserDataStorage(key) {
    var data = JSON.parse(localStorage.getItem('user_data'));
    if (data && key in data) {
        return data[key];
    } else {
        return false;
    }
}

function setUserDataStorage(key, val) {
    var data = JSON.parse(localStorage.getItem('user_data'));
    data[key] = val;
    localStorage.user_data = JSON.stringify(data);
}


function myProfileLink() {
    var link = '/profile/';
    if (screen_name = getUserDataStorage('screen_name')) {
        link += screen_name;
    } else if (screen_name = getUserDataStorage('agent_screen_name')) {
        link += screen_name;
    } else {
        link += getUserDataStorage('agent_slug');
    }
    return link;
}

function validateEmail(email) {
    const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
}

function objToStr(obj) {
    var text = '';
    $.each(obj, function(k, v) {
        text += v;
    }); 
    return text;
}

function objArrToStr(obj) {
    var text = '';
    $.each(obj, function() {
        var key = Object.keys(this)[0];
        var value = this[key];
        text += value+' ';
    }); 
    return text;
}

function offsetToPageno(offset) {
    return  Math.floor(offset/10)+1;
}

function currencyFormat(num) {
    var num = parseInt(num);
    return '$' + num.toFixed(0).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
}

function titleCaseStr(str) {
    if (str) {
        var splitStr = str.toLowerCase().split(' ');
        for (var i = 0; i < splitStr.length; i++) {
            splitStr[i] = splitStr[i].charAt(0).toUpperCase() + splitStr[i].substring(1);     
        }
        return splitStr.join(' '); 
    } else {
        return '';
    }
}

function agentProfileUrl(slug) {
    return '/profile/'+slug;
}

function agentProfileLink(slug, linkText, id=null) {
    if (slug != null && slug != 'null' && slug != '') {
        var url = agentProfileUrl(slug)
        return "<a href='"+url+"' target='_blank'>"+linkText+"</a>";
    } if (id != null && id != 'null' && id != '') {
        var url = agentProfileUrl(id)
        return "<a href='"+url+"' target='_blank'>"+linkText+"</a>";
    } else {
        return '';
    }
}

function getStateList() {
    settings = get_settings('states/', 'GET');
    settings['headers'] = {};
    settings['async'] = false;
  
    var jqXHR = $.ajax(settings);
    return JSON.parse(jqXHR.responseText);    
}

function getCityListByState(state) {
    settings = get_settings('cities/'+state+'/', 'GET');
    settings['headers'] = {};
    settings['async'] = false;
  
    var jqXHR = $.ajax(settings);
    return JSON.parse(jqXHR.responseText);    
}

function getAgentListByStateAndCity(state, city, page) {
    settings = get_settings('reports/'+state+'/?'+city+'&home_type=&num_results=20&page=' +page , 'GET');
    settings['headers'] = {};
    settings['async'] = false;
  
    var jqXHR = $.ajax(settings);
    return JSON.parse(jqXHR.responseText)['results'];    
}

$(document).ready(function(){
	if (localStorage.getItem("email") !== null && localStorage.getItem("email") != '') {
		isTeamMember();
		unreadNotification();
		loadProfileImage();
        checkNoagentIsAttached();

        $('.my-profile-link').attr('href', myProfileLink());
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
