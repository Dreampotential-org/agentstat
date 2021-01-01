var acceptance_deadline_hour = 1;
var form_data = {};
var isPendingLoad = false;
var pendingReferralId = '';
var declineReferralId = '';
var pendingReferralCount = 0;

// step 1
function fillReferralForm() {
    var fields = ['first_name', 'last_name', 'email', 'phone_number',
        'city', 'price_min', 'price_max', 'referral_fee_percentage',
        'acceptance_deadline', 'referral_type', 'street_address', 'state', 'zipcode'];

    $.each(fields, function (k, v) {
        form_data[v] = $('#' + v).val();
    });

    form_data['acceptance_deadline'] = acceptance_deadline_hour;
    form_data['price_min'] = form_data['price_min'].replace(/\D/g, '');
    form_data['price_max'] = form_data['price_max'].replace(/\D/g, '');

    var buyer_required_fields = ['first_name', 'last_name', 'email', 'phone_number', 'price_min', 'price_max', 'referral_fee_percentage', 'acceptance_deadline'];

    form_data['referral_type'] = $('#referral_type').val().toLowerCase()

    var error = false;
    if (form_data['referral_type'] == 'seller') {
        // Seller validation
        $.each(fields, function (k, v) {
            if ($('#' + v).val() == '' && v !== 'notes') {
                swal({
                    title: "Validation Error!",
                    text: "All fields are required!",
                    icon: "warning",
                    dangerMode: true,
                });
                error = true;
            }
        });
    } else if (form_data['referral_type'] == 'buyer') {
        // Buyyer validation
        errors = '';
        $.each(fields, function (k, v) {
            console.log(buyer_required_fields);
            if ($.inArray(v, buyer_required_fields) !== -1 && $('#' + v).val() == '') {
                error = true;
                errors += v + ' ';
            }
            if (error == true) {
                swal({
                    title: "Validation Error!",
                    text: "You must fill in the following field(s)\n\n" + errors,
                    icon: "warning",
                    dangerMode: true,
                });
            }
        });
    }
    
    form_data['address'] = form_data['street_address'];
    form_data['notes'] = $('#the-textarea').val();

    if (error == false) {
        if ($('#step-1').css('display') == 'block') {
            $('#step-2').css('display', 'block');
            $('#step-1').css('display', 'none');

            var state = $('#agent-state').val();
            settings = get_settings('reports/' + state + '/?page=1', 'GET');
            settings['headers'] = null;

            $.ajax(settings).done(function (response) {
                // console.log(response);
                data = JSON.parse(response);
                $('#agents').empty();
                $.each(data['results'], function (k, v) {
                    var brokerage_name = v['agent_brokerage_info'].split(/\r?\n/)[0];
                    $('#agents').append(`
                    <div class="row">
                        <div class="col-lg-1 col-md-1 col-sm-1 col-xs-1"> <label id="checkbox-holder">
                        <input name='selected_agents' value="` + v['agent_id'] + `" type="checkbox" id="agent-` + v['id'] + `"
                        data-fullname="` + v['agent_full_name'] + `" data-brokerage-name="` + brokerage_name + `" data-screen-name="`+v['pg_agent_screen_name']+`">
                        <span class="checkmark"></span>
                    </label></div>
                        <div class="col-lg-5 col-md-5 col-sm-5 col-xs-5">
                        <span class="agen-name">`+ v['agent_full_name'] + `<span/><br>
                        <label for="agent-` + v['agent_id'] + `">` +
                        brokerage_name + ` (` + v['agent_state'] + `)
                        </label>
                        </div>
                        
                        <div class="col-lg-2 col-md-2 col-sm-2 col-xs-2">
                        <span>100%</span>
                        </div>
                        <div class="col-lg-2 col-md-2 col-sm-2 col-xs-2">
                        <span>100%</span>
                        </div>
                        <div class="col-lg-2 col-md-2 col-sm-2 col-xs-2" style="padding:0;"><a target='_blank' href="/profile/` + v['pg_agent_screen_name'] + `">View Profile</a></div>
                    </div>
                    `);
                });
            });
        }
    }
}

// step 2
function selectAgent() {
    var receiver_web_agent_id = $('input[name="selected_agents"]:checked').val();

    if (receiver_web_agent_id == undefined) {
        swal({
            title: "Validation Error!",
            text: "You should select agent",
            icon: "warning",
            dangerMode: true,
        });
    } else {
        var checkbox = $('input[name="selected_agents"]:checked');
        var linkUrl = '/profile/'+checkbox.data('screen-name');
        var linkHtml = '<a href="'+linkUrl+'" target="_blank">'+checkbox.data('fullname')+'</a>';
        $('.agent-name').html(linkHtml);
        $('.brokerage-name').text(checkbox.data('brokerage-name'));

        data['acceptance_deadline'] = acceptance_deadline_hour;

        form_data['owner'] = localStorage.profile_id;
        form_data['sender_agent'] = localStorage.agent_id;
        form_data['agent'] = receiver_web_agent_id;
        
        $('.type').text(form_data['referral_type']);
        $('.first-name').text(form_data['first_name']);
        $('.last-name').text(form_data['last_name']);
        $('.email').text(form_data['email']);
        $('.phone-number').text(form_data['phone_number']);
        $('.address').text(form_data['street_address']);
        $('.city').text(form_data['city']);
        $('.state').text(form_data['state']);
        $('.zipcode').text(form_data['zipcode']);
        $('.price-min').text(currencyFormat(form_data['price_min']));
        $('.price-max').text(currencyFormat(form_data['price_max']));
        $('.referral-fee').text(form_data['referral_fee_percentage']+'%');
        $('.acceptance-deadline').text(toPrettyDeadline(form_data['acceptance_deadline']));
        $('.notes').text(form_data['notes']);

        $('#step-2').css('display', 'none');
        $('#step-4').css('display', 'block');
    }
}

// // step 3 - todo when give feature to upload their own document
// function showReferralData() {

// }

// step 4
function signReferralBySender() {
    $('#referralModal').modal('hide');
    $('#referral-sign-modal').modal('show');

    populate_document();
}

function searchAgent(search_term) {
    var state = $('#agent-state').val();

    // var search_term = $(this).val();
    settings = get_settings('reports/' + state + '/?page=1', 'GET');
    settings['headers'] = null;

    if (search_term.length > 2) {
        // console.log('search');
        var state = $('#agent-state').val();
        settings = get_settings('reports/' + state + '/?agent_name=' + search_term + '&page=1', 'GET');
        settings['headers'] = null;
    }

    $.ajax(settings).done(function (response) {
        // console.log(response);
        data = JSON.parse(response);
        $('#agents').empty();
        $.each(data['results'], function (k, v) {
            var brokerage_name = v['agent_brokerage_info'].split(/\r?\n/)[0];
            $('#agents').append(`
            <div class="row">
            <div class="col-lg-1 col-md-1 col-sm-1 col-xs-1"> <label id="checkbox-holder">
            <input name='selected_agents' value="` + v['agent_id'] + `" type="checkbox" id="agent-` + v['id'] + `"
            data-fullname="` + v['agent_full_name'] + `" data-brokerage-name="` + brokerage_name + `" data-screen-name="`+v['pg_agent_screen_name']+`">
            <span class="checkmark"></span>
            </label></div>
            <div class="col-lg-5 col-md-5 col-sm-5 col-xs-5">
                <span class="agen-name">`+ v['agent_full_name'] + `<span/><br>
                <label for="agent-` + v['agent_id'] + `">` +
                brokerage_name + ` (` + v['agent_state'] + `)
                </label>
            </div>
            
            <div class="col-lg-2 col-md-2 col-sm-2 col-xs-2">
                <span>100%</span>
            </div>
            <div class="col-lg-2 col-md-2 col-sm-2 col-xs-2">
                <span>100%</span>
            </div>
            <div class="col-lg-2 col-md-2 col-sm-2 col-xs-2" style="padding:0;"><a target='_blank' href="/profile/` + v['pg_agent_screen_name'] + `">View Profile</a></div>
            </div>
            `);
        });
    });
}

function initReferralTable(referralType='received') {
    if (referralType == 'received') {
        var tableId = '#received-referral-table';
    } else {
        var tableId = '#sent-referral-table';
    }

    $(tableId).DataTable( {
        "processing": true,
        "serverSide": true,
        "bPaginate": true,
        "bLengthChange": false,
        "bFilter": false,
        "bSort":false,
        "bAutoWidth": false, 
        "ajax": function(data, callback, settings) {
            if (referralType == 'received') {
                var url = API_URL+'referral/?page='+offsetToPageno(data.start)
            } else {
                var url = API_URL+'referral/?type=sent&page='+offsetToPageno(data.start)
            }
            $.ajax({
                url: url,
                type: "GET",
                beforeSend: function(xhr){xhr.setRequestHeader('Authorization', 'Token ' + localStorage.getItem('session_id'));},
                success: function(res) { 
                    callback({
                        recordsTotal: res.count,
                        recordsFiltered: res.count,
                        data: res.results
                    });
                }
            });
        },
        "columns": [
            { 
                data: null, title: "Referral Agreement", width: '10%',
                render: function(data, type, row, meta){
                    var html = '';
                    if (referralType == 'received') {
                        if (row.status == 'accept' || row.status == 'closed') {
                            html = `
                            <div class="downloadImgDiv">
                                <img class="downloadImg" data-id="`+row.uid+`" src="/img/download-icon.png"/>
                            </div>
                            `;
                        }
                    } else {
                        html = `
                        <div class="downloadImgDiv">
                            <img class="downloadImg" data-id="`+row.uid+`" src="/img/download-icon.png"/>
                        </div>
                        `;
                    }
                    
                    return html;
                }
            },
            { 
                data: "created_at", title: "Date", width: '10%',
                render: function(data, type, row, meta){
                    return niceDateTime(data);
                }
            },
            { 
                data: "referral_type", title: "Type", width: '10%',
                render: function(data, type, row, meta){
                    return data;
                }
            },
            { 
                data: null, title: "Referral Name", width: '10%',
                render: function(data, type, row, meta){
                    return row.first_name + ' ' + row.last_name;
                }
            },
            { 
                data: null, title: "Agent Name", width: '10%',
                render: function(data, type, row, meta){
                    return agentProfileLink(row.agent_obj.screen_name, row.agent_obj.name);
                }
            },
            { 
                data: "referral_fee_percentage", title: "Referral Fee", width: '10%',
                render: function(data, type, row, meta){
                    return data+'%';
                }
            },
            { 
                data: null, title: "Price", width: '10%',
                render: function(data, type, row, meta){
                    return currencyFormat(row.price_min)+' - '+currencyFormat(row.price_max);
                }
            },
            { 
                data: "status", title: "Status", sWidth: '20%',
                render: function(data, type, row, meta){
                    return data;
                }
            },
        ],
        "createdRow": function (row, data, dataIndex) {
            $(row).attr('data-id', data.id);
        }
    });
}

function setCommissionPdf() {
    if (form_data['referral_type'] == 'seller') {
        $('#materialInline1').prop( "checked", true);
        $('#materialInline2').prop( "checked", false);

        $('#listing_firm_comm').val(form_data['referral_fee_percentage']);
        $('#selling_firm_comm').val('');

        $('#listing_firm_comm').prop('readonly', false);
        $('#selling_firm_comm').prop('readonly', true);
    } else {
        $('#materialInline2').prop( "checked", true);
        $('#materialInline1').prop( "checked", false);

        $('#selling_firm_comm').val(form_data['referral_fee_percentage']);
        $('#listing_firm_comm').val('');
        
        $('#selling_firm_comm').prop('readonly', false);
        $('#listing_firm_comm').prop('readonly', true);
    }
}

function populate_document() {
    var date = new Date();
    $('#date-picker').val(niceDate(date));
    
    setCommissionPdf();

    // populate sender agent data
    settings = get_settings('agents/' + form_data['sender_agent'] + '/?no_list=1', 'GET');
    settings['headers'] = null;
    $.ajax(settings).done(function (response) {
        var res = JSON.parse(response);
        $('#refer_broker_name').val(res.full_name);
        var address = res.street_address+', '+res.city+', '+res.state+', '+res.zip_code;
        $('#refer_address').val(address);

        if (res.profile_phone) {
            $('#refer_phone').val(res.profile_phone);
        } else if (res.agent_cell_phone) {
            $('#refer_phone').val(res.agent_cell_phone);
        }

        if (res.profile_email) {
            $('#refer_email').val(res.profile_email);
        } else if (res.email) {
            $('#refer_email').val(res.email);
        }
    });

    // populate receiver agent data
    settings = get_settings('agents/' + form_data['agent'] + '/?no_list=1', 'GET');
    settings['headers'] = null;
    $.ajax(settings).done(function (response) {
        var res = JSON.parse(response);
        $('#dest_broker_name').val(res.full_name);
        var address = res.street_address+', '+res.city+', '+res.state+', '+res.zip_code;
        $('#dest_address').val(address);
        
        if (res.profile_phone) {
            $('#dest_phone').val(res.profile_phone);
        } else if (res.agent_cell_phone) {
            $('#dest_phone').val(res.agent_cell_phone);
        }

        if (res.profile_email) {
            $('#dest_email').val(res.profile_email);
        } else if (res.email) {
            $('#dest_email').val(res.email);
        }
    });

    var full_name = form_data['first_name']+' '+form_data['last_name'];
    $('#pros_name').val(full_name);

    // console.log(form_data);
    if (form_data['status'] == 'accept' || form_data['status'] == 'closed' || isPendingLoad == false) {
        var address = form_data['address']+', '+form_data['city']+', '+form_data['state']+', '+form_data['zipcode'];
        $('#pros_address').val(address);

        $('#pros_phone').val(form_data['phone_number']);
        $('#pros_email').val(form_data['email']);
    } else {
        var confidential_text = 'CONFIDENTIAL (will be show after sign)';
        $('#pros_address').val(confidential_text);
        $('#pros_phone').val(confidential_text);
        $('#pros_email').val(confidential_text);
    }

    $('#doc_comments').val(form_data['notes']);
    
    $('#firm-comm').val(form_data['referral_fee_percentage']);

    $('#acceptance_deadline_pdf').val(form_data['acceptance_deadline']);
}

function formatDate(date) {
    var d = new Date(date),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

    if (month.length < 2)
        month = '0' + month;
    if (day.length < 2)
        day = '0' + day;

    return [year, month, day].join('-');
}

function toPrettyDeadline(hours) {
    switch (hours) {
        case 1:
            text = "1 hour";
            break;
        case 3:
            text = "3 hours";
            break;
        case 6:
            text = "6 hours";
            break;
        case 12:
            text = "12 hours";
            break;
        case 24:
            text = "24 hours";
            break;
        case 48:
            text = "48 hours";
            break;
        case 72:
            text = "3 days";
            break;
        case 168:
            text = "7 days";
            break;

        default:
            text = "";
    }

    return text;
}

function clearReferralFormData() {
    form_data = {};

    $('#referralModal input, #referralModal textarea').val('');
    $('#referral-sign-modal input, #referral-sign-modal textarea').val('');

    $('#referral_fee_percentage').val(1);
    $('#acceptance_deadline').val(1);

    $('input[name="selected_agents"]').prop('checked', false);

    $('#step-1').css('display', 'block');
    $('#step-2').css('display', 'none');
    $('#step-3').css('display', 'none');
    $('#step-4').css('display', 'none');

    $('#referral_document_pdf').attr('disabled', false);
    $('#submit-referral-spinner').hide();
    
    $('#ref_sign').val('');
    $('#referring-sign-img').attr('src', '');
    $('#referring-sign-img').hide();
    $('#referringsign').show();

    $('#dest_sign').val('');
    $('#dest-sign-img').attr('src', '');
    $('#dest-sign-img').hide();
    $('#destinationsign').show();

    $('#acceptance_deadline_pdf').attr('disabled', false);
    $('#materialInline1').attr('disabled', false);
    $('#materialInline2').attr('disabled', false);

    $('.changeable-bg').attr('readonly', false);
    $('.changeable-bg').css('background-color', 'whitesmoke');

    $('#referral_type').val('Seller');
    
    isPendingLoad = false;
    signaturePad.clear();
}

function pendingReferralHtml(obj) {
    var html = `
    <div id="pending-`+obj.id+`" class="referral-one">
        <div class="inner-holder">
            <div class="header">
                <div class="author-img">
                    <img src="/img/blank-profile-picture.png" alt="">
                </div>
                <div class="title">
                    <span>Referral Partner</span>
                    <strong>`+agentProfileLink(obj.sender_agent_obj.screen_name, obj.sender_agent_obj.name)+`</strong>
                </div>
            </div>
            <div class="detail-box">
                <div class="detail-col">
                    <h3>General info</h3>
                    <ul class="detail-list">
                        <li>
                            <p class="location-mark">
                                <span>Referral Location</span>
                                <strong>`+obj.sender_agent_obj.address+`</strong>
                            </p> 
                        </li>
                        <li>
                            <div class="contentbox">
                                <div>
                                    <span>Referral Fee</span>
                                    <strong>`+obj.referral_fee_percentage+`%</strong>
                                </div>
                                <div>
                                    <span>Price Range</span>
                                    <strong>`+currencyFormat(obj.price_min)+`-`+currencyFormat(obj.price_max)+`</strong>
                                </div>
                            </div>
                        </li>
                        <li>
                            Sent: <time>`+niceDateTime(obj.created_at)+`</time> 
                        </li>
                        <li>
                            <span>Expires:</span>
                            <div class="timer_wrapper">
                                <div id="timer-`+obj.id+`"></div>
                            </div>
                        </li>
                    </ul>
                </div>
                <div class="detail-col detail-col2">
                    <h3>client info</h3>
                    <ul class="detail-list">
                        <li>
                            <span>Name</span>
                            <strong>`+obj.first_name+` `+obj.last_name+`</strong>
                        </li>
                        <li>
                            <span>address</span>
                            <strong>`+obj.city+`, `+obj.state+`, `+obj.zipcode+`</strong>
                        </li>
                        <li>
                            <span>Notes</span>
                            <p>`+obj.notes+`</p>
                        </li>
                    </ul>
                </div>
            </div>
            <div class="refbox-footer">
                <div class="btn-holder">
                    <a class="accept-referral" data-id="`+obj.id+`" href="javascript:void(0);">
                        Accept
                        <i id="accept-spinner-`+obj.id+`" class="fa fa-spinner fa-spin" aria-hidden="true" style="display: none;"></i>
                    </a>
                    <a class="decline-referral-modal-btn" data-id="`+obj.id+`" href="javascript:void(0);">Decline</a>
                </div>
            </div>
        </div>
    </div>  
    `;

    $('#pending_referral_div').append(html);

    countDownTimer(obj.id, obj.created_at, obj.acceptance_deadline);
}

Date.prototype.addHours = function(h) {
    this.setTime(this.getTime() + (h*60*60*1000));
    return this;
}

function countDownTimer(id, datetime, expire_hours) {
    var countDownDate = new Date(datetime).addHours(expire_hours).getTime();
    var x = setInterval(function() {
        var now = new Date().getTime();
        var distance = countDownDate - now;
        var days = Math.floor(distance / (1000 * 60 * 60 * 24));
        var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        var seconds = Math.floor((distance % (1000 * 60)) / 1000);
        $('#timer-'+id).text(days + "d " + hours + "h " + minutes + "m " + seconds + "s ");
        if (distance < 0) {
            clearInterval(x);
            $('#timer-'+id).text("EXPIRED");
            
            var data = {
                'status': 'expired',
            };
            updateReferral(data, id);

            pendingReferralCount--;
            referralNotificationBadge(pendingReferralCount);
        }
    }, 1000);
}

function getPendingReferrals() {
    settings = get_settings('referral-pending/', 'GET');
    $.ajax(settings).done(function (response) {
        var res = JSON.parse(response);

        $.each(res, function(k,v){
            pendingReferralHtml(v);
        });  
        
        pendingReferralCount = res.length;
        if (res.length > 0) {
            $('.refrequest-sec').show();
        }
    });
}


function updateReferral(data, referralId) {
    settings = get_settings('referral/'+referralId+'/', 'PUT', JSON.stringify(data));
    $.ajax(settings).done(function (response) {
        setTimeout(function() { 
            $('#received-referral-table').DataTable().ajax.reload();
        }, 200);

        $('#pending-'+referralId).remove();

        $('.received-tab').click();
    });
}

function loadPendingRefferalOnPdf(referralId) {
    pendingReferralId = referralId;
    $('#accept-spinner-'+referralId).show();

    settings = get_settings('referral/'+referralId+'/', 'GET');
    $.ajax(settings).done(function (response) {
        isPendingLoad = true;

        form_data = JSON.parse(response);
        populate_document();
        $('#referral-sign-modal').modal('show');

        $('#referringsign').hide();
        $('#referring-sign-img').show();
        $('#referring-sign-img').attr('src', form_data.sender_sign_img);
        
        $('#acceptance_deadline_pdf').attr('disabled', true);
        $('#materialInline1').attr('disabled', true);
        $('#materialInline2').attr('disabled', true);

        $("#destinationsign").attr('data-toggle','modal');

        $('.changeable-bg').attr('readonly', true);
        $('.changeable-bg').css('background-color', 'white');

        $('#accept-spinner-'+referralId).hide();
    });
}

$(document).ready(function () {
    initReferralTable();
    initReferralTable('sent');

    getPendingReferrals();

    $('#next').click(function () {
        if ($('#step-1').css('display') == 'block') {
            fillReferralForm();  
        } else if ($('#step-2').css('display') == 'block') {
            selectAgent();
        } else if ($('#step-3').css('display') == 'block') {
            // todo: user can also upload their referral document
        } else if ($('#step-4').css('display') == 'block') {
            signReferralBySender();
        }
    });

    $(document).on('click', '#referral_document_pdf',function(){
        if (isPendingLoad == true) {
            if($('#dest-sign-img').is(':visible')){
                $('#referral_document_pdf').attr('disabled', true);
                $('#submit-referral-spinner').show();

                var data = {
                    'receiver_sign_img': form_data['receiver_sign_img'],
                    'status': 'accept',
                };
                updateReferral(data, pendingReferralId);

                pendingReferralCount--;
                referralNotificationBadge(pendingReferralCount);
                
                $('#referral-sign-modal').modal('hide');
                
                clearReferralFormData();
            } else {
                swal({
                    title: "Validation Error!",
                    text: "You should sign the destination firm",
                    icon: "warning",
                    dangerMode: true,
                });
            }
 
        } else {
            if($('#referring-sign-img').is(':visible')){
                var error = false;
                
                if (form_data['referral_type'] == 'seller') {
                    if ($('#listing_firm_comm').val() == '' && $('#firm-comm').val() == '') {
                        error = true;
                    }
                } else {
                    if ($('#selling_firm_comm').val() == '' && $('#firm-comm').val() == '') {
                        error = true;
                    }
                }
    
                var fields = ['pros_name', 'pros_phone', 'pros_email'];
                $.each(fields, function (k, v) {
                    if ($('#' + v).val() == '') {
                        error = true;
                    }
                });
    
                if (error == true) {
                    swal({
                        title: "Validation Error!",
                        text: "You should fill the all fields",
                        icon: "warning",
                        dangerMode: true,
                    });
    
                    return false;
                }
    
                $('#referral_document_pdf').attr('disabled', true);
                $('#submit-referral-spinner').show();
                settings = get_settings('referral/', 'POST', JSON.stringify(form_data));
                $.ajax(settings).done(function (response) {
                    result = JSON.parse(response);
                    $('#referral-sign-modal').modal('hide');
    
                    setTimeout(function() { 
                        $('#sent-referral-table').DataTable().ajax.reload();
                    }, 200);
                    
                    clearReferralFormData();

                    $('.sent-tab').click();
                });
            } else {
                swal({
                    title: "Validation Error!",
                    text: "You should sign the referring firm",
                    icon: "warning",
                    dangerMode: true,
                });
            }
        }
    });


    $('#agent-search').on('keyup', function () {
        var search_term = $(this).val();
        searchAgent(search_term);
    });

    $('#radioBtn a').on('click', function () {
        var sel = $(this).data('title');
        var tog = $(this).data('toggle');
        $('#' + tog).prop('value', sel);

        $('a[data-toggle="' + tog + '"]').not('[data-title="' + sel + '"]').removeClass('active').addClass('notActive');
        $('a[data-toggle="' + tog + '"][data-title="' + sel + '"]').removeClass('notActive').addClass('active');
    });

    const $valueSpan = $('.valueSpan2');
    const $value = $('#referral_fee_percentage');
    $valueSpan.html($value.val() + '%');
    $value.on('input change', () => {
        $valueSpan.html($value.val() + '%');
    });

    const $valueSpan3 = $('.valueSpan3');
    const $value3 = $('#acceptance_deadline');

    $valueSpan3.html($value3.val() + ' hour');
    $value3.on('input change', () => {
        var val = $value3.val();
        switch (val) {
            case '1':
                text = "1 hour";
                acceptance_deadline_hour = 1;
                $(".borcolor").removeClass("bg-border");
                break;
            case '2':
                text = "3 hours";
                acceptance_deadline_hour = 3;
                $(".borcolor").addClass("bg-border");
                $(".borcolor").removeClass("bg-border1");
                break;
            case '3':
                text = "6 hours";
                acceptance_deadline_hour = 6;
                $(".borcolor").addClass("bg-border1");
                $(".borcolor").removeClass("bg-border2");
                break;
            case '4':
                text = "12 hours";
                acceptance_deadline_hour = 12;
                $(".borcolor").addClass("bg-border2");
                $(".borcolor").removeClass("bg-border3");
                break;

            case "5":
                text = "24 hours";
                acceptance_deadline_hour = 24;
                $(".borcolor").addClass("bg-border3");
                $(".borcolor").removeClass("bg-border4");
                break;
            case '6':
                text = "48 hours";
                acceptance_deadline_hour = 48;
                $(".borcolor").addClass("bg-border4");
                $(".borcolor").removeClass("bg-border5");
                break;
            case '7':
                text = "3 days";
                acceptance_deadline_hour = 72;
                $(".borcolor").addClass("bg-border5");
                $(".borcolor").removeClass("bg-border6");
                break;
            case '8':
                text = "7 days";
                acceptance_deadline_hour = 168;
                $(".borcolor").addClass("bg-border6");
                break;

            default:
                text = "1 hour";
        }
        $valueSpan3.html(text);
    });


    $("#phone_number").inputmask({ "mask": "(999) 999-9999" });

    $("input.number").inputmask('decimal', {
        'groupSeparator': ',',
        'autoGroup': true,
        'digits': 2,
        'prefix': '$ ',
        'placeholder': '',
        'rightAlign': false,

    });

    $('textarea').keyup(function () {
        var characterCount = $(this).val().length,
            current = $('#current'),
            maximum = $('#maximum'),
            theCount = $('#the-count');
        current.text(characterCount);
    });

    $(document).on('click', '.show-detail', function () {
        var id = $(this).data('id');
        $('#row-' + id).slideToggle();
    });

    $(document).on('click', '.close-referral-model', function () {
        clearReferralFormData();
    });

    $(document).on('click', 'input[name="selected_agents"]', function () {
        $('input[type="checkbox"]').not(this).prop('checked', false);
    });

    $(document).on('click', '.received-tab',function () {
        $('.received-table-div').show();
        $('.sent-table-div').hide();

        $('.tableHead').removeClass('select-tab');
        $(this).addClass('select-tab');
    });

    $(document).on('click', '.sent-tab',function () {
        $('.received-table-div').hide();
        $('.sent-table-div').show();

        $('.tableHead').removeClass('select-tab');
        $(this).addClass('select-tab');
    });

    $(document).on('click', '.downloadImg', function(){
        var uuid = $(this).data('id');
        var url = API_URL + 'referral-download/'+uuid+'/';
        var win = window.open(url, '_blank');
        win.focus();
    });

    $.get('/_referral_agreement_template.html', function(response){
        $('#sign-pdf-model').html(response);

        $(document).on('click', '.close-signature-modal', function(){
            $('#exampleModalCenter').modal('hide');
        });

        $("#destinationsign").attr('data-toggle','');

        document.getElementById('save-sign').addEventListener('click', function () {
            // console.log(signaturePad.toDataURL('image/png'));
            if (signaturePad.isEmpty()) {
                return alert("Please provide a signature first.");
            }
            var data = signaturePad.toDataURL('image/png');
            var imgNode = document.getElementById('referring-sign-img');
            if (window.currentModal === 'destination') {
                imgNode = document.getElementById('dest-sign-img');
                document.getElementById("dest_sign").value = data;
                // document.getElementById('destinationsign').remove();
                document.getElementById('destinationsign').style.display = 'none';
                
                form_data['receiver_sign_img'] = data;
            }
            else {
                document.getElementById("ref_sign").value = data;
                // document.getElementById('referringsign').remove();
                document.getElementById('referringsign').style.display = 'none';

                form_data['sender_sign_img'] = data;
            }
            imgNode.setAttribute('src', data);
            imgNode.setAttribute('area-hidden', false);
            imgNode.style.display = 'block';
    
            $('#exampleModalCenter').modal('hide');
        });

        document.getElementById('clear-sign').addEventListener('click', function () {
            signaturePad.clear();
        });
    
        document.getElementById('destinationsign').addEventListener('click', function () {
            if (window.currentModal != 'destination')
                signaturePad.clear();
            window.currentModal = 'destination'
        });
    });

    $("#referralBtn").click(function () {
        $("#referralModal").modal();
        clearReferralFormData();
    });

    $(document).on('click', '#materialInline1', function(){
        form_data['referral_type'] = 'seller';
        setCommissionPdf();
    });
    
    $(document).on('click', '#materialInline2', function(){
        form_data['referral_type'] = 'buyer';
        setCommissionPdf();
    });
    
    $(document).on('change', '#listing_firm_comm', function(){
        var fee = $(this).val();
        form_data['referral_fee_percentage'] = fee;
        $('#firm-comm').val(fee);
    });
    
    $(document).on('change', '#selling_firm_comm', function(){
        var fee = $(this).val();
        form_data['referral_fee_percentage'] = fee;
        $('#firm-comm').val(fee);
    });
    
    $(document).on('change', '#firm-comm', function(){
        var fee = $(this).val();
        form_data['referral_fee_percentage'] = fee;

        if (form_data['referral_type'] == 'seller') {
            $('#listing_firm_comm').val(fee);
        } else {
            $('#selling_firm_comm').val(fee);
        }
    });

    $(document).on('change', '#acceptance_deadline_pdf', function(){
        form_data['acceptance_deadline'] = $(this).val();
    });

    $(document).on('change', '#doc_comments', function(){
        form_data['notes'] = $(this).val();
    });

    $(document).on('click', '.accept-referral', function(){
        var id = $(this).data('id');
        loadPendingRefferalOnPdf(id);
    });

    $(document).on('click', '.decline-referral-modal-btn', function(){
        declineReferralId = $(this).data('id');
        $('#referral-decline-modal').modal('show');
    });

    $(document).on('click', '#submit-decline-referral', function(){
        var decline_reason = $('#decline_reason_textarea').val();
        if (decline_reason) {
            var data = {
                'decline_reason': decline_reason,
                'status': 'decline',
            };
            updateReferral(data, declineReferralId);

            pendingReferralCount--;
            referralNotificationBadge(pendingReferralCount);

            $('#referral-decline-modal').modal('hide');
        } else {
            swal({
                title: "Validation Error!",
                text: "You should enter decline reason.",
                icon: "warning",
                dangerMode: true,
            });
        }
    });
});