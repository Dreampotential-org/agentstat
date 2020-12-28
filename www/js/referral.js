//
// profile_id = localStorage.profile_id;
// const queryString = window.location.search;
// const urlParams = new URLSearchParams(queryString);
// received = urlParams.get('received');
// var acceptance_deadline_hour = 1;
// var form_data = {};

// if (received == 'true') {
//     settings = get_settings('referral-received/' + profile_id, 'GET')
// } else {
//     settings = get_settings('referral/' + profile_id + '/', 'GET')
// }
// var form_data = {};

// // console.log(settings);

// $.ajax(settings).done(function (response) {

//     data = JSON.parse(response);
//     // console.log(data['results']);
//     $.each(data['results'], function (k, v) {
//         // console.log(v);
//         item = referral_item
//         item = item.split('[[id]]').join(v['id']);
//         item = item.split('[[date]]').join(v['created_at']);
//         item = item.split('[[referral_type]]').join(v['referral_type']);
//         item = item.split('[[referral_name]]').join(v['first_name'] + ' ' + v['last_name']);
//         item = item.split('[[agent_name]]').join(v['agent_name']);
//         item = item.split('[[referral_fee]]').join(v['referral_fee_percentage'] + '%');
//         item = item.split('[[price]]').join(v['price_min'] + '-' + v['price_max'] + 'K');
//         item = item.split('[[email]]').join(v['email']);
//         item = item.split('[[phone]]').join(v['phone']);

//         $(item).insertAfter('.titleHead');

//     });

// }).fail(function (err) {
//     // alert('Got err');
//     console.log(err);
//     show_error(err);
// });

var acceptance_deadline_hour = 1;
var form_data = {};

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

        // $.each(form_data['agent_ids'], function (k, v) {

        //     form_data['agent'] = v;
        //     console.log(form_data);
        //     settings = get_settings('referral/', 'POST', JSON.stringify(form_data));
        //     $.ajax(settings).done(function (response) {
        //         result = JSON.parse(response);
        //         console.log(result);
        //         window.location = result['sign_url'] + '?redirect_uri=https://agentstat.com/referrals/?';
        //     });

        // });

        // $('#referralModal').modal('hide');

        // console.log(form_data);
        
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

// // step 3
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

function initReferralTable(type='received') {
    if (type == 'received') {
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
            if (type == 'received') {
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
                    var html = `
                    <div class="downloadImgDiv">
                        <img class="downloadImg" data-id="`+row.uid+`" src="/img/download-icon.png"/>
                    </div>
                    `;
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
                    var url = '/profile/'+row.agent_obj.screen_name;
                    return "<a href='"+url+"' target='_blank'>"+row.agent_obj.name+"</a>";;
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
    var address = form_data['street_address']+', '+form_data['city']+', '+form_data['state']+', '+form_data['zipcode'];
    $('#pros_address').val(address);

    $('#pros_phone').val(form_data['phone_number']);
    $('#pros_email').val(form_data['email']);
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


$(document).ready(function () {
    initReferralTable();
    initReferralTable('sent');

    $('#next').click(function () {
        if ($('#step-1').css('display') == 'block') {
            fillReferralForm();  
        } else if ($('#step-2').css('display') == 'block') {
            
            // form_data['agent_ids'] = []
            // $('input[name="selected_agents"]:checked').each(function () {
            //     console.log($(this).val());
            //     form_data['agent_ids'].push($(this).val());
            // });

            selectAgent();
        } else if ($('#step-3').css('display') == 'block') {
            // if ($('input[name=agreement]:checked').val() == 'standart') {
            //     data['acceptance_deadline'] = acceptance_deadline_hour;
            //     form_data['owner'] = profile_id;

            //     $.each(form_data['agent_ids'], function (k, v) {

            //         form_data['agent'] = v;
            //         console.log(form_data);
            //         settings = get_settings('referral/', 'POST', JSON.stringify(form_data));
            //         $.ajax(settings).done(function (response) {
            //             result = JSON.parse(response);
            //         });

            //     });

            //     swal({
            //         title: "Your referral has been created!",
            //         icon: "success",
            //         dangerMode: false,
            //     });
            //     $('#referralModal').modal('hide');
            // }

        } else if ($('#step-4').css('display') == 'block') {
            signReferralBySender();
        }
    });

    $(document).on('click', '#referral_document_pdf',function(){
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
            });
        } else {
            swal({
                title: "Validation Error!",
                text: "You should sign the referring firm",
                icon: "warning",
                dangerMode: true,
            });
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
        $('#referralModal input, #referralModal textarea').val('');
        $('input[name="selected_agents"]').prop('checked', false);

        $('#step-1').css('display', 'block');
        $('#step-2').css('display', 'none');
        $('#step-3').css('display', 'none');
        $('#step-4').css('display', 'none');
    });

    $(document).on('click', 'input[name="selected_agents"]', function () {
        $('input[type="checkbox"]').not(this).prop('checked', false);
    });

    $('.received-tab').on('click', function () {
        $('.received-table-div').show();
        $('.sent-table-div').hide();

        $('.tableHead').removeClass('select-tab');
        $(this).addClass('select-tab');
    });

    $('.sent-tab').on('click', function () {
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
        $("#destinationsign").attr('data-target','');

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
                document.getElementById('destinationsign').remove();
                
                form_data['sender_sign_img'] = data;
            }
            else {
                document.getElementById("ref_sign").value = data;
                document.getElementById('referringsign').remove();

                form_data['receiver_sign_img'] = data;
            }
            imgNode.setAttribute('src', data);
            imgNode.setAttribute('area-hidden', false);
            imgNode.style.display = 'block';
    
            $('#exampleModalCenter').modal('hide');
        });

        document.getElementById('clear-sign').addEventListener('click', function () {
            signaturePad.clear();
        });
    
        // document.getElementById('destinationsign').addEventListener('click', function () {
            // return false;
            // if (window.currentModal != 'destination')
            //     signaturePad.clear();
            // window.currentModal = 'destination'
        // });
        // populate_document();
    });

    $("#referralBtn").click(function () {
        $("#referralModal").modal();
        form_data = {};

        $('#step-1').css('display', 'block');
        $('#step-2').css('display', 'none');
        $('#step-3').css('display', 'none');
        $('#step-4').css('display', 'none');

        $('#referral_document_pdf').attr('disabled', false);
        $('#submit-referral-spinner').hide();
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
});