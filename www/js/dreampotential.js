// on error tell us about it.
window.onerror = function (msg, url, lineNo, columnNo, error) {
  var string = msg.toLowerCase();
  var substring = "script error";
  var url = "https://api.dreampotential.org/livestats/jserror/";

  if (string.indexOf(substring) > -1) {
  } else {
    console.log("POSTING: " + url)
    $.post(url, JSON.stringify({message: msg,
                                page: window.location.href,
                                hostname: window.location.hostname,
                                href: window.location.href,
                                pathname: window.location.pathname,
                                protocol: window.location.protocol,
                                lineNo: lineNo,
                                columnNo: columnNo,
                                error_msg: JSON.stringify(error)}), function () {});
  }
  return false;
};

var getUrlParameter = function getUrlParameter(sParam) {
    var sPageURL = window.location.search.substring(1),
        sURLVariables = sPageURL.split('&'),
        sParameterName,
        i;

    for (i = 0; i < sURLVariables.length; i++) {
        sParameterName = sURLVariables[i].split('=');

        if (sParameterName[0] === sParam) {
            return sParameterName[1] === undefined ? true : decodeURIComponent(sParameterName[1]);
        }
    }
    return false;
};



function init() {
    var WS_SERVER_URL = 'wss://api.dreampotential.org/';
    var contact_id = getUrlParameter('contact');
    if (contact_id) {
        const chatSocket = new WebSocket(
            WS_SERVER_URL + "ws/contact/" + contact_id);
        chatSocket.onopen = function (e) {
          console.log("The connection was setup successfully !");
        };
        chatSocket.onclose = function (e) {
          console.log("Something unexpected happened !");
        };
    }

    var url = "https://api.dreampotential.org/livestats/pageload/";
    $.post(url, JSON.stringify({message: msg,
                                page: window.location.href,
                                hostname: window.location.hostname,
                                href: window.location.href,
                                pathname: window.location.pathname,
                                protocol: window.location.protocol,
                                }), function (res) {
             console.log("page_load event successfull")
        });
}

window.addEventListener("DOMContentLoaded", init, false);
