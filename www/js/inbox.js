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
		$('#home_type').html(obj.home_type);
		$('#how_much').html(obj.how_much);
		$('#how_soon').html(obj.how_soon);
		$('#home_type_buyer').html(obj.home_type_buyer);
		$('#how_much_buyer').html(obj.how_much_buyer);
		$('#how_soon_buyer').html(obj.how_soon_buyer);
		$('#interest_reason').html(obj.interest_reason);
		$('#message').html(obj.message);

		showQuestions(obj.lead_type);
    });
});

