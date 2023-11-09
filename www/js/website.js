// Get the textarea element and button
settings = get_settings_checkout("config/", "GET")
$.ajax(settings).done(function (response) { 
  data = JSON.parse(response);
const stripe = Stripe(data.publicKey);
let subscribeButton = document.getElementById("subscribe");
subscribeButton.addEventListener("click", () => {
        // Get Checkout Session ID
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
});


const local_storage = localStorage;

const form = document.getElementById("propertyForm");
const submitBtn = document.getElementById("submitBtn");
const outputField = document.getElementById("outputField");
const outputTextField = document.getElementById("OutputOfData");
const copyButton = document.getElementById("copyButton");
const loginModal = document.getElementById("loginModal");
// Get a reference to the loading animation container
const loadingContainer = document.querySelector(".animationContainer");

if (localStorage.session_id) {
} else {
  loginModal.style.display = "block";
}
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

function convertNewlinesToLineBreaks(inputString) {
  return inputString.replace(/\\n/g, "\n");
}

function outputText(textToOutput) {
  const outputString = textToOutput.replace(/^"|"$/g, "");
  outputTextField.innerHTML = outputString; // Use innerHTML for line breaks to be rendered correctly
}

async function generateDescription(text) {
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


// my code

document.getElementById("starbtn").addEventListener("click", function() {
    var formcard = document.querySelector(".formcard");
    formcard.style.display = "block";
});


// Define a constant link
// const constantLink = "https://checkout.stripe.com/c/pay/cs_test_a1oaqp2TUq8l0MQJG5iMGuCdlocqfbzDOpUQqhH5U4yWU4y3wLS8GMUKkm#fidkdWxOYHwnPyd1blpxYHZxWn08MmBLalRUcVRBUXB3R1wyaXd0NHxIQDU1MEtxcTdtSk4nKSdobGF2Jz9%2BJ2JwbGEnPycyNWQ8Z2YyPChhMjFhKDE9YGAoZz01PSg0PD00M2Q8ZDc8YGQzPTRkMWYnKSdocGxhJz8nZGdhY2Q3ZzYoND08ZigxZDRjKGQwNWcoNDcxNWRjZ2E3MGYwZj1mNjcwJykndmxhJz8nPWAwNWNgZzQoMGY1MSgxPDQ2KGQxY2EoM2A0NDNjYzBhYTY1NWNnYGNkJ3gpJ2dgcWR2Jz9eWCknaWR8anBxUXx1YCc%2FJ3Zsa2JpYFpscWBoJyknd2BjYHd3YHdKd2xibGsnPydtcXF1PyoqaWpmZGltanZxPz01MzwneCUl";


// Set the constant link as the href attribute of the anchor element
// document.getElementById("subscribe").href = constantLink;
