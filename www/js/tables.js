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

function dateFormat(str) {
    var date = new Date(str);
    var day = date.getDate();
    var month = ("0" + (date.getMonth()+1)).slice(-2);
    var year = date.getFullYear().toString().substr(-2);
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

        var rowHtml = `<tr data-rel="add-public-note-`+ v['id'] +`" onclick="passBtnID('add-public-note-`+ v['id']+ `')">
            <td class='table-column status-`+ v['status'] +`'>` + v['status'] +`</td>
            <td class="table-column">` + currencyFormat(v['list_price_int']) + `</td>
            <td class="table-column">` + currencyFormat(v['sold_price_int']) + arrowStyle +`</td>
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
                <button type="button" class="btn btn-success notebtn `+showClass+`" data-id="`+ v['id'] +`" style="float:left;margin-bottom:5px">Save</button>
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
            <td  style="display:none;"></td>
            <td style="display:none;"></td>
            <td style="display:none;"></td>
            <td  style="display:none;"></td>
            <td  style="display:none;"></td>
            <td style="display:none;"></td>
            <td  style="display:none;"></td>
            <td  style="display:none;"></td>
            <td  style="display:none;"></td>
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

function populate_cities(agent_scores) {
    $.each(agent_scores, function(k,v){

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
        var agent_percentage = 100 - v['agent_rank'] / v['rank_count'] * 100
        
        var city_avg_dom = '';
        if (v['city_stats']['avg_dom']) {
          city_avg_dom = v['city_stats']['avg_dom'].toFixed(2);
        }

        var avg_dom = '';
        if (v['avg_dom']) {
          avg_dom = v['avg_dom'].toFixed(2);
        }

        var city_s2l_price = '';
        if (v['city_stats']['s2l_price']) {
          city_s2l_price = v['city_stats']['s2l_price'].toFixed(2);
        }

        var s2l_price = '';
        if (v['s2l_price']) {
          s2l_price = v['s2l_price'].toFixed(2);
        }

        var rowHtml = `
        <tr>
            <td class="table-column"><p style="margin-top: 10px;">` + v['city'] +`</p></td>
            <td class="table-column">` + v['agent_rank'] + `  of ` + v['rank_count'] + ` (TOP ` + agent_percentage.toFixed(2) + `%)</td>
            <td class="table-column">` + v['home_type'] +`</td>
            <td class="table-column">` + city_avg_dom +`</td>
            <td class="table-column">` + avg_dom +`</td>
            <td class="table-column">` + city_s2l_price +`%</td>
            <td class="table-column">` + s2l_price +`%</td>
            <td class="table-column">` + v['sold_listings'] +`</td>
            <td class="table-column">` + v['failed_listings'] +`</td>
        </tr>
        `;

        $('#city-table-body').append(rowHtml);

        $('#city-table').dataTable({
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
    });
}