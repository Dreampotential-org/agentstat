function getLeads() {
	settings = get_settings('leads/?page='+page, 'GET');

	$.ajax(settings).done(function (response) {
		var msgs = JSON.parse(response);
		if (msgs.length==0 && page==1) {
			msgs = JSON.parse(dummyData);
		}
		$.each(msgs, function(k, v) {
			record += 1;

			var boldClass = '';
			if (record > 1 && v.is_read == 0) {
				var boldClass = 'unread-msg';
			}
		  	var html = `
		  		<div class="box-left-content `+boldClass+` `+(record==1 ? 'inbox-active' : '')+` msg-detail" data-id="`+v.id+`">
                    <h1>`+v.name+`</h1><span>`+niceDate(v.created_at, false)+`</span>
                    <p>`+v.phone+`</p>
                    <p>`+v.email+`</p>
                </div>
		  	`;
		  	$('.review-list').append(html);
			list.push(v);
			
			if (record==1) {
				$('#name').html(v.name);
				$('#time').html(niceDateTime(v.created_at));
				$('#phone').html(v.phone);
				$('#email').html(v.email);
				$('#looking_for').html(v.looking_for);
				$('#home_type').html(v.home_type);
				$('#how_much').html(v.how_much);
				$('#how_soon').html(v.how_soon);
				$('#home_type_buyer').html(v.home_type_buyer);
				$('#how_much_buyer').html(v.how_much_buyer);
				$('#how_soon_buyer').html(v.how_soon_buyer);
				$('#interest_reason').html(v.interest_reason);
				$('#message').html(v.message);
				$('.box-right').show();

				showQuestions(v.lead_type);
				
				if (v.is_read == 0) {
					readMessageStatus(v.id);
				}
			}
		});
		
		page += 1;
	}).fail(function(err) {
		morePage = false;
	});
}



function showQuestions (type) {
	if (type == 'selling') {
		$('.selling').show();
		$('.buying').hide();
	} else if (type == 'buying') {
		$('.selling').hide();
		$('.buying').show();
	} else {
		$('.selling').show();
		$('.buying').show();
	}
}

function readMessageStatus(leadId) {
	settings = get_settings('read-message-status/'+leadId, 'GET');

	$.ajax(settings).done(function (response) {
		var data = JSON.parse(response);
		if (data.status == true) {
			inboxNotificationBadge(data.unread_count);
		}
	}).fail(function(err) {
		console.log(err);
	});
}

$(document).ready(function(){

	dummyData = '[{"id":135,"name":"Hassan Sheikh","phone":"03214396833","email":"hassan@gmail.com","message":"Hello dear I want to buy this home","lead_type":null,"home_type":null,"how_much":null,"how_soon":null,"home_type_buyer":null,"how_much_buyer":null,"how_soon_buyer":null,"interest_reason":null,"looking_for":null,"is_read":1,"created_at":"2020-10-02T11:59:27.053542Z","agent":6557},{"id":129,"name":"Hassan Sheikh","phone":"(444) 555-6666","email":"hassanejaz22@gmail.com","message":"Testing","lead_type":null,"home_type":"Condominium","how_much":"$200 - 400K","how_soon":"6-12 months","home_type_buyer":null,"how_much_buyer":null,"how_soon_buyer":null,"interest_reason":"I’m researching agents","looking_for":"Buy a Home","is_read":1,"created_at":"2020-08-12T21:28:28.869436Z","agent":6557},{"id":128,"name":"Hassan Sheikh","phone":"(111) 222-3333","email":"hassanejaz22@gmail.com","message":"testing","lead_type":null,"home_type":"Single Family","how_much":"$0 - 200K","how_soon":"ASAP","home_type_buyer":null,"how_much_buyer":null,"how_soon_buyer":null,"interest_reason":"I’m researching agents","looking_for":"Sell a Home","is_read":1,"created_at":"2020-08-12T21:28:03.741531Z","agent":6557},{"id":124,"name":"Hassan Sheikh","phone":"(222) 222-2222","email":"hassanejaz22@gmail.com","message":"testing","lead_type":null,"home_type":"Single Family","how_much":"$0 - 200K","how_soon":"ASAP","home_type_buyer":null,"how_much_buyer":null,"how_soon_buyer":null,"interest_reason":"I’m researching agents","looking_for":"Sell a Home","is_read":1,"created_at":"2020-08-12T13:53:59.684471Z","agent":6557},{"id":123,"name":"Hassan Sheikh","phone":"(111) 111-1111","email":"hassanejaz22@gmail.com","message":"testing","lead_type":null,"home_type":"Single Family","how_much":"$0 - 200K","how_soon":"ASAP","home_type_buyer":null,"how_much_buyer":null,"how_soon_buyer":null,"interest_reason":"I’m researching agents","looking_for":"Sell a Home","is_read":1,"created_at":"2020-08-12T13:53:31.192495Z","agent":6557},{"id":122,"name":"Hassan Sheikh","phone":"(111) 222-3333","email":"hassanejaz22@gmail.com","message":"Testing","lead_type":null,"home_type":"Single Family","how_much":"$0 - 200K","how_soon":"ASAP","home_type_buyer":null,"how_much_buyer":null,"how_soon_buyer":null,"interest_reason":"I’m researching agents","looking_for":"Sell a Home","is_read":1,"created_at":"2020-08-12T13:13:56.199470Z","agent":6557},{"id":116,"name":"Hassan Sheikh","phone":"22222","email":"hassanejaz22@gmail.com","message":"testing","lead_type":"both","home_type":"Manufactured","how_much":"$600 - 800K","how_soon":"12+ months","home_type_buyer":"Manufactured","how_much_buyer":"$600 - 800K","how_soon_buyer":"12+ months","interest_reason":"I’m researching agents","looking_for":"Both","is_read":1,"created_at":"2020-08-11T11:29:14.089336Z","agent":6557},{"id":115,"name":"Hassan Sheikh","phone":"1111","email":"hassanejaz22@gmail.com","message":"testing","lead_type":"both","home_type":"Single Family","how_much":"$0 - 200K","how_soon":"ASAP","home_type_buyer":"Single Family","how_much_buyer":"$0 - 200K","how_soon_buyer":"ASAP","interest_reason":"I’m researching agents","looking_for":"Both","is_read":1,"created_at":"2020-08-11T10:54:58.363094Z","agent":6557},{"id":114,"name":"Hassan Sheikh","phone":"111","email":"hassanejaz22@gmail.com","message":"testing","lead_type":"both","home_type":"Condominium","how_much":"$0 - 200K","how_soon":"6-12 months","home_type_buyer":"Single Family","how_much_buyer":"$0 - 200K","how_soon_buyer":"ASAP","interest_reason":"I’m researching agents","looking_for":"Both","is_read":1,"created_at":"2020-08-11T10:46:56.404362Z","agent":6557},{"id":113,"name":"Hassan Sheikh","phone":"1111","email":"sheikh@gmail.com","message":"from search page","lead_type":null,"home_type":"Land","how_much":"$1M+","how_soon":"3-6 months","home_type_buyer":null,"how_much_buyer":null,"how_soon_buyer":null,"interest_reason":"I have a question for","looking_for":"Sell a Home","is_read":1,"created_at":"2020-08-11T09:56:46.095266Z","agent":6557},{"id":112,"name":"Hassan Sheikh","phone":"032121212","email":"hassanejaz22@gmail.com","message":"Testing","lead_type":"both","home_type":"Single Family","how_much":"$400 - 600K","how_soon":"1-3 months","home_type_buyer":"Townhouse","how_much_buyer":"$800K - 1M","how_soon_buyer":"3-6 months","interest_reason":"I’m considering working with Ida Bear","looking_for":"Both","is_read":1,"created_at":"2020-08-11T09:10:09.099147Z","agent":6557},{"id":111,"name":"Hassan Sheikh","phone":"03214396866","email":"hassanejaz22@gmail.com","message":"This message is to test notification badge in header.","lead_type":null,"home_type":"Manufactured","how_much":"$600 - 800K","how_soon":"12+ months","home_type_buyer":null,"how_much_buyer":null,"how_soon_buyer":null,"interest_reason":"I have a question for Ida Bear","looking_for":"Sell a Home","is_read":1,"created_at":"2020-08-11T09:08:49.532239Z","agent":6557},{"id":109,"name":"Hassan Sheikh","phone":"11111","email":"hassanejaz22@gmail.com","message":"","lead_type":null,"home_type":"Single Family","how_much":"$0 - 200K","how_soon":"ASAP","home_type_buyer":null,"how_much_buyer":null,"how_soon_buyer":null,"interest_reason":"I’m researching agents","looking_for":"Sell a Home","is_read":1,"created_at":"2020-08-10T22:01:15.057584Z","agent":6557},{"id":107,"name":"adasdf","phone":"sdfsf","email":"asfaf@afsf.cgh","message":"","lead_type":null,"home_type":"Single Family","how_much":"$0 - 200K","how_soon":"ASAP","home_type_buyer":null,"how_much_buyer":null,"how_soon_buyer":null,"interest_reason":"I’m researching agents","looking_for":"Sell a Home","is_read":1,"created_at":"2020-07-07T23:03:34.441339Z","agent":6557},{"id":106,"name":"Hassan Sheikh","phone":"(321) 439-6833","email":"hassanejaz22@gmail.com","message":"This is testing note","lead_type":"both","home_type":"Single Family","how_much":"$200 - 400K","how_soon":"1-3 months","home_type_buyer":"Single Family","how_much_buyer":"$800K - 1M","how_soon_buyer":"3-6 months","interest_reason":"I’m considering working with Ida Bear","looking_for":"Both","is_read":1,"created_at":"2020-06-27T09:39:08.019923Z","agent":6557}]'


	page = 1;
	record = 0;
	morePage = true;
	list = [];
	getLeads();

    $('.review-list').on('scroll', function() {
        if($(this).scrollTop() + $(this).innerHeight() >= $(this)[0].scrollHeight) {
            if (morePage == true) {
            	getLeads();
            }
        }
    });

    $(document).on('click', '.msg-detail', function(){	
		var index = list.findIndex(x => x.id == $(this).data('id'));
		var obj = list[index];

		$('.msg-detail').removeClass('inbox-active');
		$(this).addClass('inbox-active');

		$('#name').html(obj.name);
		$('#time').html(niceDateTime(obj.created_at));
		$('#phone').html(obj.phone);
		$('#email').html(obj.email);
		$('#looking_for').html(obj.looking_for);
		$('#home_type').html(obj.home_type);
		$('#how_much').html(obj.how_much);
		$('#how_soon').html(obj.how_soon);
		$('#home_type_buyer').html(obj.home_type_buyer);
		$('#how_much_buyer').html(obj.how_much_buyer);
		$('#how_soon_buyer').html(obj.how_soon_buyer);
		$('#interest_reason').html(obj.interest_reason);
		$('#message').html(obj.message);

		showQuestions(obj.lead_type);

		if (obj.is_read == 0) {
			$(this).removeClass('unread-msg');
			readMessageStatus(obj.id);
		}
    });
});

