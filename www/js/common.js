$("body").delegate(".logout", "click", function(e) {
    localStorage.clear();
    window.location = '/';
});