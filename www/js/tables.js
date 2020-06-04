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
            var noteHideClass = '';
            var noteDisabled = '';
            var noteHtml = `<td class="table-column"><button class="`+ buttonClass +`" style="margin:5px;" value="1" title="notes">`+ buttonText +`</button> </td>`;
        } else {
            var showClass = 'display-none';
            var noteDisabled = 'disabled';

            if (v['note'] != "") {
                var noteHtml = '<td><i class="fa fa-sticky-note-o " style="font-size:21px; color: green;"></i></td>';
                var noteHideClass = '';
            } else {
                var noteHtml = '<td><p> </p></td>';
                var noteHideClass = 'display-none';
            } 
        }

        $(`<tr data-rel="add-public-note-`+ v['id'] +`" onclick="passBtnID('add-public-note-`+ v['id']+ `')">
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
    
        <tr class="fidout table-color" id="add-public-note-`+ v['id'] +`" style="display: none;">
            <td colspan="11" style="padding: 6px 13px; color:gray">
            <div class="form-group">
                <button type="button" class="btn btn-success notebtn `+showClass+`" data-id="`+ v['id'] +`" style="float:left;margin-bottom:5px">Save</button>
                <label class="`+showClass+`"><strong>`+publicNote+`</strong></label>
                <div  class="closeform" onclick="closeBtnID('add-public-note-` + v['id'] + `')" style="float:right;margin-bottom:5px"><i class="fa fa-close" style="color: #0896fb;"></i></div>
                <textarea `+noteDisabled+` class="public-note-text form-control `+noteHideClass+`" id="note-` + v['id'] + `" rows="5" name="public-note">`+ v['note'] +`</textarea>
            </div>
            <div class="text-left" title_color>
            <p class="detail-header">` + v['address_text'] +`</p>
            <table class="detailed-table" style="width:100%">
                <tr>
                <td style="width:35%;border:none !important">
                    <table style="width:100%">
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
        </tr>
    
        `).insertAfter(".table-heading-transaction");

    });
}

function polulate_city(agent_scores) {
    $.each(agent_scores, function(k,v){
        console.log(v);
        $(`
        <tr>
            <td class="table-column"><p style="margin-top: 10px;">` + v['city'] +`</p></td>
            <td class="table-column">` + v['agent_rank'] + `</td>
            <td class="table-column">` + v['home_type'] +`</td>
            <td class="table-column">` + v['rank_count'] + `</td>
            <td class="table-column">` + v['city_stats']['avg_dom'].toFixed(2) +`</td>
            <td class="table-column">` + v['avg_dom'].toFixed(2) +`</td>
            <td class="table-column">` + v['city_stats']['s2l_price'].toFixed(2) +`%</td>
            <td class="table-column">` + v['s2l_price'].toFixed(2) +`%</td>
            <td class="table-column">` + v['sold_listings'] +`</td>
            <td class="table-column">` + v['failed_listings'] +`</td>
        </tr>
        `).insertAfter(".table-heading-city");
    });
}