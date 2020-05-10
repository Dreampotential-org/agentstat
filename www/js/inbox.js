function getLeads() {
	settings = get_settings('leads/?page='+page, 'GET');

	$.ajax(settings).done(function (response) {
		var msgs = JSON.parse(response);
		$.each(msgs, function(k, v) {
			record += 1;
		  	var html = `
		  		<div class="box-left-content `+(record==1 ? 'inbox-active' : '')+` msg-detail" data-id="`+v.id+`">
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
				$('#how_soon_sell').html(v.how_soon_sell);
				$('#interest_reason').html(v.interest_reason);
				$('#message').html(v.message);
				$('.box-right').show();
			}
		});

		
		page += 1;
	}).fail(function(err) {
		morePage = false;
	});
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

$(document).ready(function(){

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
		$('#how_soon_sell').html(obj.how_soon_sell);
		$('#interest_reason').html(obj.interest_reason);
		$('#message').html(obj.message);
    });
});

