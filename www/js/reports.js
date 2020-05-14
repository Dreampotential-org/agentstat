function parseProfileViews(res) {
	$('#traffic-profile-views').html(res.profile_views);

	var record = 1;
	$.each(res.profile_states, function(k, v){
		if (record == 1) {
			var state = `<p class="traffic-profile-state location-active" data-state="`+v.client_regionName+`">`+v.client_regionName+` (`+v.region_count+`) <i class="fas fa-chevron-right"></i></p>`;
			zipcodeHtml('#traffic-profile-zipcode', v.zipcodes);
		} else {
			var state = `<p class="traffic-profile-state" data-state="`+v.client_regionName+`">`+v.client_regionName+` (`+v.region_count+`) <i class="fas fa-chevron-right hide"></i></p>`;
		}
		$('#traffic-profile-state-div').append(state);
		record++;
	});

	profileChart1 = new Morris.Bar({
		element: 'bar-chart',
		resize: true,
		data: res.profile_time_graph,
		barColors: ['#4285F4'],
		xkey: 'date',
		ykeys: ['date_count'],
		labels: ['Views'],
		hideHover: 'auto'
	});
}

function zipcodeHtml(element, zipcodes) {
	$(element).html('');
	$.each(zipcodes, function(k, v){
		var zipcode = `<p>`+v.client_zip+` (`+v.zip_count+`)</p>`;
		$(element).append(zipcode);
	});
}

$(document).ready(function(){
	var days = $('#traffic-dropdown').val();
	settings = get_settings('track-report/'+days, 'GET');
	$.ajax(settings).done(function (response) {
		profileViewsjson = JSON.parse(response);
		parseProfileViews(profileViewsjson);
	}).fail(function(err) {
		console.log(err);
	});
	
	// profileViewsjson = '{"profile_views":14,"profile_states":[{"client_regionName":"California","region_count":4,"zipcodes":[{"client_zip":"95051","zip_count":1},{"client_zip":"95054","zip_count":3}]},{"client_regionName":"New Jersey","region_count":3,"zipcodes":[{"client_zip":"08854","zip_count":3}]},{"client_regionName":"Punjab","region_count":7,"zipcodes":[{"client_zip":"54000","zip_count":7}]}]}';
	// profileViewsjson = JSON.parse(profileViewsjson);
	// parseProfileViews(profileViewsjson);

	$(document).on('click', '.traffic-profile-state', function() {
		$('.traffic-profile-state').removeClass('location-active');
		$(this).addClass('location-active');

		$('.traffic-profile-state .fa-chevron-right').addClass('hide');
		$(this).find('.fa-chevron-right').removeClass('hide');
		
		var index = profileViewsjson.profile_states.findIndex(x => x.client_regionName == $(this).data('state'));
		var state = profileViewsjson.profile_states[index];
		zipcodeHtml('#traffic-profile-zipcode', state.zipcodes);
	});

	$('#traffic-dropdown').on('change', function() {
		//alert($(this).val());
	});
	
});
