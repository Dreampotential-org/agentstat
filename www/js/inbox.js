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
					<p>`+v.address+`</p>
                </div>
		  	`;
		  	$('.review-list').append(html);
			list.push(v);
			
			if (record==1) {
				
				loadInboxData(v);
				
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

function loadInboxData(obj) {
	$('#name').html(obj.name);
	$('#time').html(niceDateTime(obj.created_at));
	$('#phone').html(obj.phone);
	$('#email').html(obj.email);
	
	if (obj.looking_for != undefined && obj.looking_for != '') {
		$('.looking_for_div').show();
		$('#looking_for').html(obj.looking_for);
	} else {
		$('.looking_for_div').hide();
	}
	
	if (obj.home_type != undefined && obj.home_type != '') {
		$('.home_type_div').show();
		$('#home_type').html(obj.home_type);
	} else {
		$('.home_type_div').hide();
	}
	
	if (obj.how_much != undefined && obj.how_much != '') {
		$('.how_much_div').show();
		$('#how_much').html(obj.how_much);
	} else {
		$('.how_much_div').hide();
	}
	
	if (obj.how_soon != undefined && obj.how_soon != '') {
		$('.how_soon_div').show();
		$('#how_soon').html(obj.how_soon);
	} else {
		$('.how_soon_div').hide();
	}
	
	if (obj.home_type_buyer != undefined && obj.home_type_buyer != '') {
		$('.home_type_buyer_div').show();
		$('#home_type_buyer').html(obj.home_type_buyer);
	} else {
		$('.home_type_buyer_div').hide();
	}
	
	if (obj.how_much_buyer != undefined && obj.how_much_buyer != '') {
		$('.how_much_buyer_div').show();
		$('#how_much_buyer').html(obj.how_much_buyer);
	} else {
		$('.how_much_buyer_div').hide();
	}
	
	if (obj.how_soon_buyer != undefined && obj.how_soon_buyer != '') {
		$('.how_soon_buyer_div').show();
		$('#how_soon_buyer').html(obj.how_soon_buyer);
	} else {
		$('.how_soon_buyer_div').hide();
	}
	
	if (obj.interest_reason != undefined && obj.interest_reason != '') {
		$('.interest_reason_div').show();
		$('#interest_reason').html(obj.interest_reason);
	} else {
		$('.interest_reason_div').hide();
	}
	
	if (obj.message != undefined && obj.message != '') {
		$('.message_div').show();
		$('#message').html(obj.message);
	} else {
		$('.message_div').hide();
	}

	if (obj.agentlist_zpid != undefined && obj.agentlist_zpid != '') {
		var href = base_url+'/property-detail/'+obj.agentlist_zpid;
		$('.property-detail-link').attr('href', href);
		$('.property-detail-link').show();
	} else {
		$('.property-detail-link').hide();
	}
	
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
	base_url = window.location.origin;
	dummyData = '[{"id":135,"name":"Anna","phone":"(111) 222-3333","email":"anna@website.com","message":"Hi agent! let me know if you have some home in my town.","lead_type":null,"home_type":null,"how_much":null,"how_soon":null,"home_type_buyer":null,"how_much_buyer":null,"how_soon_buyer":null,"interest_reason":null,"looking_for":null,"is_read":1,"created_at":"2020-10-02T11:59:27.053542Z","agent":6557},{"id":129,"name":"Aaron","phone":"(444) 555-6666","email":"aaron@website.com","message":"I an interesting to buy a home","lead_type":null,"home_type":"Condominium","how_much":"$200 - 400K","how_soon":"6-12 months","home_type_buyer":null,"how_much_buyer":null,"how_soon_buyer":null,"interest_reason":"I’m researching agents","looking_for":"Buy a Home","is_read":1,"created_at":"2020-08-12T21:28:28.869436Z","agent":6557},{"id":128,"name":"Doug","phone":"(111) 222-3333","email":"doug@gmail.com","message":"Hi agent! I am intereted to buy an apartment.","lead_type":null,"home_type":"Single Family","how_much":"$0 - 200K","how_soon":"ASAP","home_type_buyer":null,"how_much_buyer":null,"how_soon_buyer":null,"interest_reason":"I’m researching agents","looking_for":"Sell a Home","is_read":1,"created_at":"2020-08-12T21:28:03.741531Z","agent":6557}]';

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

		loadInboxData(obj);

		showQuestions(obj.lead_type);

		if (obj.is_read == 0) {
			$(this).removeClass('unread-msg');
			readMessageStatus(obj.id);
		}
    });
});

