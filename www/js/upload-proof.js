var uid = window.location.href.split('/')[4];
if (uid == '') {
    swal({
        title: "Invalid URL",
        text: "Something is wrong with the url. Contact with support here anna@agentstat.com",
        icon: "error",
    }).then(function(isConfirm) {
    });
}

function loadReclaim() {
    settings = get_settings('reclaim/'+uid+'/', 'GET')
    settings['headers'] = null;
    $.ajax(settings).done(function (response) {
        var data = JSON.parse(response);
        $('#full_name').val(data.current_full_name);
        $('#email').val(data.current_email);
        $('#dispute_phone').val(data.current_phone);
        $('#brokerage-name').val(data.current_brokerage_name);
    }).fail(function(err) {
        console.log(err);
        show_error(err);
    });

}

$('#submit_proof_btn').click(function() {
    var form_data = {};
    var picture_data = $('#picture')[0].files[0]
    var real_estate_license = $('#real-estate-license')[0].files[0]

    var reader = new FileReader();
    reader.readAsDataURL(picture_data);

    var reader2 = new FileReader();
    reader2.readAsDataURL(real_estate_license);

    var picture_base64 = '';
    var real_estate_license_base64 = '';

    reader.onload = function () {
        picture_base64 = reader.result;
        reader2.onload = function() {
            real_estate_license_base64 = reader2.result;

            form_data['current_id_picture'] = picture_base64;
            form_data['current_real_estate_license'] = real_estate_license_base64;
            form_data['current_phone'] = $('#dispute_phone').val();
            form_data['current_brokerage_name'] = $('#brokerage-name').val();

            $('#claim-spinner').show();
            $('#claim-check').hide();

            settings = get_settings('reclaim/'+uid+'/', 'PUT', JSON.stringify(form_data))
            settings['headers'] = null;

            $('#submit_proof_btn').prop('disabled', true);

            $.ajax(settings).done(function (response) {
                $('#claim-spinner').hide();
                $('#claim-check').show();

                swal({
                    title: "Submitted Identity Proof!",
                    text: "We will review your dispute and get back to you within 48 hours",
                    icon: "success",
                }).then(function(isConfirm) {
                });

                $('#submit_proof_btn').prop('disabled', false);
            }).fail(function(err) {
                $('#claim-spinner').hide();
                $('#claim-check').hide();
                show_error(err);

                $('#submit_proof_btn').prop('disabled', false);
            });
        }
    };
    reader.onerror = function (error) {
        console.log('Error: ', error);
    };
});


$(document).ready(function(){
    $("#dispute_phone").inputmask({ "mask": "(999) 999-9999" });
    
    loadReclaim();
});
