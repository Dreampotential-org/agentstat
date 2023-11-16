$(document).ready(function(){
// session_id
   
    $('.search_address').click(function(){
        if (isAndroid()) {
            $(".mainDiv").css('height', '700px');
        }
    });
});
 window.addEventListener('DOMContentLoaded', function () {  
 console.log(localStorage.getItem('session_id'))
    let session_id = localStorage.getItem('session_id')
    const signupButton = document.getElementById('signup-button');
    if(session_id != null) {
         signupButton.style.display = 'none';
    } else {
        signupButton.style.display = 'block';
    }
 })

 window.addEventListener('DOMContentLoaded', function () {  
 console.log(localStorage.getItem('session_id'))
    let session_id = localStorage.getItem('session_id')
    const homeprofile = document.getElementById('homeprofile');
    if(session_id != null) {
         homeprofile.style.display = 'block';
    } else {
        homeprofile.style.display = 'none';
    }
 })



function init() {

    console.log("Sanity check!");
    var subscription_data = null;
    var stripe = null;
    const session_id = localStorage.getItem("session_id");
    if (session_id) {
        settings = get_settings_checkout("config/", "GET");
        // init stripe get config key and load stripe library
        $.ajax(settings).done(function(response) {
            data = JSON.parse(response);
            stripe = Stripe(data.publicKey);

            settings = get_settings_checkout("retrieve-subscription/", "GET")
            $.ajax(settings).done(function(response) {
                subscription_data = JSON.parse(response);
                console.log("HEre is my subscription status:" + subscription_data)
            }).then((res) => {
                return res
            });

        });
    }
    $(".agentstat-login").click(function() {
        // if person is not active in their accout ask them to signup
     
        if (!(session_id)) {
            return window.location.href = '/signup/'
        }

        // if they they have subscription var populated
        if (subscription_data && subscription_data.subscription === 'true') {
            return window.location.href = '/Ai/'
        }
        else if (subscription_data) {
            settings = get_settings_checkout("create-checkout-session/", "GET")
            $.ajax(settings).done(function(response) {
                console.log("Data", data)
                data_session = JSON.parse(response);

                // Redirect to Stripe Chaeckout
                stripe = Stripe(data.publicKey);
                console.log("stripe", stripe)
                return stripe.redirectToCheckout({
                    sessionId: data_session.sessionId
                })
            }).then((res) => {
                console.log(res);
            });
        }
    })

}





function request_generate_content_api(text) {
  isLoading = true; // Show loading animation
  
  settings = get_AI_settings('generate-description/', 'POST', JSON.stringify({input_content: text}))
    
    $.ajax(settings).done(function (responseData) {
       
      outputValue = JSON.stringify(responseData);
      convertNewlinesToLineBreaks(outputValue);
    
    

    }).fail(function (err) {
        
    });

 
    
  } 








window.addEventListener('DOMContentLoaded', init, false);
