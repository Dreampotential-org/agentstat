function getLeads() {
	settings = get_settings('leads/?page='+page, 'GET');

	$.ajax(settings).done(function (response) {
		var msgs = JSON.parse(response);
		$.each(msgs, function(k, v) {
		  	//$('#state').append(`<option value='`+ k +`'>`+ v +`</option>`);
		  	var html = `
		  		<div class="box-left-content">
                    <h1>`+v.name+`</h1><span>May 2nd</span>
                    <p>`+v.phone+`</p>
                    <p>`+v.email+`</p>
                </div>
		  	`;
		  	$('.review-list').append(html);
		});
		page += 1;
	}).fail(function(err) {
		morePage = false;
	});
}

$(document).ready(function(){
	page = 1;
	morePage = true;
	//getLeads();

    $('.review-list').on('scroll', function() {
        if($(this).scrollTop() + $(this).innerHeight() >= $(this)[0].scrollHeight) {
            if (morePage == true) {
            	//getLeads();
            }
        }
    });
});

