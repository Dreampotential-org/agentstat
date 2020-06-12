agentReviewsList = [];

function initSlickCarousel(toShow) {
	jQuery('.reviews-slider').slick({
        slidesToShow: toShow,
		slidesToScroll: 1,
		rows: 0,
		prevArrow: '<a hrref="#" class="slick-prev"><i class="icon-double-chevron"></i></a>',
		nextArrow: '<a hrref="#" class="slick-next"><i class="icon-double-chevron1"></i></a>',
		dots: true,
		dotsClass: 'slick-dots'
    });
}


function ratingToPercent(rating) {
    return parseFloat(rating)*20;
}

function agent_review(reviewList, toShow=1) {
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

    initSlickCarousel(toShow);
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
        var category_extra_info = (v.category_extra_info===null) ? '' : '<span style="font-size:14px">' + v.category_extra_info + '</span>';;
        //var ratingPercentage = ratingToPercent(v['rating']);
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