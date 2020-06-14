agentReviewsList = [];

function initSlickCarouselProfile() {
	jQuery('.reviews-slider').slick({
        slidesToShow: 1,
		slidesToScroll: 1,
		rows: 0,
		prevArrow: '<a hrref="#" class="slick-prev"><i class="icon-double-chevron"></i></a>',
		nextArrow: '<a hrref="#" class="slick-next"><i class="icon-double-chevron1"></i></a>',
		dots: true,
        centerMode: true,
        centerPadding: '15px',
		dotsClass: 'slick-dots'
    });
}

function initSlickCarousel() {
	jQuery('.reviews-slider').slick({
        slidesToShow: 3,
		slidesToScroll: 1,
		rows: 0,
		prevArrow: '<a hrref="#" class="slick-prev"><i class="icon-double-chevron"></i></a>',
		nextArrow: '<a hrref="#" class="slick-next"><i class="icon-double-chevron1"></i></a>',
		dots: true,
        centerMode: true,
        initialSlide: 1,
        variableWidth: true,
        centerPadding: '15px',
		dotsClass: 'slick-dots'
    });
    $('.center').on('beforeChange', function(event, slick, currentSlide, nextSlide){
      console.log('beforeChange', currentSlide, nextSlide);
    });
    $('.center').on('afterChange', function(event, slick, currentSlide){
      console.log('afterChange', currentSlide);
    });
}


function ratingToPercent(rating) {
    return parseFloat(rating)*20;
}

function agent_profile_review(reviewList, toShow=1) {
    agentReviewsList = reviewList;
    $.each(agentReviewsList, function(k, v) {
        var ratingPercentage = ratingToPercent(v['rating']);
        $('#reviews-list').append(`
            <div class="one-slide">
                <strong class="name">`+v['full_name']+`</strong>
                <span class="date">`+niceDate(v['date'])+`</span>
                <div class="reviews-holder">
                    <div class="review">
                        <span class="reviews-bar">
                            <span class="fill" style="width: `+ratingPercentage+`%;"></span>
                        </span>
                    </div>
                    <a href="javascript:void(0)" class="link review-detail" data-id="`+v['id']+`">Details?</a>
                </div>
                <blockquote>
                    <q>`+v['review']+`</q>
                </blockquote>
            </div>
        `);
    });

    initSlickCarouselProfile();
}

function agent_review(reviewList) {
    agentReviewsList = reviewList;
    $.each(agentReviewsList, function(k, v) {
        var ratingPercentage = ratingToPercent(v['rating']);
        $('#reviews-list').append(`
            <div class="one-slide review-`+v['id']+`">
                <div class="review-wrap">
                    <button class="delete-review" data-id="`+v['id']+`"><span><i class="far fa-times-circle" aria-hidden="true"></i></span></button>
                    <strong class="name">`+v['full_name']+`</strong>
                    <span class="date">`+niceDate(v['date'])+`</span>
                    <div class="reviews-holder">
                        <div class="review">
                            <span class="reviews-bar">
                                <span class="fill" style="width: `+ratingPercentage+`%;"></span>
                            </span>
                        </div>
                        <a href="javascript:void(0)" class="link review-detail" data-id="`+v['id']+`">Details?</a>
                    </div>
                    <blockquote class="ttip">
                        <span class="ttip_text">`+v['review']+`</span>
                        <q>`+v['review']+`</q>
                    </blockquote>
                </div>
            </div>
        `);
    });

    initSlickCarousel();
    
    if (agentReviewsList.length == 2) {
        setTimeout(function (){
            $('.slick-current').removeClass('slick-current');
        }, 200);
    }
}

function reviewStarHtml(rating) {
    var ratingPercentage = ratingToPercent(rating);
    var html = `
        <div class="reviews-slider">
            <div class="reviews-holder">
                <div class="review">
                    <span class="reviews-bar">
                        <span class="fill" style="width: `+ratingPercentage+`%;"></span>
                    </span>
                </div>
            </div>
        </div>
    `;
    return html
}

$(document).on('click', '.review-detail', function() {
    $('#review-detail').modal('show');
    $('.review-detail-content').html('');
    var index = agentReviewsList.findIndex(x => x.id == $(this).data('id'));
    var obj = agentReviewsList[index];
    $.each(obj.detail, function(k, v) {
        var category_extra_info = (v.category_extra_info===null) ? '' : '<span style="font-size:14px">' + v.category_extra_info + '</span>';
        $('.review-detail-content').append(`
            <div style="padding: 5px 20px; width: 5500px">
            <div>
                ` + v.category_name + ` `+ category_extra_info  +`
                <br>
                ` + reviewStarHtml(v['rating']) +`
            </div>
            </div>
        `);
    })
});

$(document).on('click', '.delete-review', function() {
    var review_id = $(this).data('id');

    bootbox.confirm({
        message: "Are you sure to delete this review from profile page?",
        buttons: {
            cancel: {
                label: 'Cancel',
                className: 'btn-default'
            },
            confirm: {
                label: 'Delete',
                className: 'btn-danger'
            }
        },
        callback: function (result) {
            if (result===true) {
                settings = get_settings('review/' + profile_id + '/' + review_id, 'DELETE');
                $.ajax(settings).done(function (response) {
                    show_message('Review has been deleted!');
                    $('.review-'+review_id).remove();
                    $('.slick-dots .slick-active').remove();
                });            
            }
        }
    });
});