function init() {
    console.log("We are here")
    //CONFIGURATION
    var options = {
        replaceLineBreaks: false, // true to replace \n by a new line, false by default
        android: {
            intent: 'INTENT'  // send SMS with the native android SMS messaging
            //intent: '' // send SMS without opening any other app, require : android.permission.SEND_SMS and android.permission.READ_PHONE_STATE
        }
    };

    var success = function () { alert('Message sent successfully'); };
    var error = function (e) { alert('Message Failed:' + e); };
    sms.send("18434259777", "test send message", options, success, error);

}
window.addEventListener("DOMContentLoaded", init, false);
