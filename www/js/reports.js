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
	
	var timeData = fillMissingDates(data.time_graph);
	chartTime[type] = new Morris.Bar({
		element: type+'-chart-time',
		resize: true,
		data: timeData,
		barColors: ['#4285F4'],
		xkey: 'date',
		ykeys: ['date_count'],
		labels: ['Views'],
		hideHover: 'auto',
		xLabelMargin: 10
	});

	var typeDate = fillMissingTypes(data.type_graph);
	chartType[type] = new Morris.Bar({
		element: type+'-chart-type',
		resize: true,
		data: typeDate,
		barColors: ['#4285F4'],
		xkey: 'q_type',
		ykeys: ['type_count'],
		labels: ['Views'],
		hideHover: 'auto',
		xLabelMargin: 10
	});

	chartPrice[type] = new Morris.Bar({
		element: type+'-chart-price',
		resize: true,
		data: data.price_graph,
		barColors: ['#4285F4'],
		xkey: 'q_price_range',
		ykeys: ['price_count'],
		labels: ['Views'],
		hideHover: 'auto',
		xLabelMargin: 10
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
		
		var startDate = new Date(jsonRes.start_date);
		var endDate = new Date(jsonRes.end_date);
		dateRange = getDates(startDate, endDate);
		
		parseResponse(jsonRes.traffic_profile, 'traffic-profile');
		parseResponse(jsonRes.traffic_impression, 'traffic-impression');
		parseResponse(jsonRes.lead_seller, 'lead-seller');
		parseResponse(jsonRes.lead_buyer, 'lead-buyer');

		parseResponse(dummyJson.traffic_profile, 'referral-unique');
		parseResponse(dummyJson.traffic_profile, 'referral-profile');
		parseResponse(dummyJson.traffic_profile, 'referral-contact');
		parseResponse(dummyJson.traffic_profile, 'referral-sign');
	}).fail(function(err) {
		console.log(err);
	});
}



Date.prototype.addDays = function(days) {
    var date = new Date(this.valueOf());
    date.setDate(date.getDate() + days);
    return date;
}


function getFormattedDate(dateStr) {
    var dateObj = new Date (dateStr);
	var month = ("0" + (dateObj.getMonth() + 1)).slice(-2);
	var day = dateObj.getDate();
	var year = dateObj.getFullYear().toString().substr(-2);
	return month+'/'+day+'/'+year;
}

function getDates(startDate, stopDate) {
    var dateArray = new Array();
    var currentDate = startDate;
    while (currentDate <= stopDate) {
        dateArray.push(getFormattedDate(currentDate));
		currentDate = currentDate.addDays(1);
	}
    return dateArray;
}

function fillMissingDates(data) {
	var i;
	var res = [];
	for (i = 0; i < dateRange.length; i++) {
		var date = dateRange[i];
		var index = data.findIndex(x => x.date == date);
		if (index === -1) {
			var obj = {"date":date,"date_count":0};
		} else {
			var obj = data[index];
		}
		res.push(obj);
	}
	return res;
}

function fillMissingTypes(data) {
	var i;
	var res = [];
	for (i = 0; i < graphTypeArr.length; i++) {
		var type = graphTypeArr[i];
		var index = data.findIndex(x => x.q_type == type);
		if (index === -1) {
			var obj = {"q_type":type,"type_count":0};
		} else {
			var obj = data[index];
		}
		res.push(obj);
	}
	return res;
}

$(document).ready(function(){
	// var startDate = new Date('2020-05-13');
	// var endDate = new Date('2020-05-19');
	// dateRange = getDates(startDate, endDate);

	// var timeDate = [
	// 	{"date":"5/18/20","date_count":16},
	// 	{"date":"5/17/20","date_count":6},
	// 	{"date":"5/16/20","date_count":10},
	// 	{"date":"5/13/20","date_count":7},
	// ];

	// var dd = fillMissingDates(timeDate);
	// console.log(dd);
	
	chartTime = {};
	chartType = {};
	chartPrice = {};

	dateRange = [];
	graphTypeArr = ['Houses', 'Condos', 'Townhomes', 'Manufactured', 'Multi-Family', 'Land', 'N/A'];
	
	dummyJson = `{
		"traffic_profile":{
			"views":78,
			"cities":[
				{"q_city":"Seattle","region_count":12,
					"zipcodes":[
						{"q_zip":"98109","zip_count":2},
						{"q_zip":"98116","zip_count":1},
						{"q_zip":"98112","zip_count":4},
						{"q_zip":"98132","zip_count":2},
						{"q_zip":"98154","zip_count":1},
						{"q_zip":"98191","zip_count":2},
						{"q_zip":"All","zip_count":12}
					]
				},
				{"q_city":"Everret","region_count":4,
					"zipcodes":[
						{"q_zip":"98109","zip_count":2},
						{"q_zip":"98191","zip_count":2},
						{"q_zip":"All","zip_count":4}
					]
				},
				{"q_city":"Lynnwood","region_count":13,
					"zipcodes":[
						{"q_zip":"98109","zip_count":2},
						{"q_zip":"98116","zip_count":1},
						{"q_zip":"98112","zip_count":4},
						{"q_zip":"98132","zip_count":2},
						{"q_zip":"98154","zip_count":1},
						{"q_zip":"98191","zip_count":3},
						{"q_zip":"All","zip_count":13}
					]
				},
				{"q_city":"Shoreline","region_count":7,
					"zipcodes":[
						{"q_zip":"98109","zip_count":2},
						{"q_zip":"98116","zip_count":1},
						{"q_zip":"98112","zip_count":4},
						{"q_zip":"All","zip_count":7}
					]
				},
				{"q_city":"Bothell","region_count":6,
					"zipcodes":[
						{"q_zip":"98109","zip_count":2},
						{"q_zip":"98132","zip_count":2},
						{"q_zip":"98191","zip_count":2},
						{"q_zip":"All","zip_count":6}
					]
				},
				{"q_city":"Kirkland","region_count":3,
					"zipcodes":[
						{"q_zip":"98109","zip_count":2},
						{"q_zip":"98116","zip_count":1},
						{"q_zip":"All","zip_count":3}
					]
				},
				{"q_city":"Bellevue","region_count":7,
					"zipcodes":[
						{"q_zip":"98109","zip_count":2},
						{"q_zip":"98116","zip_count":1},
						{"q_zip":"98112","zip_count":4},
						{"q_zip":"All","zip_count":7}
					]
				},
				{"q_city":"Edmonds","region_count":12,
					"zipcodes":[
						{"q_zip":"98109","zip_count":2},
						{"q_zip":"98116","zip_count":1},
						{"q_zip":"98112","zip_count":4},
						{"q_zip":"98132","zip_count":2},
						{"q_zip":"98154","zip_count":1},
						{"q_zip":"98191","zip_count":2},
						{"q_zip":"All","zip_count":12}
					]
				},
				{"q_city":"Marrysille","region_count":6,
					"zipcodes":[
						{"q_zip":"98109","zip_count":2},
						{"q_zip":"98112","zip_count":4},
						{"q_zip":"All","zip_count":6}
					]
				},
				{"q_city":"Lake Stevens","region_count":3,
					"zipcodes":[
						{"q_zip":"98109","zip_count":2},
						{"q_zip":"98116","zip_count":1},
						{"q_zip":"All","zip_count":3}
					]
				},
				{"q_city":"Redmond","region_count":5,
					"zipcodes":[
						{"q_zip":"98109","zip_count":2},
						{"q_zip":"98116","zip_count":1},
						{"q_zip":"98132","zip_count":2},
						{"q_zip":"All","zip_count":5}
					]
				}
			],
			"time_graph":[
				{"date":"05/18/20","date_count":16},
				{"date":"05/17/20","date_count":6},
				{"date":"05/16/20","date_count":10},
				{"date":"05/15/20","date_count":15},
				{"date":"05/14/20","date_count":3},
				{"date":"05/13/20","date_count":7},
				{"date":"05/12/20","date_count":9}
			],
			"type_graph":[
				{"q_type":"Houses","type_count":9},
				{"q_type":"Manufactured","type_count":7},
				{"q_type":"Condos","type_count":16},
				{"q_type":"Townhomes","type_count":5},
				{"q_type":"Multi-Family","type_count":10},
				{"q_type":"Land","type_count":15},
				{"q_type":"N/A","type_count":20}
			],
			"price_graph":[
				{"q_price_range":"$0 - 200K","price_count":14},
				{"q_price_range":"$200 - 400K","price_count":9},
				{"q_price_range":"$400 - 600K","price_count":17},
				{"q_price_range":"$600 - 800K","price_count":20},
				{"q_price_range":"$800 - 1M","price_count":11},
				{"q_price_range":"$1M+","price_count":10},
				{"q_price_range":"N/A","price_count":5}
			]
		}
	}`;
	dummyJson = JSON.parse(dummyJson);

	// parseResponse(dummyJson.traffic_profile, 'referral-unique');
	// parseResponse(dummyJson.traffic_profile, 'referral-profile');
	// parseResponse(dummyJson.traffic_profile, 'referral-contact');
	// parseResponse(dummyJson.traffic_profile, 'referral-sign');

	var days = $('#traffic-dropdown').val();
	
	getReport(days);

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

		chartTime['referral-unique'].redraw();
		chartType['referral-unique'].redraw();
		chartPrice['referral-unique'].redraw();

		chartTime['referral-profile'].redraw();
		chartType['referral-profile'].redraw();
		chartPrice['referral-profile'].redraw();

		chartTime['referral-contact'].redraw();
		chartType['referral-contact'].redraw();
		chartPrice['referral-contact'].redraw();

		chartTime['referral-sign'].redraw();
		chartType['referral-sign'].redraw();
		chartPrice['referral-sign'].redraw();

		$(window).trigger('resize');
    }); 

});