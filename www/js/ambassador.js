function set_referral() {
    var url_string = window.location.href;
    var url = new URL(url_string);
    var agent_ref = url.searchParams.get("ambassador");
    if (agent_ref) {
        localStorage.setItem("ambassador", agent_ref)
    }
    agent_rf = localStorage.getItem("ambassador")
    if (agent_rf) {
        var data = {
            'agent_sn': agent_rf,
        }
        settings = get_settings(
            'set-referral/', 'POST', JSON.stringify(data))
        $.ajax(settings).done(function (response) {
            var msg = JSON.parse(response);
            console.log(msg)
            if (msg == 'Saved') {
                localStorage.removeItem("ambassador")
            }
        }).fail(function(err) {
            alert(err);
            show_error(err);
            console.log(err);
        });
    }
}


window.addEventListener("DOMContentLoaded", set_referral, false);
