
function isSubscribed() {
   
  
}

function cancelSubscription() {

}

function do_stripe_checkout() {

// static/main.js
// console.log("Sanity check!");
// Get Stripe publishable key

// settings = get_settings_checkout("config/", "GET")
$.ajax(settings).done(function (response) {
    console.log("HEllo")
    data = JSON.parse(response);

      const stripe = Stripe(data.publicKey);

    //   let submitBtn = document.querySelector("#submitBtn");
    //   let cancelBtn = document.querySelector("#cancelBtn");
    //   let retrieveBtn = document.querySelector("#retrieveBtn");

    //   if (submitBtn !== null) {
    //     submitBtn.addEventListener("click", () => {

        if(cancelBtn !== null){
            cancelBtn.addEventListener("click", () => {
        
        settings = get_settings_checkout("create-checkout-session/", "GET")
        $.ajax(settings).done(function (response) {
            data = JSON.parse(response);
            // Redirect to Stripe Chaeckout
            return stripe.redirectToCheckout({sessionId: data.sessionId})
          })
          .then((res) => {
            console.log(res);
          });
        });
    }
      if (cancelBtn !== null){
        cancelBtn.addEventListener("click", () => {
        // Get Checkout Session ID
        settings = get_settings_checkout("cancel-subscription/", "POST")
        $.ajax(settings).done(function (response) {
            data = response;
            alert(data);
          })
          .then((res) => {
            return res
          });
        });
      }

      if (retrieveBtn !== null){
        retrieveBtn.addEventListener("click", () => {
        // Get Checkout Session ID
        console.log("Here for retrieving")
        settings = get_settings_checkout("retrieve-subscription/", "GET")
        $.ajax(settings).done(function (response) {
            subscription_data = JSON.parse(response);
            console.log("Subscription: ", subscription_data)
            if (subscription_data['subscription'].length > 0){
              alert("Subscription already exists");
            }
            else{
              alert("No subsciptions");
            }

          })
          .then((res) => {
            return res
          });
        });
      }
});
}

