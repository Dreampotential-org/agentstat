function init() {

    const form = document.getElementById("propertyForm");
    const submitBtn = document.getElementById("submitBtn");
    const outputField = document.getElementById("outputField");
    const outputTextField = document.getElementById("OutputOfData");
    const copyButton = document.getElementById("copyButton");
    const loginModal = document.getElementById("loginModal");
    // Get a reference to the loading animation container
    const loadingContainer = document.querySelector(".animationContainer");

    // Add a click event listener to the button
    submitBtn.addEventListener("click", async function (e) {
      e.preventDefault();
      // Initialize an array to store the selected values
      const selectedValues = [];

      // Loop through the form elements and check for their values
      for (const element of form.elements) {
        if (element.tagName === "INPUT" || element.tagName === "SELECT") {
          if (element.type === "checkbox" && element.checked) {
            selectedValues.push(element.value);
          } else if (element.type === "select-one" && element.value !== "default") {
            selectedValues.push(element.value);
          }
        }
      }

      for (const element of form.elements) {
        if (element.tagName === "INPUT" || element.tagName === "SELECT") {
          if (element.type === "number" || element.type === "select-one") {
            selectedValues.push(`${element.name}: ${element.value}`);
          }
        }
      }
      // Get the value of the textarea
      const textarea = document.getElementById("inputTextarea");
      selectedValues.push(textarea.value);

      const text = selectedValues.join(", ");
      console.log(text);
      // Clear the form after submission
      form.reset();

      try {
        // Show the loading animation while waiting for the response
        outputField.style.display = "none";
        loadingContainer.style.display = "block";

        // Call generateDescription and wait for its response
        const formatted_response = await generateDescription(text);

        // Once you have the response, hide the loading animation and output the result
        loadingContainer.style.display = "none";
        outputField.style.display = "block";

        // Once you have the response, output it
        outputText(formatted_response);
      } catch (err) {
        // Handle any errors that occur during the request or processing
        console.error("Error:", err);
      }
    });

    // Add a click event listener to the copy button
    copyButton.addEventListener("click", () => {
      // Select the text in the textarea
      outputTextField.select();
      outputTextField.setSelectionRange(0, 99999); // For mobile devices

      // Copy the selected text to the clipboard
      document.execCommand("copy");

      // Deselect the text
      outputTextField.setSelectionRange(0, 0);
    });
}



function convertNewlinesToLineBreaks(inputString) {
  return inputString.replace(/\\n/g, "\n");
}

function outputText(textToOutput) {
  const outputString = textToOutput.replace(/^"|"$/g, "");
  outputTextField.innerHTML = outputString;
  // Use innerHTML for line breaks to be rendered correctly
}

function generateDescription(text) {
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

                if (subscription_data && subscription_data.subscription === 'true') {
                    request_generate_content_api(text)

                }
                else if (subscription_data) {
                    // send them into checkout process
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

            }).then((res) => {
                return res
            });

        });
    } else {
        return window.location.href = '/signup/'
    }

    $("#starbtn").addEventListener("click", function() {
        var formcard = document.querySelector(".formcard");
        formcard.style.display = "block";
    });
}

window.addEventListener('DOMContentLoaded', init, false);

