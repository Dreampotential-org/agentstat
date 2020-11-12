function getLeads() {
	settings = get_settings('leads/?page='+page, 'GET');

	$.ajax(settings).done(function (response) {
		var msgs = JSON.parse(response);
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
	$('#address').html(obj.address);
	
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
    
    if (obj.custom_link_refer != undefined && obj.custom_link_refer != '') {
        $('.custom_link_refer_div').show();
        var html = '<a href="'+obj.custom_link_refer+'" target="_blank">'+obj.custom_link_refer+'</a>'
		$('#custom_link_refer').html(html);
	} else {
		$('.custom_link_refer_div').hide();
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

