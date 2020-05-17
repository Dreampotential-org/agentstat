function parseProfileViews(res) {
	$('#traffic-profile-views').html(res.profile_views);
	$('#traffic-profile-state-div').html('');
	$('#traffic-profile-zipcode').html('');
	var record = 1;
	$.each(res.profile_states, function(k, v){
		if (record == 1) {
			var state = `<p class="traffic-profile-state location-active" data-state="`+v.q_state+`">`+v.q_state+` (`+v.region_count+`) <i class="fas fa-chevron-right"></i></p>`;
			zipcodeHtml('#traffic-profile-zipcode', v.zipcodes);
		} else {
			var state = `<p class="traffic-profile-state" data-state="`+v.q_state+`">`+v.q_state+` (`+v.region_count+`) <i class="fas fa-chevron-right hide"></i></p>`;
		}
		$('#traffic-profile-state-div').append(state);
		record++;
	});

	profileChartTime = new Morris.Bar({
		element: 'profile-chart-time',
		resize: true,
		data: res.profile_time_graph,
		barColors: ['#4285F4'],
		xkey: 'date',
		ykeys: ['date_count'],
		labels: ['Views'],
		hideHover: 'auto'
	});

	profileChartPrice = new Morris.Bar({
		element: 'profile-chart-price',
		resize: true,
		data: res.profile_price_graph,
		barColors: ['#4285F4'],
		xkey: 'q_price_range',
		ykeys: ['price_count'],
		labels: ['Views'],
		hideHover: 'auto'
	});
}

function parseImpressionViews(res) {
	$('#traffic-impression-views').html(res.impression_count);
	$('#traffic-impression-state-div').html('');
	$('#traffic-impression-zipcode').html('');
	
	var record = 1;
	$.each(res.impression_states, function(k, v){
		if (record == 1) {
			var state = `<p class="traffic-impression-state location-active" data-state="`+v.agent_profile_view__q_state+`">`+v.agent_profile_view__q_state+` (`+v.region_count+`) <i class="fas fa-chevron-right"></i></p>`;
			zipcodeImpressionHtml('#traffic-impression-zipcode', v.zipcodes);
		} else {
			var state = `<p class="traffic-impression-state" data-state="`+v.agent_profile_view__q_state+`">`+v.agent_profile_view__q_state+` (`+v.region_count+`) <i class="fas fa-chevron-right hide"></i></p>`;
		}
		$('#traffic-impression-state-div').append(state);
		record++;
	});

	impressionChartTime = new Morris.Bar({
		element: 'impression-chart-time',
		resize: true,
		data: res.impression_time_graph,
		barColors: ['#4285F4'],
		xkey: 'agent_profile_view__date',
		ykeys: ['date_count'],
		labels: ['Views'],
		hideHover: 'auto'
	});

	impressionChartPrice = new Morris.Bar({
		element: 'impression-chart-price',
		resize: true,
		data: res.impression_price_graph,
		barColors: ['#4285F4'],
		xkey: 'agent_profile_view__q_price_range',
		ykeys: ['price_count'],
		labels: ['Views'],
		hideHover: 'auto'
	});
}


function zipcodeHtml(element, zipcodes) {
	$(element).html('');
	$.each(zipcodes, function(k, v){
		var zipcode = `<p>`+v.q_zip+` (`+v.zip_count+`)</p>`;
		$(element).append(zipcode);
	});
}

function zipcodeImpressionHtml(element, zipcodes) {
	$(element).html('');
	$.each(zipcodes, function(k, v){
		var zipcode = `<p>`+v.agent_profile_view__q_zip+` (`+v.zip_count+`)</p>`;
		$(element).append(zipcode);
	});
}

function getReport(days) {
	settings = get_settings('track-report/'+days, 'GET');
	$.ajax(settings).done(function (response) {
		profileViewsjson = JSON.parse(response);
		parseProfileViews(profileViewsjson);
		parseImpressionViews(profileViewsjson);
	}).fail(function(err) {
		console.log(err);
	});
}

$(document).ready(function(){
	var days = $('#traffic-dropdown').val();
	getReport(days)
	
	// profileViewsjson = '{"profile_views":30,"profile_states":[{"client_regionName":"Punjab","region_count":23,"zipcodes":[{"client_zip":"54000","zip_count":23}]},{"client_regionName":"California","region_count":4,"zipcodes":[{"client_zip":"95054","zip_count":3},{"client_zip":"95051","zip_count":1}]},{"client_regionName":"New Jersey","region_count":3,"zipcodes":[{"client_zip":"08854","zip_count":3}]}],"profile_time_graph":[{"date":"2020-05-09","date_count":2},{"date":"2020-05-12","date_count":6},{"date":"2020-05-11","date_count":5},{"date":"2020-05-15","date_count":4},{"date":"2020-05-10","date_count":3},{"date":"2020-05-13","date_count":10}],"profile_price_graph":[{"q_price_range":"$50K - $100K","price_count":3},{"q_price_range":"N/A","price_count":27}],"impression_count":2,"impression_states":[{"agent_profile_view__client_regionName":"Punjab","region_count":2,"zipcodes":[{"agent_profile_view__client_zip":"54000","zip_count":2}]}],"impression_time_graph":[{"agent_profile_view__date":"2020-05-15","date_count":2}],"impression_price_graph":[{"agent_profile_view__q_price_range":"N/A","price_count":2}]}';
	// profileViewsjson = JSON.parse(profileViewsjson);
	// parseProfileViews(profileViewsjson);
	// parseImpressionViews(profileViewsjson);
	
	// console.log(profileViewsjson);

	$(document).on('click', '.traffic-profile-state', function() {
		$('.traffic-profile-state').removeClass('location-active');
		$(this).addClass('location-active');

		$('.traffic-profile-state .fa-chevron-right').addClass('hide');
		$(this).find('.fa-chevron-right').removeClass('hide');
		
		var index = profileViewsjson.profile_states.findIndex(x => x.q_state == $(this).data('state'));
		var state = profileViewsjson.profile_states[index];
		zipcodeHtml('#traffic-profile-zipcode', state.zipcodes);
	});

	$(document).on('click', '.traffic-impression-state', function() {
		$('.traffic-impression-state').removeClass('location-active');
		$(this).addClass('location-active');

		$('.traffic-impression-state .fa-chevron-right').addClass('hide');
		$(this).find('.fa-chevron-right').removeClass('hide');
		
		var index = profileViewsjson.impression_states.findIndex(x => x.agent_profile_view__q_state == $(this).data('state'));
		var state = profileViewsjson.impression_states[index];
		zipcodeImpressionHtml('#traffic-impression-zipcode', state.zipcodes);
	});

	$('#traffic-dropdown').on('change', function() {
		var days = $(this).val();
		
		$("#profile-chart-time").empty();
		$("#profile-chart-price").empty();
		
		$("#impression-chart-time").empty();
		$("#impression-chart-price").empty();
		
		getReport(days)
	});
	
});
