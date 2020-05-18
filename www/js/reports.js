function parseResponse(data, type) {
	$('#'+type+'-views').html(data.views);
	$('#'+type+'-city-div').html('');
	$('#'+type+'-zipcode').html('');
	
	var record = 1;
	$.each(data.cities, function(k, v){
		if (record == 1) {
			var state = `<p class="`+type+`-city location-active" data-city="`+v.q_city+`">`+v.q_city+` (`+v.region_count+`) <i class="fas fa-chevron-right"></i></p>`;
			zipcodeHtml('#'+type+'-zipcode', v.zipcodes);
		} else {
			var state = `<p class="`+type+`-city" data-city="`+v.q_city+`">`+v.q_city+` (`+v.region_count+`) <i class="fas fa-chevron-right hide"></i></p>`;
		}
		$('#'+type+'-city-div').append(state);
		record++;
	});

	$(document).on('click', '.'+type+'-city', function() {
		$('.'+type+'-city').removeClass('location-active');
		$(this).addClass('location-active');

		$('.'+type+'-city .fa-chevron-right').addClass('hide');
		$(this).find('.fa-chevron-right').removeClass('hide');
		
		var index = data.cities.findIndex(x => x.q_city == $(this).data('city'));
		var city = data.cities[index];
		zipcodeHtml('#'+type+'-zipcode', city.zipcodes);
	});

	chartTime[type] = new Morris.Bar({
		element: type+'-chart-time',
		resize: true,
		data: data.time_graph,
		barColors: ['#4285F4'],
		xkey: 'date',
		ykeys: ['date_count'],
		labels: ['Views'],
		hideHover: 'auto'
	});

	chartType[type] = new Morris.Bar({
		element: type+'-chart-type',
		resize: true,
		data: data.type_graph,
		barColors: ['#4285F4'],
		xkey: 'q_type',
		ykeys: ['type_count'],
		labels: ['Views'],
		hideHover: 'auto'
	});

	chartPrice[type] = new Morris.Bar({
		element: type+'-chart-price',
		resize: true,
		data: data.price_graph,
		barColors: ['#4285F4'],
		xkey: 'q_price_range',
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

function getReport(days) {
	settings = get_settings('track-report/'+days, 'GET');
	$.ajax(settings).done(function (response) {
		$(".chart-right .chart").empty();

		jsonRes = JSON.parse(response);
		parseResponse(jsonRes.traffic_profile, 'traffic-profile');
		parseResponse(jsonRes.traffic_impression, 'traffic-impression');
		parseResponse(jsonRes.lead_seller, 'lead-seller');
		parseResponse(jsonRes.lead_buyer, 'lead-buyer');
	}).fail(function(err) {
		console.log(err);
	});
}

$(document).ready(function(){
	chartTime = {};
	chartType = {};
	chartPrice = {};

	var days = $('#traffic-dropdown').val();
	getReport(days)

	$(document).on('click', '.traffic-impression-state', function() {
		$('.traffic-impression-state').removeClass('location-active');
		$(this).addClass('location-active');

		$('.traffic-impression-state .fa-chevron-right').addClass('hide');
		$(this).find('.fa-chevron-right').removeClass('hide');
		
		var index = profileViewsjson.impression_states.findIndex(x => x.agent_profile_view__q_city == $(this).data('state'));
		var state = profileViewsjson.impression_states[index];
		zipcodeImpressionHtml('#traffic-impression-zipcode', state.zipcodes);
	});

	$('#traffic-dropdown, #lead-dropdown, #referral-dropdown').on('change', function() {
		var days = $(this).val();
		$('.date-range-dropdown').val(days);
		getReport(days)
	});
	
	$('a[data-toggle="tab"]').on('shown.bs.tab', function(e) {		
		chartTime['traffic-impression'].redraw();
		chartType['traffic-impression'].redraw();
		chartPrice['traffic-impression'].redraw();

		chartTime['traffic-profile'].redraw();
		chartType['traffic-profile'].redraw();
		chartPrice['traffic-profile'].redraw();

		chartTime['lead-seller'].redraw();
		chartType['lead-seller'].redraw();
		chartPrice['lead-seller'].redraw();

		chartTime['lead-buyer'].redraw();
		chartType['lead-buyer'].redraw();
		chartPrice['lead-buyer'].redraw();

		$(window).trigger('resize');
    }); 

});