
const loginModal = document.getElementById("loginModal");
const fileInput = document.getElementById("upload");
const outputImage = document.getElementById("OutputOfImage");
const outputField = document.getElementById("outputField");
const downloadButton = document.getElementById("downloadButton");
// Get a reference to the loading animation container
const loadingContainer = document.querySelector('.animationContainer');
outputField.style.display = 'none';
// Add an event listener to the "Start Task" button
if (localStorage.session_id){}
  else{
    loginModal.style.display = 'block'
  }
document.getElementById("submitBtn").addEventListener("click", function () {


  outputField.style.display = 'none';
  loadingContainer.style.display = 'block';
  outputImage.style.display = 'none';

  // Check if a file is selected
  if (fileInput.files.length === 0) {
    alert("Please select a file to upload.");
    return;
  }

  // Create a FormData object to send the file
  const formData = new FormData();
  formData.append("video", fileInput.files[0]);

  // Make a POST request to your desired endpoint
  fetch(SERVER_URL + "ai/generate-image/", {
    method: "POST",
    body: formData,
  })
    .then((response) => response.blob()) // Use .blob() to handle binary data
    .then((blob) => {
      // Create a blob URL for the image
      const objectURL = URL.createObjectURL(blob);

      outputField.style.display = 'block';
      loadingContainer.style.display = 'none';
      outputImage.style.display ='inline-block';

      // Set the image source to the object URL
      outputImage.src = objectURL;

      downloadButton.href = objectURL;
      // The download attribute and filename are already set in the HTML

      // Simulate a click on the download button
      downloadButton.style.display = 'inline-block';
    })
    .catch((error) => {
      console.error("Error:", error);
    });
});
