function parseProfileViews(res) {
	$('#traffic-profile-views').html(res.hits.total.value);

	var record = 1;
	$.each(res.aggregations.group_by_client_regionName.buckets, function(k, v){

		if (record == 1) {
			var state = `<p class="traffic-profile-state location-active" data-state="`+v.key+`">`+v.key+` (`+v.doc_count+`) <i class="fas fa-chevron-right"></i></p>`;
			zipcodeHtml('#traffic-profile-zipcode', v.group_by_client_zip.buckets);
		} else {
			var state = `<p class="traffic-profile-state" data-state="`+v.key+`">`+v.key+` (`+v.doc_count+`) <i class="fas fa-chevron-right hide"></i></p>`;
		}
		$('#traffic-profile-state-div').append(state);
		record++;
	});

}

function zipcodeHtml(element, zipcodes) {
	$(element).html('');
	$.each(zipcodes, function(k, v){
		var zipcode = `<p>`+v.key+` (`+v.doc_count+`)</p>`;
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
	
	//profileViewsjson = '{"took":2,"timed_out":false,"_shards":{"total":5,"successful":5,"skipped":0,"failed":0},"hits":{"total":{"value":7,"relation":"eq"},"max_score":null,"hits":[]},"aggregations":{"group_by_client_regionName":{"doc_count_error_upper_bound":0,"sum_other_doc_count":0,"buckets":[{"key":"Punjab","doc_count":6,"group_by_client_zip":{"doc_count_error_upper_bound":0,"sum_other_doc_count":0,"buckets":[{"key":"54000","doc_count":6}]}},{"key":"New Jersey","doc_count":1,"group_by_client_zip":{"doc_count_error_upper_bound":0,"sum_other_doc_count":0,"buckets":[{"key":"08854","doc_count":1}]}}]}}}';
	//profileViewsjson = JSON.parse(profileViewsjson);
	//parseProfileViews(profileViewsjson);

	$(document).on('click', '.traffic-profile-state', function() {
		$('.traffic-profile-state').removeClass('location-active');
		$(this).addClass('location-active');

		$('.traffic-profile-state .fa-chevron-right').addClass('hide');
		$(this).find('.fa-chevron-right').removeClass('hide');
		
		var index = profileViewsjson.aggregations.group_by_client_regionName.buckets.findIndex(x => x.key == $(this).data('state'));
		var zipcodes = profileViewsjson.aggregations.group_by_client_regionName.buckets[index];
		zipcodeHtml('#traffic-profile-zipcode', zipcodes.group_by_client_zip.buckets);
	});

	$('.range-dropdown').on('change', function() {
		//alert($(this).val());
	});
	
});
