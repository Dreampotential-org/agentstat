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

//  window.addEventListener('DOMContentLoaded', function () {  
//  console.log(localStorage.getItem('session_id'))
//     let session_id = localStorage.getItem('session_id')
//     const homedropdown = document.getElementById('signup-button');
//     if(session_id != null) {
//          homedropdown.style.display = 'none';
//     } else {
//         homedropdown.style.display = 'block';
//     }
//  })

 
//  window.addEventListener('DOMContentLoaded', function () {  
//  console.log(localStorage.getItem('session_id'))
//     let session_id = localStorage.getItem('session_id')
//     const dropdownMenuLink = document.getElementById('signup-button');
//     if(session_id != null) {
//          dropdownMenuLink.style.display = 'none';
//     } else {
//         dropdownMenuLink.style.display = 'block';
//     }
//  })