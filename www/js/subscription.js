function init() {

    console.log("Sanity check!");
    var subscription = null;
    var stripe = null;

    const session_id = localStorage.getItem("session_id");
    if (session_id) {
        settings = get_settings_checkout("config/", "GET");
        // init stripe get config key and load stripe library
        $.ajax(settings).done(function(response) {
            data = JSON.parse(response);
            stripe = Stripe(data.publicKey);
        });

        settings = get_settings_checkout("retrieve-subscription/", "GET")
        $.ajax(settings).done(function(response) {
            subscription_data = JSON.parse(response);
            console.log("HEre is my subscription status:" + subscription_data)
        }).then((res) => {
            return res
        });



    } else {
    }
    $("#submitBtn").click(function() {
        // if person is not active in their accout ask them to signup
        if (!session_id) {
            return window.location.href = './signup/'
        }

        // if they they have subscription var populated
        if (subscription && subscription_data['subscription'].length > 0) {
            return window.location.href = './Ai/'
        }
        else if (subscription) {
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

window.addEventListener('DOMContentLoaded', init, false);
