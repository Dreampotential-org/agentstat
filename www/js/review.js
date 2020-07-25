function ratingToPercent(rating) {
    return parseFloat(rating)*20;
}

function reviewStarHtml(rating) {
    var ratingPercentage = ratingToPercent(rating);
    var html = `
        <div class="rating-popup">
            <div class="reviews-sub-ratings">
                <span class="rating-star">
                    <span class="fill" style="width: `+ratingPercentage+`%;"></span>
                </span>
            </div>
        </div>
    `;
    return html
}


function agent_review(reviewList, pageSize=1) {
    agentReviewsList = reviewList;
    $.each(agentReviewsList, function(k, v) {
        var ratingPercentage = ratingToPercent(v['rating']);

        var subHtml = '';

        $.each(v['detail'], function(k1, v1){
            var subRatingPercentage = ratingToPercent(v1['rating']);
            subHtml += '<li>';
                subHtml += '<span class="review-text">'+v1['category_name']+':</span>';
                subHtml += '<span class="rating-star"><span class="fill" style="width: '+subRatingPercentage+'%;"></span></span>';
            subHtml += '</li>';
        });

        var html = `
        <tr>
            <td>
                <div class="rating-popup">
                    <div class="popup-container">
                        <div class="popup-holder popup-active">
                            <div class="popup">
                                <div class="popup-heading">
                                    <span class="rating-star">
                                        <span class="fill" style="width: `+ratingPercentage+`%;"></span>
                                    </span>
                                    <h3>`+v['overall_rating_desc']+`</h3>
                                    <a class="flag"><img src="/img/flag01.png" alt="flag"></a>
                                </div>
                                <div class="review-info">
                                    <span class="text">`+niceDate(v['date'])+` - `+v['full_name']+`</span>
                                    <span class="text">`+v['work_done']+`</span>
                                </div>
                                <ul class="reviews-sub-ratings">
                                    `+subHtml+`
                                </ul>
                                <div class="popup-content active">
                                    <p>`+v['review']+` - `+v['review_body_extra']+`</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </td>
        </tr>
        `;

        $('#review-listing-body').append(html);

        
    });

    if (Object.keys(agentReviewsList).length !== 0) {
        $('#review-listing').dataTable({
            "bSort" : false,
            "bLengthChange": false,
            "pageLength": pageSize,
            "dom": 'lrtip',
            "language": {
                paginate: {
                    next: 'NEXT',
                    previous: false
                }
              }
        });
    }
}