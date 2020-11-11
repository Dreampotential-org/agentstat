function passBtnID(id) {

    id_arr = id.split('-')
    agent_list_id = id_arr[id_arr.length - 1];
  
    api_call_url = 'agent-list-note/' + agent_list_id + '/';
  
    settings = get_settings(api_call_url, 'GET');
    $.ajax(settings).done(function (response) {
        var response_data = JSON.parse(response);
        // console.log(msg);
        //$('#note-' + agent_list_id).val(response_data['note']);
        $('#agent-' + agent_list_id).val(response_data['agent']);
  
    }).fail(function(err) {
        console.log(err);
    });
  
    $('form').each(function () {
        this.reset()
    });
  
    if($('#'+id).is(':visible')){
        $('#' + id).fadeOut('slow');
    } else {
        $('.fidout').fadeOut('slow');
        $('#' + id).fadeIn('slow');
    } 
}

function dateFormat(str, isFullYear=false) {
    var date = new Date(str);
    var day = date.getDate();
    var month = ("0" + (date.getMonth()+1)).slice(-2);
    var year = (isFullYear==false) ? date.getFullYear().toString().substr(-2) : date.getFullYear().toString();
    return month+'/'+day+'/'+year;
}
  
function makefirstLetterCapital (word) {
    return word.charAt(0).toUpperCase() + word.slice(1)
}

function onlyAddress(address) {
    var address = address.split(',');
    return address[0];
}

function populate_transaction(agent_lists, isAgent=true) {

    $.each(agent_lists, function(k, v) {
        if (currencyFormat(v['sold_price_int']) >= currencyFormat(v['list_price_int'])) {
            var arrowStyle = ' <i class="fa fa-long-arrow-up" style="font-size:18px;color:green"></i>';
        } else {
            var arrowStyle = ' <i class="fa fa-long-arrow-down" style="font-size:18px;color:red"></i>';
        }

        if (v['year_built'] < '2') {
            var note = `<a  onclick="passBtnID('add-public-note-` + v['id'] + `')" value="1" title="notes"><i class="fa fa-sticky-note-o" style="font-size:27px; color: green;"></i></a>`;
        } else {
            var note = `<i class="fa fa-sticky-note-o" style="font-size:27px; color: green;"></i>`;
        }
    
        if(v['home_type'] != null || v['home_type'] != undefined ){
            var hometype= v['home_type'].replace('_',' ');
        }else{
            var hometype= (v['home_type']);
        }
        hometype = makefirstLetterCapital(hometype.toLowerCase());
    
        if (v['note'] != "") {
            var buttonText = '<i class="fa fa-edit" aria-hidden="true"></i> Edit note';
            var buttonClass = 'btn btn-warning';
            var publicNote = 'Edit Public Note';
        } else {
            var buttonText = '<i class="fa fa-plus" aria-hidden="true"></i> Add note';
            var buttonClass = 'btn btn-primary';
            var publicNote = 'Add Public Note';
        }
        
        if (isAgent) {
            var showClass = '';
            var noteInputClass = '';
            var noteHideClass = 'display-none';
            var noteHtml = `<td class="table-column"><button class="`+ buttonClass +`" style="margin:5px;" value="1" title="notes">`+ buttonText +`</button> </td>`;
        } else {
            var showClass = 'display-none';
            var noteInputClass = 'display-none';

            if (v['note'] != "") {
                var noteHtml = '<td><i class="fa fa-sticky-note-o " style="font-size:21px; color: green;"></i></td>';
                var noteHideClass = '';
            } else {
                var noteHtml = '<td><p> </p></td>';
                var noteHideClass = 'display-none';
            } 
        }

        if (v['status']=='Failed') {
            var soldPriceText = '-';
        } else {
            var soldPriceText = currencyFormat(v['sold_price_int']) + arrowStyle;
        }

        var rowHtml = `<tr data-rel="add-public-note-`+ v['id'] +`" onclick="passBtnID('add-public-note-`+ v['id']+ `')">
            <td class='table-column status-`+ v['status'] +`'>` + v['status'] +`</td>
            <td class="table-column">` + currencyFormat(v['list_price_int']) + `</td>
            <td class="table-column">` + soldPriceText +`</td>
            <td class="table-column">` + v['days_on_market'] + `</td>
            <td class="table-column">` + dateFormat(v['list_date']) +`</td>
            <td class="table-column">` + onlyAddress(v['address_text']) +`</td>
            <td class="table-column">` + v['city'] +`</td>
            <td class="table-column">` + v['zipcode'] +`</td>
            <td class="table-column">` + v['year_built'] +`</td>
            <td class="table-column" id="homeType">` + hometype +`</td>
            `+noteHtml+`
        </tr>
    
        <tr class="fidout table-color template" id="add-public-note-`+ v['id'] +`" style="display: none;">
            <td colspan="11" style="padding: 6px 13px; color:gray">
            <div class="form-group">
                <button type="button" class="btn btn-success notebtn `+showClass+`" data-id="`+ v['id'] +`" style="float:left;margin-bottom:5px">
                    Save
                    <i id="note-spinner-`+v['id']+`" class="fa fa-spinner fa-spin" aria-hidden="true" style="display: none;"></i>
                    <i id="note-check-`+v['id']+`" class="fa fa-check" aria-hidden="true" style="display: none;"></i>
                </button>
                <label class="`+showClass+`"><strong>`+publicNote+`</strong></label>
                <div  class="closeform" onclick="closeBtnID('add-public-note-` + v['id'] + `')" style="float:right;margin-bottom:5px"><i class="fa fa-close" style="color: #0896fb;"></i></div>
                
                <textarea class="public-note-text form-control `+noteInputClass+`" id="note-` + v['id'] + `" rows="5" name="public-note">`+ v['note'] +`</textarea>
                <div class="note-text `+noteHideClass+`" ><b>Note: </b>`+ v['note'] +`</div>
                
            </div>
            <div class="text-left" title_color>
            <p class="detail-header">` + v['address_text'] +`</p>
            <table class="detailed-table" style="width:100%">
                <tr>
                <td style="width:35%;border:none !important">
                    <table style="width:100%; margin-top: -65px;">
                        <tr>
                            <td colspan=1 style='text-align: left;padding: 5px 10px;color: gray; border:none'>
                                <p class="detail-sub-header">Listed:</p>
                                <span class="detail-text">` + dateFormat(v['list_date']) +`</span> <br>
                                <span class="detail-text">` + currencyFormat(v['list_price_int']) +`</span>
                            </td>
                            <td colspan=2 style='text-align: left;padding: 5px 10px;color: gray;border:none'>
                                <p class="detail-sub-header">Sold:</p>
                                <span class="detail-text">` + dateFormat(v['sold_date']) +` <br></span>
                                <span class="detail-text">` + currencyFormat(v['sold_price_int']) +`</span>
                            </td>
                        </tr>
                        <tr>
                        <td colspan=2 style='text-align: left;padding: 5px 10px;color: gray;'>
                            <span class="detail-sub-header">Days on Market:</span><span class="detail-text"> ` + v['days_on_market']+ `<span> <br>
                            <span class="detail-sub-header">List to Sell Ratio:</span><span class="detail-text"> 100%<span> <br>
                        </td> <br>
                        
                        </tr>
                    </table>
                    </td>
                    <td style="width:5%;border-left: 2px solid black !important;border: none;"></td>
                    <td style="width:60%">
                    <table style="width:100%">
                        <tr>
                        <!-- <td style="text-align:left;">
                            <strong>Type:</strong> ` + hometype + ` <br>
                            <strong>Beds:</strong> ` + v['beds']+ ` <br>
                            <strong>Baths:</strong> ` + v['baths']+ ` <br>
                            <strong>Sqft:</strong> ` + v['sqft']+ ` <br>
                            <strong>Year Built:</strong> ` + v['year_built']+ ` <br>
                            <strong>State:</strong> ` + v['state']+ ` <br>
                            </td>
                            <td style="text-align:left; ">
                            <strong>Heating:</strong> ` + v['heating'] + ` <br>
                            <strong>Cooling:</strong> ` + v['cooling'] + ` <br>
                            <strong>Parking:</strong> ` + v['parking'] + ` <br>
                            <strong>Basement:</strong> ` + v['basement'] + ` <br>
                            <strong>Flooring:</strong> ` + v['flooring'] + ` <br>
                            <strong>Roof:</strong> ` + v['roof'] + ` <br>
                            <strong>Foundation:</strong> ` + v['foundation'] + ` <br>
                            </td> -->
                            <td  style="padding:0px;border:none">
                                <span class="detail-sub-header">Type</span>
                            </td>
                        
                            <td  style="padding:0px;border:none">
                                <span class="detail-text">` + hometype + `</span>
                            </td>
                            <td style="border:none"></td>
                            <td style="padding:0px;font-size: 16px;border:none">
                                <span class="detail-sub-header">Heating</span>
                            </td>
                            <td style="padding:0px;border:none">
                                <span class="detail-text">Forced Air</span>
                            </td>
    
                        </tr>
                        <tr>
                            <td style="padding:0px;border:none">
                                <span class="detail-sub-header">Beds</span>
                            </td>
                            <td  style="padding:0px;border:none">
                                <span class="detail-text">` + v['beds'] + `</span>
                            </td>
                            <td style="border:none" ></td>
                            <td style="padding:0px ;font-size: 16px;border:none">
                                <span class="detail-sub-header">Cooling</span>
                            </td>
                            <td  style="padding:0px;border:none">
                                <span class="detail-text">None</span>
                            </td>
                        </tr>
                        <tr>
                            <td  style="padding:0px;border:none">
                                <span class="detail-sub-header">Baths</span>
                            </td>
                            <td  style="padding:0px;border:none">
                                <span class="detail-text">` + v['baths'] + `</span>
                            </td>
                            <td style="border:none"></td>
                            <td style="padding:0px ;font-size: 16px;border:none">
                            <span class="detail-sub-header">Parking</span>
                            </td>
                            <td style="padding:0px;border:none">
                                <span class="detail-text">Attached Garage</span>
                            </td>
                        </tr>
                        <tr>
                            <td  style="padding:0px;border:none">
                                <span class="detail-sub-header">Sqft</span>
                            </td>
                            <td  style="padding:0px;border:none">
                                <span class="detail-text">1,550</span>
                            </td>
                            <td style="border:none"></td>
                            <td style="padding:0px;font-size: 16px;border:none">
                            <span class="detail-sub-header">Basement</span>
                                
                            </td>
                            <td style="padding:0px;border:none">
                                <span class="detail-text">None</span>
                            </td>
                        </tr>
    
                        <tr>
                            <td  style="padding:0px ;font-size: 16px;border:none">
                                <span class="detail-sub-header">Lot</span>
                            </td>
                            <td  style="padding:0px;border:none"> 
                                <span class="detail-text">0.45 acres</span>
                            </td>
                            <td style="border:none"></td>
                            <td style="padding:0px;font-size: 16px;border:none">
                                <span class="detail-sub-header">Flooring</span>
                            </td>
                            <td  style="padding:0px;border:none">
                                <span class="detail-text">Laminate, Hardwood</span>
                            </td>
                        </tr>
    
                        <tr>
                            <td  style="padding:0px;font-size: 16px;border:none">
                                <span class="detail-sub-header">Year Built</span>
                            </td>
                            <td  style="padding:0px;border:none"> 
                                <span class="detail-text">` + v['year_built'] + `</span>
                            </td>
                            <td style="border:none"></td>
                                <td style="padding:0px;border:none">
                                <span class="detail-sub-header">Roof</span>
                            </td>
                            <td style="padding:0px;border:none">
                                <span class="detail-text">Composition</span>
                            </td>
                        </tr>
    
                        <tr>
                            <td  style="padding:0px;font-size: 16px;border:none">
                                <span class="detail-sub-header">County</span>
                            </td>
                            <td  style="padding:0px;border:none"> 
                                <span class="detail-text">King</span>
                            </td>
                            <td style="border:none"></td>
    
                            <td style="padding:0px;font-size: 16px;border:none">
                                <span class="detail-sub-header">Foundation</span>
                            </td>
                            <td  style="padding:0px;border:none">
                                <span class="detail-text">Crawl Raised</span>
                            </td>
                        </tr>
                    </tr>
                    </table>
                </td>
                </tr>
            </table>
            </div>
            </td>
            <td style="display:none;"></td>
            <td style="display:none;"></td>
            <td style="display:none;"></td>
            <td style="display:none;"></td>
            <td style="display:none;"></td>
            <td style="display:none;"></td>
            <td style="display:none;"></td>
            <td style="display:none;"></td>
            <td style="display:none;"></td>
            <td style="display:none;"></td>
        </tr>
        `;

        $("#table-transaction-body").append(rowHtml);
    });


    $('#transations-table').dataTable({
        "bSort" : false,
        "bLengthChange": false,
        "pageLength": 20,
        "dom": 'lrtip',
        "fnInfoCallback": function( oSettings, iStart, iEnd, iMax, iTotal, sPre ) {
            var info = 'Showing '+Math.floor(iStart/2)+' to '+Math.floor(iEnd/2)+' of '+Math.floor(iTotal/2)+' entries';
            return info;
        },
        "language": {
            paginate: {
                next: '»',
                previous: '«'
            }
          }
    });
    
}

function sortByType(cityTypeData, qCity='', homeType='') {
    var arr1 = [];
    var arr2 = [];
    var arr3 = [];
    $.each(cityTypeData, function(k,v){
        if (v['home_type'] === null) {
            arr1.push(v);
        } else if (homeType.toLowerCase() == v['home_type'].toLowerCase()) {
            arr2.push(v);
            if (qCity == v['city'].toLowerCase()) {
                matchedScoreObj = v;
            }
        } else {
            arr3.push(v);
        }
    });

    return arr1.concat(arr2).concat(arr3);
}

function sortByCity(agent_scores) {
    var qCity = cityFilter;
    var homeType = propertyTypeFilter;

    if (qCity) {
        var html = `<li><span>`+qCity+` <a class="remove-city-filter" href="javascript:void(0)"><i class="fa fa-times"></i></a></span></li>`;
        $('#filter-tags').append(html);
    }
    if (homeType) {
        var html = `<li><span>`+homeType+` <a class="remove-property-filter" href="javascript:void(0)"><i class="fa fa-times"></i></a></span></li>`;
        $('#filter-tags').append(html);
    }

    qCity = qCity.toLowerCase();
    var cityMatchedArr = [];
    var citiesArr = [];
    $.each(agent_scores, function(k,v){
        if (v['city'] !== null) {
            var cityVal = v['city'].toLowerCase();
            if (qCity==cityVal) {
                if(cityMatchedArr.indexOf(cityVal) === -1){
                    cityMatchedArr.push(cityVal);
                } 
            } else {
                if(citiesArr.indexOf(cityVal) === -1){
                    citiesArr.push(cityVal);
                } 
            }
        }
    });
    var cities = cityMatchedArr.concat(citiesArr);
    
    var finalData = [];
    var counter = 0;
    var badgesArr = [];
    $.each(cities, function(k,v){
        var cityTypeData = [];
        $.each(agent_scores, function(k1,v1){
            if (v1['city'] !== null && v == v1['city'].toLowerCase()) {
                cityTypeData.push(v1);
                if (qCity == v1['city'].toLowerCase() && v1['home_type'] === null) {
                    matchedScoreObj = v1;
                }

                if (v1['home_type'] === null) {
                    var agent_percentage = agentTopPercentage(v1['agent_rank'], v1['rank_count']);
                    badgesArr.push({
                        'agent_percentage':agent_percentage,
                        'city':v1['city']
                    });
                }
            }
        });
        var sortedType = sortByType(cityTypeData, qCity, homeType);
        $.each(sortedType, function(k2,v2){
            finalData.push(v2)
        });
    });

    badgesArr.sort(function(a, b) {
        return a.agent_percentage - b.agent_percentage;
    });

    $.each(badgesArr, function(k,v){
        $('#badges-top-rank').show();
        if (counter < 5) {
            var splitCity = v['city'].split(' ');
            var city = splitCity[0];
            if (splitCity[1] !== undefined) {
                city = city+ ' '+splitCity[1];
            }
            // var html = `
            // <div class="block-col">
            //     <div class="block">
            //         <strong class="heading" id="cvtext-`+counter+`">`+splitCity[0]+`</strong>
            //         <strong class="text">TOP</strong>
            //         <span class="percantege">`+v['agent_percentage']+`%</span>
            //     </div>
            // </div>
            // `;
            var className = '';
            if (city.length > 10 && city.length < 14 ) {
                className = 'bottom-text1';
            } else if(city.length > 13) {
                className = 'bottom-text2';
            } 

            var cityWithoutSpace = city.replace(/\s+/g, '')
            var html = `
            <li id="city-badge-`+cityWithoutSpace+`" data-city="`+city+`">
                <img src="/img/badgelable.svg">
                <div class="text-box">
                    <span>Top</span>
                    <span>`+v['agent_percentage']+`%</span>
                </div>
                <div class="bottom-text `+className+`">`+city+`</div>
            </li>
            `;

            $('#badges-top-rank').append(html);

            // new CircleType(document.getElementById('cvtext-'+counter)).radius(150);
        }
        counter++;
    });

    $('.bottom-text').arctext({radius: 50, dir: -1});

    return finalData;
}

function getFilters() {
    var full_path = window.location.pathname;
    var screenName = null;
    var slug = null;
    var url = '';
    if (full_path.split('/')[1] == 'profile' && full_path.split('/')[3] !== undefined && full_path.split('/')[3] != "" ) {
        screenName = full_path.split('/')[2];
        slug = full_path.split('/')[3];
        url = API_URL+'custom-link/'+screenName+'/'+slug;
    }

    var urlParams = new URLSearchParams(window.location.search);
    if (urlParams.has('agent_id') && urlParams.has('q')) {
        url = API_URL+'custom-link/'+urlParams.get('agent_id')+'/'+urlParams.get('q');
    }

    if (url)  {
        has_custom_link = true;
        var jqXHR = $.ajax({
            url: url,
            type: 'GET',
            async: false,
        });
        
        return JSON.parse(jqXHR.responseText);
    } else {
        return '';
    }
}

function populate_cities(agent_scores) {  
    $('#filter-tags').html('');
    $('#badges-top-rank').html('');
    $('#city-table-body').html('');

    matchedScoreObj = {};
    var finalData = sortByCity(agent_scores);

    cityOverallCount = 1;
    $.each(finalData, function(k,v){

        if (v['home_type'] == null) {
            var homeType = 'Overall';
        } else {
            var homeType = v['home_type'];
        }

        if (v['avg_dom'] == null) {
            avg_dom = '-'
        } else {
            avg_dom = v['avg_dom'].toFixed(2)
        }

        if (v['s2l_price'] == null) {
            s2l_price = '-'
        } else {
            s2l_price = v['s2l_price'].toFixed(2)
        }
        
        var city_avg_dom = '';
        if (v['city_stats']['avg_dom']) {
          city_avg_dom = v['city_stats']['avg_dom'].toFixed(2);
        }

        var avg_dom = '';
        if (v['avg_dom']) {
          avg_dom = Math.round(v['avg_dom']);
        }

        var city_s2l_price = '';
        if (v['city_stats']['s2l_price']) {
          city_s2l_price = v['city_stats']['s2l_price'].toFixed(2);
        }

        var s2l_price = '';
        if (v['s2l_price']) {
          s2l_price = v['s2l_price'].toFixed(2);
        }

        if (homeType == 'Overall') {
            var displayNone = '';
            var rightArrowHtml = '<p class="right-arrow-city" data-city="'+v['city']+'"> '+v['city']+' <i class="fa fa-chevron-right" aria-hidden="true" style="margin-left:10px;"></i></p>';
            var downArrowHtml = '<p class="down-arrow-city" style="display:none;" data-city="'+v['city']+'"> '+v['city']+' <i data-city="'+v['city']+'" class="fa fa-chevron-down" aria-hidden="true" style="margin-left:10px;"></i></p>';
            var city = '';
            var rowNumber = 'score-row-'+cityOverallCount;
            cityOverallCount++;
        } else {
            var displayNone = 'display:none;';
            var rightArrowHtml = '';
            var downArrowHtml = '';
            var city = v['city'].replace(/\s+/g, '');
            var rowNumber = '';
        }

        var successRate = (100 - ((v['failed_listings']/v['sold_listings'])*100));
        var successRate = calculateSuccessRate(v['failed_listings'], v['sold_listings']);

        var rowHtml = `
        <tr class="score-`+ city +` `+rowNumber+` score-overall-row" style="`+displayNone+`">
            <td class="table-column">`+rightArrowHtml+downArrowHtml+ ` </td>
            <td class="table-column">` + homeType +`</td>
            <td class="table-column">` + v['agent_rank'] + `/` + v['rank_count'] + `</td>
            <td class="table-column">` + successRate +`%</td>
            <td class="table-column">` + Math.round(v['s2l_price']) +`%</td>
            <td class="table-column">` + avg_dom +`</td>
            <td class="table-column">` + v['sold_listings'] +`</td>
            <td class="table-column">` + v['failed_listings'] +`</td>
        </tr>
        `;

        $('#city-table-body').append(rowHtml);
    });

    cityOverallCount--;

    ifFilterMatched();

    var cityFilterClean = cityFilter.toLowerCase().replace(/\s/g, '');
    var matchedCityClean = $('#city-table-body .score- .table-column p').first().text().toLowerCase().replace(/\s/g, '');
    if (cityFilterClean == matchedCityClean) {
        setTimeout(function() {
            $('#city-table-body .score- .table-column .right-arrow-city').first().click();
        }, 100);
    }

    if (cityFilter != '') { 
        $('#badges-top-rank img').removeClass('badge-border');

        var cityWithoutSpace = cityFilter.replace(/\s+/g, '');
        $('#city-badge-'+cityWithoutSpace+' img').addClass('badge-border');
    }

    loadPagination();
}

function loadPagination() {
    $('#city-table_paginate .pagination').html('');

    var pages = Math.ceil(cityOverallCount/10);
    var html = `
    <li class="paginate_button page-item previous disabled" id="city-table_previous">
        <a href="javascript:void(0)" data-page="prev" class="page-link">«</a>
    </li>`;
    
    for (var i = 1; i <= pages; i++) {
        var active = '';
        if (i == 1) {
            active = 'active';
        }
        html += `
        <li class="paginate_button page-item page-item-`+i+` `+active+`">
            <a href="javascript:void(0)" data-page="`+i+`" class="page-link">`+i+`</a>
        </li>
        `;
    }

    html += `
    <li class="paginate_button page-item next" id="city-table_next">
        <a href="javascript:void(0)" data-page="next" class="page-link">»</a>
    </li> 
    `;

    $('#city-table_paginate .pagination').append(html);

    showScorePageNo(1);
}

function showScorePageNo(pageNo) {

    $('#city-table_previous').removeClass('disabled');
    if (pageNo == 1) {
        $('#city-table_previous').addClass('disabled');
    }

    var totalPages = Math.ceil(cityOverallCount/10);
    $('#city-table_next').removeClass('disabled');
    if (pageNo == totalPages) {
        $('#city-table_next').addClass('disabled');
    }

    $('.score-overall-row').hide();
    pageNo = pageNo - 1;
    var start = pageNo*10;
    var end = 0;
    for(var i=start+1; i <= start+10; i++ ) {
        $('.score-row-'+i).show();
        end = i;
    }
    start++;

    if (end > cityOverallCount) {
        end = cityOverallCount;
    }
    var info = 'Showing '+start+' to '+end+' of '+cityOverallCount+' entries';
    $('#city-table_info').html(info);
}

$(document).on('click', '#city-table_paginate .page-link', function() {
    var page = $(this).data('page');
    console.log(page);
    if (page == 'prev') {
        activePaginationPageNo--;
    } else if (page == 'next') {
        activePaginationPageNo++;
    } else {
        activePaginationPageNo = page;
    }
    
    

    showScorePageNo(activePaginationPageNo);

    $('#city-table_paginate .page-item').removeClass('active');
    $('.page-item-'+activePaginationPageNo).addClass('active');
});

$(document).on('click', '.right-arrow-city', function(){
    var city = $(this).data('city').replace(/\s+/g, '');
    $('.score-'+city).fadeIn('slow');
    $(this).hide();
    $(this).next().show();
});

$(document).on('click', '.down-arrow-city', function(){
    var city = $(this).data('city').replace(/\s+/g, '');
    $('.score-'+city).fadeOut('slow');
    $(this).hide();
    $(this).prev().show();
});


$(document).on('click', '.remove-city-filter', function(){
    $(this).hide();
    cityFilter = '';
    setOverallAgentScore();
    populate_cities(cityScoreAllData);
});

$(document).on('click', '.remove-property-filter', function(){
    $(this).hide();
    propertyTypeFilter = '';
    setOverallAgentScore();
    populate_cities(cityScoreAllData);
});

$(document).on('click', '.change-duration-btn', function(){
    var duration = $(this).data('duration');
    load_agent_score(duration);
});

function returnFilters(customLink) {
    var allFilter = '';

    var address = '';
    var city = '';
    var zipcode = '';
    if (customLink.street_address && customLink.address_city && customLink.address_zipcode) {
        address = customLink.street_address+', '+customLink.address_city+', '+customLink.address_zipcode;
        cityFilter = customLink.address_city;
    } else if (customLink.city) {
        city = customLink.city;
        cityFilter = customLink.city;
    } else if (customLink.zipcode) {
        zipcode = customLink.zipcode;
    }

    if (address) {
        allFilter = address;
    }
    if (city) {
        allFilter = city;
    }
    if (zipcode) {
        allFilter = zipcode;
    }


    var propertyType = '';
    if (customLink.property_type) {
        propertyType = customLink.property_type;
        allFilter += ', '+propertyType;
        propertyTypeFilter = customLink.property_type;
    }

    var priceRange = '';
    if (customLink.min_price && customLink.max_price) {
        priceRange = customLink.min_price +' - '+ customLink.max_price;
        allFilter += ', '+priceRange;
    }

    return {
        'address':address,
        'city':city,
        'zipcode':zipcode,
        'propertyType':propertyType,
        'priceRange':priceRange,
        'allFilter':allFilter, 
    };
}

function populate_custom_links(data, destroy=false) {
    if (destroy) {
        $('#custom-links-table').DataTable().clear().destroy();
    }

    if (data.agent_screen_name) {
        profile_url = '/profile/' + data.agent_screen_name+'/';
    } else {
        profile_url = '/page-three.html?agent_id=' + data.agent_id+'&q=';
    }

    $('#custom-links-table-body').html('');
    $.each(data.custom_links, function(k,v){
        var filterObj = returnFilters(v);
        
        var customUrl = profile_url+v['slug'];
        var rowHtml = `
        <tr id="custom-link-`+v['id']+`">
            <td class="table-column"><p style="margin-top: 10px;">` + dateFormat(v['created_at'], true) +`</p></td>
            <td class="table-column"><a target="_blank" href="`+customUrl+`">www.agentstat.com`+customUrl+`</a></td>
            <td class="table-column">` + filterObj.allFilter +`</td>
            <td class="table-column">` + v['total_view'] +`</td>
            <td class="table-column">` + v['contact_request'] +`</td>
            <td class="table-column">` + v['unique_visitor'] +`</td>
            <td class="table-column"><a href="javascript:void(0)" class="delete-custom-link" data-id="`+v['id']+`">` + 'Delete Link' +`</a></td>
        </tr>
        `;

        $('#custom-links-table-body').append(rowHtml);
    });

    $('#custom-links-table').dataTable({
        "bSort" : false,
        "bLengthChange": false,
        "pageLength": 10,
        "dom": 'lrtip',
        "language": {
            paginate: {
                next: '»',
                previous: '«'
            }
        }
    }); 
}

function agentTopPercentage(rank, count) {
    var agent_percentage = rank / count * 100;
    agent_percentage = Math.round(agent_percentage);
    agent_percentage = (agent_percentage == 0) ? 1 : agent_percentage;
    return agent_percentage;
}

function calculateSuccessRate(failed_listings, sold_listings) {
    var percantege =  (100 - ((failed_listings / sold_listings) * 100));
    return Math.round(percantege);
}

function setOverallAgentScore() {
    var successRate = calculateSuccessRate(agentOverallScoreObj['failed_listings'], agentOverallScoreObj['sold_listings']);

    $('.overall_score').html(successRate+'%');
    $("#overall-avg-dom").html(Math.round(agentOverallScoreObj['avg_dom']));
    $("#overall-s2l-price").html(Math.round(agentOverallScoreObj['s2l_price']));
    $('.overall_sold_listings').html(agentOverallScoreObj['sold_listings']);
    
}

function ifFilterMatched() {
    if (Object.keys(matchedScoreObj).length > 0) {
        var successRate = calculateSuccessRate(matchedScoreObj['failed_listings'], matchedScoreObj['sold_listings']);
        $('#overall-score').html(successRate+'%');
        

        if (matchedScoreObj['avg_dom']) {
            var city_avg_dom = Math.round(matchedScoreObj['avg_dom']);
            $('#overall-avg-dom').html(city_avg_dom);
        }
    
        if (matchedScoreObj['s2l_price']) {
            var s2l_price = Math.round(matchedScoreObj['s2l_price']);
            $('#overall-s2l-price').html(s2l_price);
        }
       
        if (matchedScoreObj['sold_listings']) {
            $('.overall_sold_listings').html(matchedScoreObj['sold_listings']);
        }
    }
}

