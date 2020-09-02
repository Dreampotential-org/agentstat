var reclaimId = window.location.pathname.split('/')[2];

function initReclaimDispute() {
    settings = get_settings('reclaim/'+reclaimId, 'GET');
    settings['headers'] = {};
    $.ajax(settings).done(function (response) {
        var response = JSON.parse(response);
        
        $('#full_name').val(response.current_full_name);
        $('#email').val(response.current_email);
        $('#phone').val(response.current_phone);
        $('#brokerage-name').val(response.current_brokerage_name);
    
    }).fail(function(err) {
        console.log(err.responseText);
    });
}

$(document).ready(function(){
    initReclaimDispute();
    
    $("#phone").inputmask({ "mask": "(999) 999-9999" });

    $('#submit_proof_btn').click(function () {
        var form_data = {};
        var picture_data = $('#picture')[0].files[0]
        var real_estate_license = $('#real-estate-license')[0].files[0]
      
        var reader = new FileReader();
        reader.readAsDataURL(picture_data);
      
        var reader2 = new FileReader();
        reader2.readAsDataURL(real_estate_license);
        var picture_base64 = '';
      
        reader.onload = function () {
      
            reader2.onload = function () {
                real_estate_license_base64 = reader2.result;
            }
        
            picture_base64 = reader.result;
            form_data['current_id_picture'] = picture_base64;
            form_data['current_real_estate_license'] = real_estate_license_base64;
            form_data['current_full_name'] = $('#full_name').val();
            form_data['current_email'] = $('#email').val();
            form_data['current_phone'] = $('#phone').val();
            form_data['current_brokerage_name'] = $('#brokerage-name').val();
        
            settings = get_settings('reclaim/'+reclaimId+'/', 'PUT', JSON.stringify(form_data))
            settings['headers'] = null;

            $.ajax(settings).done(function (response) {
                swal({
                title: "Claim Profile Proof",
                text: "We will review your proof and get back to you within 24 hours",
                icon: "success",
                }).then(function (isConfirm) {
                });
            }).fail(function (err) {
                console.log(err);
                // show_error(err);
            });
        };
        reader.onerror = function (error) {
          console.log('Error: ', error);
        };
    });
});