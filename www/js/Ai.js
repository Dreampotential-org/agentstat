// Get references to HTML elements by their IDs
const allBtn = document.getElementById("allBtn");
const emailBtn = document.getElementById("emailBtn");
const websiteBtn = document.getElementById("websiteBtn");
const scriptBtn = document.getElementById("scriptBtn");
const photoBtn = document.getElementById("photoBtn");
const smsBtn = document.getElementById("smsBtn");
const socialBtn = document.getElementById("socialBtn");
const websiteDescriptionGenerator = document.getElementById(
  "websiteDescriptionGenerator"
);
const photoGenerator = document.getElementById("photoGenerator");

const visibleElementsContainer = document.getElementById(
  "all-visible-elements"
);

const emailcardElement = document.querySelectorAll(".email");
const websitecardElement = document.querySelectorAll(".website");
const scriptcardElement = document.querySelectorAll(".script");
const photocardElement = document.querySelectorAll(".photo");
const smscardElement = document.querySelectorAll(".sms");
const socialcardElement = document.querySelectorAll(".social");

// Define a function to hide elements by class
function hideElements(elements) {
  for (let i = 0; i < elements.length; i++) {
    elements[i].style.display = "none"; // Hide the elements
    // visibleElementsContainer.appendChild(elements);
    // visibleElementsContainer.style.display = "none";
  }
}

function showElements(elements) {
  for (let i = 0; i < elements.length; i++) {
    elements[i].style.display = "inline-block";
    visibleElementsContainer.appendChild(elements[i]);
  }
}

// Define a function to change the text when the email button is clicked
function show_only_email() {
  showElements(emailcardElement);

  hideElements(websitecardElement);
  hideElements(scriptcardElement);
  hideElements(photocardElement);
  hideElements(smscardElement);
  hideElements(socialcardElement);
}

// Define a function to change the text when the website button is clicked
function show_only_websitel() {
  showElements(websitecardElement);

  hideElements(emailcardElement);
  hideElements(scriptcardElement);
  hideElements(photocardElement);
  hideElements(smscardElement);
  hideElements(socialcardElement);
}

// Define a function to change the text when the scripts button is clicked
function show_only_scripts() {
  showElements(scriptcardElement);

  hideElements(websitecardElement);
  hideElements(emailcardElement);
  hideElements(photocardElement);
  hideElements(smscardElement);
  hideElements(socialcardElement);
}

// Define a function to change the text when the photo button is clicked
function show_only_photo() {
  showElements(photocardElement);

  hideElements(websitecardElement);
  hideElements(scriptcardElement);
  hideElements(emailcardElement);
  hideElements(smscardElement);
  hideElements(socialcardElement);
}

// Define a function to change the text when the sms button is clicked
function show_only_sms() {
  showElements(smscardElement);

  hideElements(websitecardElement);
  hideElements(scriptcardElement);
  hideElements(photocardElement);
  hideElements(emailcardElement);
  hideElements(socialcardElement);
}

// Define a function to change the text when the social button is clicked
function show_only_social() {
  showElements(socialcardElement);

  hideElements(websitecardElement);
  hideElements(scriptcardElement);
  hideElements(photocardElement);
  hideElements(smscardElement);
  hideElements(emailcardElement);
}

function show_all() {
  window.location.href = "";
}

// Function to handle the redirection based on the presence of 'localStorage.session_id'
function redirectToPage(targetUrl) {
  if (localStorage.session_id) {
    // Redirect to the 'website.html' page if the session ID is present.
    window.location.href = targetUrl;
  } else {
    // Redirect to the 'login.html' page if the session ID is not present.
    window.location.href = "/login.html";
  }
}

// Add an event listener to the button element
emailBtn.addEventListener("click", show_only_email);
websiteBtn.addEventListener("click", show_only_websitel);
scriptBtn.addEventListener("click", show_only_scripts);
photoBtn.addEventListener("click", show_only_photo);
smsBtn.addEventListener("click", show_only_sms);
socialBtn.addEventListener("click", show_only_social);
allBtn.addEventListener("click", show_all);

// Pass the target URL as a parameter when setting up the event listener
websiteDescriptionGenerator.addEventListener("click", function () {
  redirectToPage("/website.html");
});

// Pass the target URL as a parameter when setting up the event listener
photoGenerator.addEventListener("click", function () {
  redirectToPage("/photo.html");
});
