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
    $("#submitBtn").click(function() {
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

  try {
    const response = await fetch(SERVER_URL + "ai/generate-description/", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ input_content: text }),
    });

    if (response.ok) {
      const responseData = await response.json();
      outputValue = JSON.stringify(responseData);
      formatted_response = convertNewlinesToLineBreaks(outputValue);
      console.log(formatted_response);
      error = null;
      return formatted_response;
    } else {
      error = new Error(`HTTP Error: ${response.status}`);
      outputValue = "";
    }
  } catch (err) {
    console.error("Error fetching data:", err);
    error = err;
    console.log(error);
    outputValue = "";
  } finally {
    isLoading = false; // Hide loading animation
  }
}


}




window.addEventListener('DOMContentLoaded', init, false);
