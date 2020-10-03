function loadTransaction(zpid) {
    settings = get_settings('agents/kendratodd/?listing_id='+zpid, 'GET');
    settings['headers'] = null;
    $.ajax(settings).done(function (response) {
        response = JSON.parse(response);
        var data = response.LISTING_PAGE_DATA;

        $.each(data.photos, function(k,v){
            var sliderImage = `
                <div class="house-slide">
                    <img src="`+v.url+`" alt="">
                    <div class="price-caption">
                        <span>usd</span>
                        <strong>5.85 Lakh</strong>
                    </div>
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
    var full_path = window.location.pathname
    var zpid = null;
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
        data['agent'] = '6557';
        
        settings = get_settings('lead/', 'POST', JSON.stringify(data));
        settings['headers'] = null;
        $.ajax(settings).done(function (response) {

            
            console.log(response)

        }).fail(function (err) {

            // $('.msg').html(err['responseText']);
            console.log(err);

        });
        return false
    });
});