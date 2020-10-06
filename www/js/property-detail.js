function loadTransaction(zpid) {
    settings = get_settings('agents/kendratodd/?listing_id='+zpid, 'GET');
    settings['headers'] = null;
    $.ajax(settings).done(function (response) {
        response = JSON.parse(response);
        var data = response.LISTING_PAGE_DATA;

        agent_id = data.agent_id;
        agent_list_id = data.agent_list_id;

        $.each(data.photos, function(k,v){
            var sliderImage = `
                <div class="house-slide">
                    <img src="`+v.url+`" alt="">
                    <div class="pic-counter">
                        <span>`+data.photos.length+`</span>
                        <img src="/img/pics-count.png" alt="">
                    </div>  
                </div>
            `;
            $('.houser-slider').append(sliderImage);
        });
        $('.houser-slider').slick({
            dots: false,
            infinite: true,
            speed: 300,
            slidesToShow: 1,
            // adaptiveHeight: true
        });


        var description = `<span>`+data.description.substr(0, 130)+`</span>
        <span class="more-text" style="display:none;">`+data.description.substr(130)+`</span>`;
        $('.desc-text').html(description);

        $('.living-area').html(data.livingArea);
        // $('.lot-size').html(data.lotSize);
        $('.bed').html(data.bedrooms);
        $('.bath').html(data.bathrooms);

        $.each(data.listing_sub_type, function(k,v){
            var key = camleCasetoString(k.split("_")[1]);
            $('.others-key').append('<td>'+key+'</td>');
            if (v==true) {
                $('.others-value').append('<td><img src="/img/tick-2.png" alt=""></td>');
            } else {
                $('.others-value').append('<td><img src="/img/false-icon.png" alt=""></td>');
            }
        });

        $.each(data.taxHistory, function(k,v){
            var taxPaid = (v.taxPaid==null) ? '-' : v.taxPaid;
            var html = `
            <tr>
                <td>`+niceDate(v.time)+`</td>
                <td>`+taxPaid+`</td>
                <td>`+v.taxIncreaseRate+`</td>
                <td>`+v.value+`</td>
                <td>-`+v.valueIncreaseRate+`</td>
            </tr>
            `;
            $('#tax-table').append(html);
        });
        
        $.each(data.priceHistory, function(k,v){
            var html = `
            <tr>
                <td>`+niceDate(v.time)+`</td>
                <td>`+v.price+`</td>
                <td>`+v.event+`</td>
                <td>`+v.source+`</td>
            </tr>
            `;
            $('#price-table').append(html);
        });

        if (data.homeStatus!==undefined && data.homeStatus!='') {
            $('.other-detail-key').append('<td>Home Status</td>');
            $('.other-detail-value').append('<td>'+data.homeStatus+'</td>');
        } 
        
        if (data.homeType!==undefined && data.homeType!='') {
            $('.other-detail-key').append('<td>Home Type</td>');
            $('.other-detail-value').append('<td>'+data.homeType+'</td>');
        }   

        if (data.resoFacts.yearBuilt!==undefined && data.resoFacts.yearBuilt!='') {
            $('.other-detail-key').append('<td>Year Built</td>');
            $('.other-detail-value').append('<td>'+data.resoFacts.yearBuilt+'</td>');
        }

        if (data.lotSize!==undefined && data.lotSize!='') {
            $('.other-detail-key').append('<td>Lot Size</td>');
            $('.other-detail-value').append('<td>'+data.lotSize+'</td>');
        }
        
        if (data.countyFIPS!==undefined && data.countyFIPS!='') {
            $('.other-detail-key').append('<td>County FIPS</td>');
            $('.other-detail-value').append('<td>'+data.countyFIPS+'</td>');
        }
        
        if (data.resoFacts.cooling!==undefined && data.resoFacts.cooling.length != 0) {
            $('.other-detail-key').append('<td>Cooling</td>');
            $('.other-detail-value').append('<td>'+data.resoFacts.cooling.toString()+'</td>');
        }
        
        if (data.resoFacts.heating!==undefined && data.resoFacts.heating.length != 0) {
            $('.other-detail-key').append('<td>Heating</td>');
            $('.other-detail-value').append('<td>'+data.resoFacts.heating.toString()+'</td>');
        }
        
        if (data.resoFacts.parking!==undefined && data.resoFacts.parking!='') {
            $('.other-detail-key').append('<td>Parking</td>');
            $('.other-detail-value').append('<td>'+data.resoFacts.parking+'</td>');
        }

        if (data.streetAddress!==undefined && data.streetAddress!='') {
            $('.street').html(data.streetAddress);
        }

        if (data.address.city!==undefined && data.address.city!='') {
            $('.city').html(data.address.city);
        }

        if (data.address.state!==undefined && data.address.state!='') {
            $('.state').html(data.address.state);
        }

        if (data.address.zipcode!==undefined && data.address.zipcode!='') {
            $('.zipcode').html(data.address.zipcode);
        }

        if (data.address.zipcode!==undefined && data.address.zipcode!='') {
            $('.zipcode').html(data.address.zipcode);
        }
    }); 
}

$(document).ready(function(){
    $("#phone").inputmask({ "mask": "(999) 999-9999" });

    var full_path = window.location.pathname
    var zpid = null;
    agent_id = null;
    agent_list_id = null;
    if (full_path.split('/')[1] == 'property-detail') {
        zpid = full_path.split('/')[2];
    }

    loadTransaction(zpid);

    $('.load-more-btn').on('click', function(){
        $('.more-text').fadeIn();
    });

    $('#contact-form').on('submit', function(){
        var data = {};
        data['name'] = $('#name').val();
        data['email'] = $('#email').val();
        data['phone'] = $('#phone').val();
        data['message'] = $('#message').val();
        data['agent'] = agent_id;
        data['agentlist'] = agent_list_id;

        $('#load-icon').show();
        $('#check-icon').hide();
        
        settings = get_settings('lead/', 'POST', JSON.stringify(data));
        settings['headers'] = null;
        $.ajax(settings).done(function (response) {
            $('#load-icon').hide();
            $('#check-icon').show();

            $('#name').val('');
            $('#email').val('');
            $('#phone').val('');
            $('#message').val('');            
        }).fail(function (err) {
            // $('.msg').html(err['responseText']);
            $('#load-icon').hide();
            $('#check-icon').hide();
            console.log(err);
        });
        return false
    });
});