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

function init() {
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
