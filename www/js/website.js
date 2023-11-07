// Get the textarea element and button
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
